# ADR-003: Pages CMS Integration backed by GitHub OAuth instead of Custom Admin

## Status
Accepted

## Context
While the site owner (Fuad Hasan) is comfortable working with code and Git, managing blog articles, uploading images, and editing case studies is significantly more productive with a dedicated editorial web UI. 

Building a custom admin dashboard (`/admin`) into the application would require:
- A server runtime or serverless database backend to store sessions.
- Authentication mechanisms (passwords, JWTs, OAuth flows).
- Custom file-upload handling and security measures against malicious file uploads.
- Ongoing maintenance and security patching to prevent unauthorized access.

## Decision
We integrate **Pages CMS** (https://pagescms.org) via a repository-level configuration file (`.pages.yml`).
- Pages CMS runs entirely in the browser and connects directly to the GitHub repository using GitHub OAuth.
- Fuad authenticates via his personal GitHub account (`fuadhasan01`). No public admin endpoints or credentials exist on the portfolio site.
- Content updates and image uploads performed in Pages CMS trigger standard Git commits directly to the GitHub repository.
- GitHub commits trigger automated build and deployment on Cloudflare Pages.

## Consequences
### Positive
- **Zero Admin Attack Surface:** No `/admin` routes, session cookies, or database credentials exist on the public portfolio website.
- **Rich Editorial Experience:** Provides an intuitive web UI with rich text Markdown editing, draft management, image uploads, and frontmatter forms.
- **Auditability:** Every editorial change is captured in the Git commit history with author attribution.
- **Zero Cost:** Pages CMS is free and open-source for personal GitHub repositories.

### Negative / Trade-offs
- Edits do not update the live site instantly; changes require a standard build-and-deploy cycle (1–2 minutes).
- Requires a GitHub account with write access to the repository.

