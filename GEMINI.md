# Fuad Portfolio - Gemini Agent Project Rules

## Source of truth
- Read `docs/SRS.md` before planning or changing product behavior.
- Use the four supplied wireframes and architecture diagram in `docs/assets/` as layout/architecture references, not finished UI designs.
- Refer to `docs/AI_AGENT_START_PROMPT.md` for the initial P0/P1 analysis.
- Follow the SRS's P0-P8 sequence and use requirement IDs (FR, NFR, SEC, TC) in plans and completion notes.
- If a requirement and this file conflict, identify the conflict and ask before making an architectural change.

## Approved architectural baseline
- Astro static site with strict TypeScript, Tailwind CSS and Astro content collections validated with Zod.
- Markdown project case studies and technical blog posts; GitHub-backed Pages CMS via `.pages.yml`.
- GitHub repository and CI; Cloudflare Pages for static hosting; privacy-minded analytics.
- No custom backend, SQL database, visitor authentication, public `/admin`, paid platform, or AI chatbot in v1 unless the owner approves an SRS change and ADR.
- Prefer semantic HTML, small accessible Astro components, and minimal browser JavaScript.

## Truthfulness and privacy
- Never invent employment achievements, numbers, case-study outcomes, testimonials, demos, metrics, certificates, or articles presented as authored by the owner.
- Never publish a private phone number, address, unapproved email, or the private resume PDF.
- Use clear TODOs or omit unavailable public content. Verify live project, GitHub and social links before adding CTAs.
- Treat the public production domain as unconfirmed until the owner activates it.

## Execution protocol
1. Work on one approved phase or narrowly scoped feature at a time.
2. Begin with a concise plan: SRS requirement IDs, affected files, implementation steps and tests.
3. Show the plan before editing. Obtain approval for significant architectural changes, external actions and destructive commands.
4. Implement small, reviewable changes; do not rewrite unrelated files or add unnecessary dependencies.
5. Run actual quality checks for the phase: format/lint if configured, TypeScript/Astro checks, build, unit/E2E tests and browser inspection where applicable.
6. For UI work, inspect at 360, 390, 768, 1024 and 1440 CSS px and in light/dark mode; check keyboard navigation, contrast and reduced motion.
7. Report evidence: implemented requirements, test commands/results, screenshots or routes reviewed, unresolved issues, and the next gate. Never claim an unrun test passed.
8. Update `docs/AGENT_PROGRESS.md`, relevant ADRs and README whenever applicable. Stop after the phase; do not silently start the next phase.

## Content and security gates
- Keep unpublished drafts out of routes, generated client search data, RSS and sitemap.
- Enforce safe URL schemes, unique stable slugs, validated frontmatter and safe external links.
- Check that published article images render and have useful alt text.
- Never expose secrets in repository files, client bundles or logs. Do not bypass approvals with an unrestricted execution mode.
- Do not deploy or change DNS before explicit owner approval.

## Completion definition
A task is done only when its SRS acceptance criteria are met, changes are reviewable, tests have been executed and reported, and no high-severity issues remain undisclosed.
