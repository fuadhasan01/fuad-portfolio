---
title: "EduSubmit"
summary: "Full-stack assignment and submission management platform with role-based access for Admin, Teacher, and Student workflows."
featured: true
status: "completed"
technologies: ["ASP.NET Core", "Angular", "EF Core", "PostgreSQL", "CQRS", "JWT"]
cover: "/images/projects/edusubmit.webp"
coverAlt: "EduSubmit web application user interface"
repositoryUrl: "https://github.com/fuadhasan01/EduSubmitAPI"
demoUrl: "https://edusubmit-web-gamma.vercel.app/login"
role: "Full Stack Engineer"
timeline: "2024"
---

## Overview

EduSubmit is an assignment and submission management application designed to streamline academic workflows between teachers, students, and institutional administrators.

## Architecture and Decisions

- **Clean Architecture & CQRS:** Handled command and query separation to keep read and write logic isolated.
- **Security & Authorization:** Role-based access control (RBAC) enforced via JSON Web Tokens (JWT).
- **Relational Data Modeling:** Entity Framework Core with PostgreSQL for relational integrity.

