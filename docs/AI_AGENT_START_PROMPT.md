# AI Agent - Implementation Start Prompt

You are acting as the senior engineer and product designer responsible for implementing Fuad Hasan's **professional portfolio and technical blog**.

## Authoritative inputs

1. Read `Fuad_Hasan_Portfolio_SRS.md` completely, including the diagrams in `assets/`.
2. If provided, review the owner-approved resume and the current repository, but do not publish personal data without approval.
3. Use the selected baseline: Astro + strict TypeScript + Tailwind CSS + Astro content collections + Pages CMS + Cloudflare Pages.
4. Treat architecture choices as proposed decisions until accepted; document justified deviations in ADRs.

## Your first deliverable - do not code yet

Return:

1. A concise summary of the product and technology choices.
2. Content that can be verified from sources versus content requiring owner approval.
3. A P0/P1 work plan, including reviewable desktop and mobile mockups.
4. A proposed repository tree, component boundaries, and content schemas.
5. A test and acceptance checklist for P0/P1.
6. A list of truly blocking questions only (do not ask about nonblocking stylistic preferences repeatedly).

## Engineering rules for all later phases

- Implement one phase at a time, following Section 15 of the SRS.
- Use actual responsive browser checks, not code review alone.
- Run and report build, type checks, unit and E2E tests appropriate to the phase.
- Never fabricate testimonials, employment claims, metrics, URLs or features.
- Do not add a database, server-side authentication, or a paid service without a documented requirement.
- Treat a public domain as unconfirmed until registered and connected.
- Preserve public-site privacy; do not expose phone numbers or private contact details from source documents.
- Keep `docs/SRS.md`, ADRs, README and test coverage synchronized with implementation.
- Each phase completion report must show implemented scope, test evidence, remaining issues, and the next phase gate.
