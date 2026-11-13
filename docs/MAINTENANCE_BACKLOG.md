# Upkeep, Maintenance & Editorial Backlog Plan

This document establishes the ongoing maintenance cadence, editorial calendar, privacy-focused analytics review protocol, and cost-defense guardrails for **Fuad Hasan's Professional Portfolio and Technical Blog**.

---

## 1. Upkeep & Maintenance Cadence

To ensure the portfolio remains secure, performant, and reliable without consuming significant time or introducing unexpected regressions, follow this scheduled operational cadence:

| Frequency | Area | Responsible Action | Verification Command / Metric |
|---|---|---|---|
| **Weekly** | Analytics & Traffic | Review Cloudflare Web Analytics for visitor patterns and referral sources. | Cloudflare Dashboard $\rightarrow$ Web Analytics |
| **Monthly** | External Links & Demos | Verify external repository URLs, project demos (`EduSubmit`, `LibraryMS`, `Mini Account`), and social links. | [`tests/e2e/smoke-test-production.mjs`](file:///d:/Playground/fuad-portfolio/tests/e2e/smoke-test-production.mjs) |
| **Monthly** | Content Review | Review draft articles in Pages CMS; publish completed topics or update outdated references. | `https://pagescms.org` |
| **Quarterly** | Security & Dependencies | Run npm dependency audits and update minor/patch releases of Astro, Tailwind, and plugins. | `npm audit && npm outdated` |
| **Quarterly** | Performance & A11y Audit | Run Lighthouse and Axe-core accessibility checks against representative pages. | `npm run test` & `npx lighthouse` |
| **Annually** | Domain & Service Terms | Review domain registration status (`fuadhasan.is-a.dev` or custom domain) and confirm GitHub/Cloudflare free-tier terms. | Registrar / Cloudflare DNS settings |

---

## 2. Dependency Health & Security Protocol

### A. Routine Security Scanning
Run npm vulnerability audits quarterly:

```bash
npm audit
```

- **Policy:** Treat any `high` or `critical` severity vulnerability in production dependencies as an immediate blocker.
- **Remediation:** Apply `npm audit fix` for safe SemVer-compatible upgrades. If a breaking major version is required, test in a separate branch before merging into `main`.

### B. Astro & Package Updates
- Before applying Astro major updates, review the [Astro Migration Guides](https://docs.astro.build/en/guides/upgrade-to/).
- Always run the full automated verification suite before committing dependency upgrades:

```bash
npm run check
npm test
npm run build
```

---

## 3. Editorial Calendar & Content Backlog

The technical blog is designed to showcase deep backend engineering expertise in C#, ASP.NET Core, database optimization, distributed messaging, and clean system architecture.

### Upcoming Editorial Pipeline (Next 6 Months)

| Target Date | Proposed Title | Category | Technical Focus & Key Concepts | Status |
|---|---|---|---|---|
| **Dec 2026** | *Implementing Idempotent Consumer Patterns with MassTransit & RabbitMQ* | Distributed Systems | Message de-duplication, Outbox consumer idempotency, consumer state tracking in PostgreSQL. | Backlog |
| **Jan 2027** | *Deep Dive into EF Core Interceptors for Soft Deletes and Audit Trails* | Databases | `SaveChangesInterceptor`, global query filters, temporal audit logging without repository bloat. | Backlog |
| **Feb 2027** | *Structuring Modular Monoliths in .NET 9 with Clean Architecture* | Architecture | Domain boundaries, module isolation, in-memory MediatR communications vs. out-of-process messaging. | Backlog |
| **Mar 2027** | *Optimizing Angular 20 Signals for High-Frequency State Updates* | Angular | Signal stores, computed states, fine-grained change detection vs RxJS `async` pipes. | Backlog |
| **Apr 2027** | *PostgreSQL Indexing Strategies for High-Throughput Relational Workloads* | Databases | B-Tree vs BRIN indexes, composite indexing, partial indexes, and analyzing `EXPLAIN ANALYZE` output. | Backlog |
| **May 2027** | *Building Resilient External HTTP Integrations with Polly in ASP.NET Core* | ASP.NET Core | Circuit breakers, jittered exponential backoffs, rate limiting, and HTTP client connection pooling. | Backlog |

### Editorial Principles
1. **Authenticity:** Every code snippet must represent real-world, battle-tested patterns. No hypothetical or non-functional pseudo-code.
2. **Clarity over Jargon:** Focus on explaining *why* a particular trade-off was chosen, not just how to implement it.
3. **Diagram First:** Pair every complex architectural article with a clean SVG diagram illustrating data flow or transactional boundaries.

---

## 4. Privacy-Minded Analytics Review Protocol

In accordance with SRS privacy requirements and ADR-004, the site uses **Cloudflare Web Analytics** exclusively.

### Key Privacy & Compliance Guarantees
- **Zero Tracking Cookies:** Cloudflare Web Analytics operates without setting client-side cookies or `localStorage` tokens.
- **Zero Personal Data Collection:** No IP addresses, device identifiers, or visitor fingerprinting are retained.
- **No GDPR / ePrivacy Banner Needed:** Because no non-essential cookies or personal data are collected, visitor consent banners are legally unnecessary.
- **Zero Third-Party Ad Trackers:** No Google Analytics, Meta Pixel, or ad tracking scripts are loaded.

### Monthly Analytics Review Checklist
1. **Core Web Vitals Monitoring:**
   - **LCP (Largest Contentful Paint):** Target $\le 1.2\text{s}$ (Good $\le 2.5\text{s}$).
   - **INP (Interaction to Next Paint):** Target $\le 50\text{ms}$ (Good $\le 200\text{ms}$).
   - **CLS (Cumulative Layout Shift):** Target $0.00$ (Good $\le 0.1$).
2. **Top Content Performance:**
   - Identify the most visited technical articles.
   - Consider writing follow-up articles or companion deep dives for top-performing posts.
3. **Top Referral Sources:**
   - Track inbound referral distribution from LinkedIn, GitHub, tech communities, and organic search.
4. **Error Rates:**
   - Inspect 404 error spikes to identify dead inbound backlinks or broken external URLs.

---

## 5. Cost Defense & Free-Tier Operational Guardrails

The portfolio is architected to operate at **\$0.00 / month indefinitely**. To prevent surprise charges or tier lock-in, adhere to these strict limits:

| Service | Free Tier Allocation | Current Portfolio Usage | Safety Margin |
|---|---|---|---|
| **Cloudflare Pages** | 500 builds / month; unlimited requests; unlimited bandwidth | $\approx 20\text{--}40$ builds / month | $> 90\%$ headroom remaining |
| **GitHub** | Unlimited public repositories; 2,000 CI Actions min/mo | $\approx 50\text{--}100$ CI min / month | $> 95\%$ headroom remaining |
| **Pages CMS** | Free open-source client-side app (GitHub App integration) | Completely free; zero subscription | $100\%$ free |
| **Domain (`is-a.dev`)** | Free developer domain through GitHub PR | Free open-source initiative | $100\%$ free |

### Architectural Guardrails Against Feature Creep
- **No Custom Serverless/SSR Functions:** Keep all routes static (`output: 'static'`). Serverless functions introduce cold starts, execution limits, and potential runtime charges.
- **No SQL / Managed Database:** All content lives in version-controlled Git Markdown files.
- **No Paid Headless CMS:** Avoid migrating to Contentful, Sanity, or Prismic which enforce paid tiers once asset or API limits are reached.
- **No AI Chatbot Runtime in v1:** Keep case studies and technical articles static and searchable via the client-side Lunr/MiniSearch island.

---

## 6. Maintenance & Feature Backlog (Icebox)

Low-risk future enhancements that may be implemented when prioritized by the owner:

- [ ] **Print Stylesheet for Articles:** Clean CSS `@media print` rules allowing readers to print or save articles as PDF without navbars or sidebars.
- [ ] **Reading Progress Indicator:** Lightweight, unhydrated CSS scroll-driven progress bar on blog articles (`animation-timeline: scroll()`).
- [ ] **Giscus Discussion Integration (Optional):** GitHub Discussions-backed commenting system for articles (free, zero-cookie, uses GitHub OAuth, no custom database).
- [ ] **Article Share Sheet:** Native Web Share API button with clipboard fallback for sharing posts on mobile devices.
- [ ] **Dark Mode Syntax Theme Toggle:** Allow users to toggle between multiple syntax highlighting themes (e.g. GitHub Dark vs. Tokyo Night).
