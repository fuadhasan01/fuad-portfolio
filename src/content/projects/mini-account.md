---
title: "Mini Account Management System"
summary: "Financial accounting records application supporting hierarchical chart of accounts and balanced voucher entries."
featured: true
status: "completed"
category: "Architecture & ERP"
technologies: ["ASP.NET Core 8", "Razor Pages", "SQL Server", "Bootstrap 5", "jQuery", "C#"]
cover: "/images/projects/mini-account.svg"
coverAlt: "Mini Account financial accounting records and voucher management system interface"
repositoryUrl: "https://github.com/fuadhasan01/MiniAccountApp"
role: "Full Stack Developer"
timeline: "2024"
---

## Overview

**Mini Account Management System** is a double-entry bookkeeping application designed to manage hierarchical charts of accounts, journal vouchers, and ledger postings. Built with ASP.NET Core Razor Pages and Microsoft SQL Server, the application enforces strict transactional balance rules where every financial voucher must satisfy the fundamental double-entry equation: $\text{Total Debits} = \text{Total Credits}$.

---

## The Problem & Financial Requirements

Accurate accounting software demands zero margin for arithmetic or relational error:
- **Hierarchical Chart of Accounts:** Accounts must be organized hierarchically (Assets, Liabilities, Equity, Revenue, Expense) with multi-level parent-child rollups.
- **Double-Entry Balance Invariants:** A voucher transaction cannot be committed unless debits and credits sum to zero. Unbalanced entries compromise financial statements.
- **Auditability & Posting Controls:** Once posted to the general ledger, journal entries require immutable audit records and historical traceability.

---

## Architecture & Technical Decisions

The application emphasizes transactional integrity and server-rendered data validation:

```text
+-------------------------------------------------------------+
|                ASP.NET Core Razor Pages UI                  |
|     (Server-Side Validation, Tag Helpers, Bootstrap UI)     |
+------------------------------+------------------------------+
                               | Model Binding & Validation
+------------------------------v------------------------------+
|                   Business Logic & Ledger                   |
|       +---------------------------------------------+       |
|       |         Voucher Balancing Validator         |       |
|       +---------------------------------------------+       |
|       |      Hierarchical Account Code Evaluator    |       |
|       +---------------------------------------------+       |
|       |         ADO.NET / EF Core Transactions      |       |
+------------------------------+------------------------------+
                               | SQL Connection (T-SQL)
+------------------------------v------------------------------+
|                    Microsoft SQL Server                     |
|           (Accounts, Vouchers, Ledger Postings)             |
+-------------------------------------------------------------+
```

### Key Engineering Decisions

1. **Strict Server-Side Voucher Validation:**  
   To prevent incomplete or unbalanced records, voucher submissions undergo atomic server-side validation ensuring that $\sum \text{Debits} - \sum \text{Credits} = 0$ before executing the database commit.
2. **Hierarchical Account Code Structure:**  
   Account numbers follow standard structural numbering conventions (e.g., `1000` Assets, `1100` Current Assets, `1110` Cash at Bank), facilitating recursive ledger aggregation.
3. **Server-Rendered Razor Pages:**  
   Leveraged ASP.NET Core Razor Pages for high-efficiency data entry forms with rapid page generation and minimal client-side runtime overhead.

---

## Visual Demonstration & System Diagrams

<!-- TODO [Owner Approval Required]: Upload high-resolution production UI screenshots and formal C4 architecture diagram -->

> **Asset Status:** Source code and schema migrations are publicly accessible on GitHub at [MiniAccountApp](https://github.com/fuadhasan01/MiniAccountApp). High-resolution ledger workflow screenshots and database diagrams are pending final owner approval.

---

## Key Features

- **Hierarchical Chart of Accounts:** Multi-tier categorization of financial accounts with parent-child rollups.
- **Journal Voucher Management:** Interactive voucher entry with dynamic row addition and real-time balance checks.
- **General Ledger Postings:** Automated posting of verified vouchers into individual account ledgers.
- **Reporting Support:** Account balances structured for trial balance and financial summary generation.

---

## Engineering Takeaways

- Financial applications require database-level and application-level defensive checks to guarantee data invariants.
- Razor Pages provides a reliable, lightweight development model for data-heavy administrative applications.
