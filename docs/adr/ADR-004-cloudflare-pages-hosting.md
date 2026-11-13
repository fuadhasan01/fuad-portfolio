# ADR-004: Cloudflare Pages for Static Hosting instead of Vercel or Custom Server

## Status
Accepted

## Context
The portfolio requires a reliable, fast, and globally distributed static hosting provider that supports:
- Automatic Git-based continuous deployment from the `main` branch.
- Instant PR preview deployments for pull request reviews.
- Seamless custom domain binding with automatic, managed HTTPS/TLS certificates.
- Generous free-tier limits without aggressive commercial or bandwidth restrictions.
- Independent branding (avoiding forced platform branding such as Vercel banners or platform-specific subdomains in production).

## Decision
We select **Cloudflare Pages** as the primary deployment platform for the portfolio.
- Build command: `npm run build`.
- Build output directory: `dist`.
- Deployment mode: Pure static assets served from Cloudflare's global edge network (no Cloudflare Workers SSR adapter required for v1).
- TLS: Automatic Cloudflare-managed universal SSL certificate with forced HTTPS and HTTP/2 or HTTP/3 support.
- Preview deployments: Cloudflare automatically deploys branches and PRs to preview URLs (`<branch>.<project>.pages.dev`) for testing prior to merging into `main`.

## Consequences
### Positive
- **Global Edge Performance:** Assets are cached and served from hundreds of global Cloudflare data centers with minimal latency.
- **Zero Platform Fees:** Cloudflare Pages offers unlimited bandwidth and 500 builds/month on its free tier.
- **Zero Maintenance:** No Linux servers, Nginx configurations, or OS security patches to manage.
- **Preview Isolation:** PRs generate preview links automatically without altering the production domain.

### Negative / Trade-offs
- Pure static hosting cannot execute server-side Node.js or C# backend code at request time (aligns with ADR-001).
- Custom subdomains (e.g., `is-a.dev`) require specific DNS CNAME and Cloudflare API verification steps during domain connection.

