# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** Technical recruiters, talent acquisition specialists, and engineering hiring managers looking for rapid signals of role fit, verified technical competencies (.NET, C#, Angular, SQL, Distributed Systems), credentials, and fast contact/resume access.
- **Secondary:** Senior engineering interviewers and systems architects conducting in-depth technical evaluations of engineering rigor, architectural decision-making, and production case studies.
- **Tertiary:** Software engineers and peers reading practical, hype-free technical articles on distributed patterns, CQRS, and EF Core optimizations.

## Product Purpose

Serve as the authentic, enduring professional asset and digital flagship for Fuad Hasan. The site enables prospective employers and engineering collaborators to evaluate his capabilities, inspect verifiable proof of project outcomes, read in-depth engineering writing, and initiate direct professional contact. Success is measured by immediate clarity of professional identity, zero friction in reaching out or downloading the resume, and seamless technical credibility.

## Positioning

Evidence-backed engineering depth over superficial hype. Unlike generic developer portfolios with fabricated metrics, demo-only repos, or inflated claims, every project case study documents concrete responsibilities, production architecture trade-offs, and verified outcomes. The design and implementation reflect senior engineering craft: ultra-fast static delivery, 100/100 Lighthouse scores, and WCAG 2.2 AA accessibility.

## Operating Context

- Evaluated during fast hiring screens (often 30–60 seconds on initial scan) on desktop and mobile devices.
- Reviewed in technical interview rounds where interviewers probe architecture decisions, repo links, and technical blog posts.
- Content managed statically via GitHub and Git-backed Pages CMS without server-side overhead or recurring hosting expenses.

## Capabilities and Constraints

- **Core Capabilities:** Clean responsive homepage with prominent identity, About narrative, Experience timeline, featured Project case studies with verified repository links, searchable Blog with tag filtering and reading time estimates, Contact hub with verified social links, accessible RSS feed, and downloadable resume.
- **Technical Constraints:** Pure static Astro site; strict TypeScript; Tailwind CSS; Astro content collections with Zod schema validation; zero visitor tracking/cookies; privacy-first analytics; no client-side database, no public `/admin`, and no unverified external dependencies.
- **Truthfulness Rule:** Strictly zero fabricated claims, unverified metrics, fake client logos, or false testimonials. Unavailable content is cleanly omitted rather than filled with placeholder claims.
- **Privacy Protections:** Never expose private personal phone numbers or physical addresses.

## Brand Commitments

- **Identity:** Fuad Hasan — Full Stack Software Engineer (specializing in C#, ASP.NET Core, Angular, SQL Server, and scalable application architecture).
- **Tone & Voice:** Professional, articulate, pragmatic, grounded, and technically rigorous.
- **Visual Values:** Understated luxury dark mode default with seamless light toggle; typographic restraint (Instrument Serif, DM Sans, JetBrains Mono); high-contrast accessible color scheme; distraction-free content-first layout.
- **Verified Channels:** GitHub (`fuadhasan01`), LinkedIn (`fuadhasan01`), LeetCode (`fuadhasan01`), and direct verified email.

## Evidence on Hand

- Verified employment history at Efficient Software Solutions LTD and Pakiza Software LTD (`src/pages/experience.astro`, `docs/SRS.md`).
- Verified academic record: B.Sc. in Computer Science & Engineering from United International University (UIU) with Magna Cum Laude honors (`src/pages/about.astro`).
- Verified production project case studies: EduSubmit, LibraryMS, and Mini-Account (`src/content/projects/`).
- Verified in-depth technical articles: "Understanding the Outbox Pattern in .NET Applications", "Practical CQRS in .NET APIs Without Over-Engineering", and "EF Core Query Optimization" (`src/content/blog/`).
- Verified resume PDF (`public/resume/Fuad_Hasan_Resume.pdf`).

## Product Principles

1. **Authenticity Over Hype:** Present verified facts, real architectural trade-offs, and honest engineering context; never invent metrics or vanity achievements.
2. **Speed & Restraint:** Serve content with zero bloat and sub-second loading; avoid gratuitous JavaScript or gimmicky UI that slows the visitor down.
3. **Scanability First:** Ensure recruiters can capture role fit, core stack, and credentials within 10 seconds of landing.
4. **Accessible Craft:** Meet WCAG 2.2 AA standards unconditionally with keyboard navigation, screen-reader semantics, and deliberate contrast across light and dark modes.

## Accessibility & Inclusion

Full compliance with WCAG 2.2 AA guidelines across all viewports (360px to 1440px+). Zero automated axe-core violations, explicit focus rings, skip-to-content links, dark/light theme persistence without flash (FOUC), and support for `prefers-reduced-motion`.
