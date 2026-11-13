---
title: "Practical CQRS in .NET APIs Without Over-Engineering"
excerpt: "How to decouple command mutations from query pipelines in ASP.NET Core applications while keeping codebases maintainable."
published: true
pubDate: 2026-11-10
updatedDate: 2026-11-10
category: "Architecture"
tags: ["ASP.NET Core", "CQRS", "Clean Architecture", "C#"]
cover: "/images/blog/cqrs-pattern.svg"
coverAlt: "CQRS architectural flow separating command mutations from query projections"
seoTitle: "Practical CQRS in .NET APIs | Fuad Hasan"
seoDescription: "A pragmatic guide to implementing CQRS in ASP.NET Core without excessive boilerplate or architectural overhead."
---

## The Motivation for Responsibility Segregation

In traditional CRUD architectures, the same repository entities and models often handle both transactional writes and analytical read operations. As applications evolve, read requirements diverge significantly from domain write models:
- **Write Operations:** Require rigorous validation, business invariant checks, and transactional integrity.
- **Read Operations:** Demand flat projections, selective column querying, pagination, and low-latency execution without change-tracking overhead.

Command Query Responsibility Segregation (CQRS) addresses this tension by explicitly separating the command path (mutations) from the query path (reads).

> *"At its heart, CQRS is simply the creation of two separate paths through your application: one for commands that mutate state, and one for queries that return state without side effects."*
> — **Architecture Principle**

---

## Architectural Comparison: Commands vs Queries

Understanding the architectural differences between write commands and read queries prevents common design pitfalls:

| Dimension | Command Model (Write) | Query Model (Read) |
|---|---|---|
| **Intent** | Mutate system state | Retrieve representation |
| **Side Effects** | Permitted & expected | Strictly prohibited |
| **Tracking** | EF Core Change Tracker active | `AsNoTracking()` or raw SQL |
| **Data Shape** | Domain Aggregates & Invariants | Flat DTOs optimized for UI |
| **Validation** | FluentValidation & Business Rules | Parameter range & format checks |

---

## Designing Clean Command and Query Handlers

Rather than introducing heavy distributed event stores when unnecessary, a pragmatic in-process CQRS pattern isolates requests using lightweight command and query objects with [MediatR](https://github.com/jbogard/MediatR) or Wolverine.

### 1. The Command Handler (Write Path)

Commands represent deliberate intent to mutate system state. They encapsulate the payload needed to execute a specific business transaction:

```csharp
public sealed record CreateOrderCommand(
    Guid CustomerId, 
    IReadOnlyList<OrderItemDto> Items
) : IRequest<Result<Guid>>;

public sealed class CreateOrderCommandHandler 
    : IRequestHandler<CreateOrderCommand, Result<Guid>>
{
    private readonly AppDbContext _dbContext;

    public CreateOrderCommandHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<Guid>> Handle(
        CreateOrderCommand command, 
        CancellationToken cancellationToken)
    {
        // 1. Enforce business invariants
        if (!command.Items.Any())
            return Result.Failure<Guid>("Orders must contain at least one item.");

        var order = Order.Create(command.CustomerId, command.Items);
        
        // 2. Persist aggregate state within transactional boundary
        await _dbContext.Orders.AddAsync(order, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        // Long chained line to verify horizontal code-block scrolling without container blowout:
        var auditMetadata = string.Format("Order {0} committed for Customer {1} with {2} items at timestamp {3:O} by operator {4}", order.Id, order.CustomerId, order.Items.Count, DateTime.UtcNow, "SYSTEM");

        return Result.Success(order.Id);
    }
}
```

### 2. The Query Handler (Read Path)

Queries bypass rich domain entities entirely, projecting directly from the database into lightweight read DTOs:

```csharp
public sealed record GetOrderSummaryQuery(Guid OrderId) 
    : IRequest<OrderSummaryDto?>;

public sealed class GetOrderSummaryQueryHandler 
    : IRequestHandler<GetOrderSummaryQuery, OrderSummaryDto?>
{
    private readonly AppDbContext _dbContext;

    public GetOrderSummaryQueryHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OrderSummaryDto?> Handle(
        GetOrderSummaryQuery query, 
        CancellationToken cancellationToken)
    {
        return await _dbContext.Orders
            .AsNoTracking()
            .Where(o => o.Id == query.OrderId)
            .Select(o => new OrderSummaryDto
            {
                OrderId = o.Id,
                CustomerName = o.Customer.FullName,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString()
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
```

#### SQL Optimization for Read Projections

For high-throughput read operations, targeted SQL indexing on foreign keys and projection columns delivers single-digit millisecond responses:

```sql
-- Covering index for order summary query projections
CREATE NONCLUSTERED INDEX IX_Orders_CustomerId_Covering
ON dbo.Orders (CustomerId, Status)
INCLUDE (TotalAmount, CreatedAtUtc);
```

#### Frontend Consumer Integration (TypeScript)

On the client side, typed API clients invoke endpoints mapped directly to the query contracts:

```typescript
export interface OrderSummaryDto {
  orderId: string;
  customerName: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
}

export async function fetchOrderSummary(orderId: string): Promise<OrderSummaryDto> {
  const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/summary`);
  if (!response.ok) {
    throw new Error(`Failed to load order summary: ${response.statusText}`);
  }
  return response.json();
}
```

---

## Pragmatic Trade-offs

1. **Avoid Premature Event Sourcing:**
   - Not every domain model requires separate physical databases.
   - Starting with a single relational database partitioned logically between commands and queries provides 80% of CQRS benefits without distributed sync complexity.
2. **Clear Boundaries:**
   - Segregating commands from queries makes code reviews and unit testing straightforward.
   - Side-effects are physically impossible in query handlers.
