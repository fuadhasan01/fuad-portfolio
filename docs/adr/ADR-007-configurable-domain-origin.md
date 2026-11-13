# ADR-007: Externalized Domain Origin Configuration without Hardcoded Canonical Hosts

## Status
Accepted

## Context
During development and deployment, the portfolio will exist across multiple distinct environments:
1. Local development: `http://localhost:4321`
2. Staging / Preview: `https://<branch>.fuad-portfolio.pages.dev`
3. Candidate Production: `https://fuadhasan.is-a.dev` or `https://fuadhasan.dev`

If URLs (canonical tags, OpenGraph share images, sitemaps, RSS feeds) are hardcoded to a specific host (such as Cloudflare's technical `.pages.dev` domain), preview environments can accidentally index `.pages.dev` URLs into search engines, or switching domains later could require manually editing dozens of templates and components.

## Decision
We centralize site identity, base URLs, and canonical generation inside a dedicated configuration module (`src/data/siteSettings.ts`) with environment variable overrides:
- Canonical URLs, sitemap generation, and OpenGraph image tags derive strictly from `siteSettings.siteUrl`.
- An environment variable `PUBLIC_SITE_URL` allows overriding the domain at build time in CI/CD without modifying code.
- By default, during production builds, `siteSettings.siteUrl` defaults to the approved production domain.
- `robots.txt` explicitly disallows crawler indexing on non-production preview deployments where applicable.

## Consequences
### Positive
- **SEO Consistency:** Search engines index only the canonical production domain.
- **Portability:** Switching between `fuadhasan.is-a.dev` and `fuadhasan.dev` requires updating a single configuration setting.
- **Preview Isolation:** Prevents duplicate content penalties caused by preview deployments.

### Negative / Trade-offs
- Build scripts and components must consistently import URL helpers from `src/utils/seo.ts` rather than writing absolute path strings.

