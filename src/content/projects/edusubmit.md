---
title: "EduSubmit"
summary: "Full-stack assignment and submission management platform with role-based access for Admin, Teacher, and Student workflows."
featured: true
status: "completed"
category: "Full Stack"
technologies: ["ASP.NET Core", "Angular", "EF Core", "PostgreSQL", "CQRS", "JWT"]
cover: "/images/projects/edusubmit.svg"
coverAlt: "EduSubmit academic assignment and submission management portal interface"
repositoryUrl: "https://github.com/fuadhasan01/EduSubmitAPI"
demoUrl: "https://edusubmit-web-gamma.vercel.app/login"
role: "Full Stack Engineer"
timeline: "2024"
---

## Overview

**EduSubmit** is a full-stack educational workflow platform engineered to streamline assignment distribution, student submission tracking, and grading workflows across academic institutions. Built using modern .NET and Angular architectures, the system coordinates three distinct user roles—Administrators, Teachers, and Students—ensuring each actor has tailored interfaces and secure, role-restricted operations.

---

## The Problem & Requirements

Academic institutions often face fragmented workflows when managing coursework:
- **Role Inconsistencies:** Teachers need flexible tools to define assignments and deadlines, while students require clear visibility into pending tasks and submission statuses.
- **Security & Authorization:** Preventing unauthorized grade modification or submission spoofing requires strict, verifiable identity and claim-based access controls.
- **Data Integrity:** Ensuring submission timestamps, student associations, and assignment lifecycles are consistently recorded in relational storage without orphaned records.

---

## Architecture & Technical Decisions

The application follows Clean Architecture principles paired with Command Query Responsibility Segregation (CQRS) to isolate transactional operations from read queries:

```text
+-------------------------------------------------------------+
|                      Angular 20 Client                      |
|           (Standalone Components, RxJS, Reactive Forms)     |
+------------------------------+------------------------------+
                               | HTTPS / JWT Bearer
+------------------------------v------------------------------+
|                   ASP.NET Core 9 Web API                    |
|       +---------------------------------------------+       |
|       |         Role-Based Auth Middleware          |       |
|       +---------------------------------------------+       |
|       |         CQRS Commands & Query Handlers      |       |
|       +---------------------------------------------+       |
|       |      Entity Framework Core (Data Access)    |       |
+------------------------------+------------------------------+
                               | Npgsql
+------------------------------v------------------------------+
|                     PostgreSQL Database                     |
|           (Assignments, Submissions, Users, Roles)          |
+-------------------------------------------------------------+
```

### Key Engineering Decisions

1. **Clean Architecture & CQRS Separation:**  
   Organizing domain logic into explicit command handlers (e.g., creating an assignment, submitting student work) and query handlers (e.g., fetching dashboard assignment lists) keeps business rules isolated, highly testable, and maintainable.
2. **JWT & Claim-Based Authorization:**  
   JSON Web Tokens (JWT) encode identity claims and verified roles (`Admin`, `Teacher`, `Student`), verified via ASP.NET Core authorization policies at the controller/endpoint level.
3. **Relational Schema with PostgreSQL & EF Core:**  
   Relational constraints enforce submission deadlines, student enrollment relationships, and audit metadata. EF Core migrations manage schema versioning across development and production environments.

---

## Visual Demonstration & System Diagrams

<!-- TODO [Owner Approval Required]: Upload high-resolution production UI screenshots and formal C4 architecture diagram -->

> **Asset Status:** Verified live web deployment is operational on Vercel at [EduSubmit Web](https://edusubmit-web-gamma.vercel.app/login). Production screenshots and formal architecture diagrams will be integrated following final owner review.

---

## Key Features

- **Role-Based Workflows:** Distinct, responsive dashboards tailored for Administrators, Teachers, and Students.
- **Assignment Distribution:** Structured assignment creation with due dates, description guidelines, and attachment specifications.
- **Submission Tracking:** Instant feedback on submission statuses (submitted, pending review, evaluated).
- **Secure Authentication:** Token-based session management with automatic refresh handling.

---

## Engineering Takeaways

Building EduSubmit reinforced several core architectural practices:
- Designing modular ASP.NET Core backends with strict separation between API contracts and persistence layers.
- Structuring Angular applications with modern standalone components and reactive state patterns for responsive user experiences.
