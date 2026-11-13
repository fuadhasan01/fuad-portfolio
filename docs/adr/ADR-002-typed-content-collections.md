# ADR-002: Markdown and Typed Content Collections instead of Database

## Status
Accepted

## Context
A technical portfolio and blog requires structured content management:
- Blog posts with metadata (slugs, tags, categories, publication dates, draft toggles, SEO titles).
- Project case studies with metadata (tech stacks, repository links, demo URLs, problem descriptions).
- Protection against runtime formatting errors, missing fields, or broken links.

Traditional content architectures often rely on relational databases (e.g., PostgreSQL, SQL Server) or headless CMS APIs (e.g., Strapi, Sanity, Contentful). However, hosting a database introduces recurring costs, connection pooling concerns, backups, and schema migration overhead. External headless CMS platforms introduce API rate limits, third-party vendor lock-in, and monthly fees.

## Decision
We adopt **Git-backed Markdown files validated by Astro Content Collections with strict Zod schemas** (`src/content.config.ts`).
- Content is stored directly in the Git repository under `src/content/blog/` and `src/content/projects/`.
- Every Markdown file's frontmatter is validated during CI and build time against strict Zod definitions.
- Builds fail fast if required fields are missing, if invalid categories are specified, if dates are malformed, or if `updatedDate < pubDate`.
- Draft posts (`published: false`) are programmatically excluded at build time from route generation, search indexes, RSS feeds, and sitemaps.

## Consequences
### Positive
- **Version Controlled:** All content edits, revisions, and rollbacks are tracked via standard Git commits.
- **Type Safety:** TypeScript types are automatically inferred from Zod schemas across layouts and components.
- **Zero Running Costs:** No database instances to host, backup, or maintain.
- **Portability:** Content is stored in standard Markdown and frontmatter, free from vendor lock-in.

### Negative / Trade-offs
- Adding or editing content requires a Git commit (mitigated by Pages CMS integration; see ADR-003).
- Relational queries (e.g., complex multi-table joins) cannot be performed; relationships must be modeled via array filtering in Astro.

