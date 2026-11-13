# ADR-001: Astro Static Generation over SSR / Full-Client SPAs

## Status
Accepted

## Context
Fuad Hasan is a Full Stack Software Engineer whose professional work focuses heavily on C#, ASP.NET Core, and Angular. However, for a personal portfolio and technical engineering blog, the primary operational goals are:
- Instant page load speeds and SEO indexing.
- Zero server hosting maintenance and zero database running costs.
- Resilience against downtime and security vulnerabilities.
- Flawless readability on mobile and desktop without client hydration delays.

While single-page application frameworks like Angular or full-stack server frameworks like ASP.NET Core MVC are excellent for dynamic line-of-business applications (demonstrated in Fuad's project case studies), using them for a static content portfolio introduces unnecessary hosting costs, server runtime maintenance, and JavaScript bundle overhead.

## Decision
We select **Astro** configured in pure static generation mode (`output: 'static'`) with **strict TypeScript**.
- Astro generates 100% pure static HTML/CSS at build time for all content routes (`/`, `/about`, `/experience`, `/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`, `/contact`, `/404`).
- Client-side JavaScript is strictly isolated to necessary interactive islands (`ThemeToggle`, `MobileMenu`, `BlogSearch`, and `ProjectFilter`).
- Case studies and blog posts are authored in standard Markdown and compiled into static HTML.

## Consequences
### Positive
- **Performance:** Near-perfect Lighthouse scores (target $\ge 90$ mobile) with zero hydration overhead on content pages.
- **Cost:** Serves entirely from edge CDN caches with $0/month compute costs.
- **Reliability & Security:** Zero runtime server execution, eliminating SSR crashes, server injection vulnerabilities, and server memory leaks.
- **SEO:** Fully rendered semantic HTML directly available to search engine crawlers without JavaScript execution delays.

### Negative / Trade-offs
- Dynamic client-side interactions require explicit island architecture.
- Any content change requires a static rebuild and deployment cycle (typically 1–2 minutes on Cloudflare Pages).

