---
title: "LibraryMS"
summary: "Multi-branch library management system handling book circulation, lending rules, reservations, fines, and granular RBAC."
featured: true
status: "completed"
category: "Backend & Systems"
technologies: ["ASP.NET Core 9", "Angular 14", "EF Core", "PostgreSQL", "JWT", "FluentValidation", "Serilog", "Docker"]
cover: "/images/projects/libraryms.svg"
coverAlt: "LibraryMS multi-branch book circulation and lending management system interface"
repositoryUrl: "https://github.com/fuadhasan01/LibraryManagementSystemAPI"
frontendRepositoryUrl: "https://github.com/fuadhasan01/LibraryManagementSystemFrontend"
role: "Backend & Systems Engineer"
timeline: "2024"
---

## Overview

**LibraryMS** is a multi-branch library circulation and cataloging platform architected to manage distributed book inventories, lending lifecycles, patron reservations, and automated overdue fine calculations. The project features a modular ASP.NET Core 9 backend and an Angular client, supported by containerized PostgreSQL services for reproducible environments.

---

## The Problem & System Requirements

Modern distributed libraries encounter operational complexity when sharing catalog and inventory records across physical locations:
- **Multi-Branch Tracking:** Multiple branches hold distinct physical copies of titles with independent checkout states and availability statuses.
- **Lending Rule Compliance:** Borrowing limits, duration windows, and fine policies must be enforced consistently across all lending transactions.
- **Reservation Queuing:** Patrons reserving unavailable titles require priority-ordered queues that trigger availability notices upon return.

---

## Architecture & Technical Decisions

The system is designed with domain isolation and containerized deployment at its core:

```text
+-------------------------------------------------------------+
|                     Angular 14 Client                       |
|           (Circulation Desk, Patron Search, Admin UI)       |
+------------------------------+------------------------------+
                               | HTTPS REST Endpoints
+------------------------------v------------------------------+
|                   ASP.NET Core 9 Web API                    |
|       +---------------------------------------------+       |
|       |         Multi-Branch Circulation Engine     |       |
|       +---------------------------------------------+       |
|       |      Lending Rules & Automated Fine Logic   |       |
|       +---------------------------------------------+       |
|       |      Entity Framework Core Data Access      |       |
+------------------------------+------------------------------+
                               | PostgreSQL Protocol
+------------------------------v------------------------------+
|                     Dockerized PostgreSQL                   |
|       (Multi-branch catalogs, Loans, Patrons, Fines)        |
+-------------------------------------------------------------+
```

### Key Engineering Decisions

1. **Multi-Branch Inventory Modeling:**  
   Separating abstract title metadata (ISBN, author, publication) from physical copy entities (barcode, branch identifier, condition, status) allows seamless inter-branch tracking and inventory audits.
2. **Deterministic Overdue Fine Logic:**  
   Fine calculations are evaluated based on business rules factoring in checkout durations, grace periods, and return timestamps, ensuring transparent accounting.
3. **Docker Containerization for Reproducibility:**  
   Docker configurations ensure consistent development and integration environments across PostgreSQL and backend services, eliminating environment drift.

---

## Visual Demonstration & System Diagrams

<!-- TODO [Owner Approval Required]: Upload high-resolution production UI screenshots and formal C4 architecture diagram -->

> **Asset Status:** Both backend API and frontend client repositories are publicly available on GitHub for code inspection. Visual UI screenshots and formal branch workflow diagrams are prepared for owner sign-off.

---

## Key Features

- **Multi-Branch Cataloging:** Granular catalog search across multiple branches with real-time copy availability.
- **Circulation Management:** Check-in, check-out, and renewal workflows with automated loan limit validations.
- **Automated Fine Tracking:** Calculation of overdue fees with payment status logging.
- **Role-Based Security:** Separate permissions for librarians, branch administrators, and members.

---

## Engineering Takeaways

- Effective relational data modeling is crucial for preventing race conditions during concurrent book checkouts.
- Containerizing backend dependencies ensures reliable developer onboarding and integration testing.
