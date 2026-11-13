# Repeatable Publish, Edit & Rollback Checklist

This checklist provides a structured, repeatable runbook for publishing new content, making revisions, and executing zero-downtime rollbacks on **Fuad Hasan's Professional Portfolio and Technical Blog**.

---

## 1. Pre-Publish Validation Checklist (Authoring Phase)

Complete these checks before toggling any article to `published: true`:

- [ ] **Frontmatter Compliance:**
  - [ ] `title`: Clear, descriptive, accurately reflects technical content ($\ge 5$ characters).
  - [ ] `excerpt`: Informative summary between 120 and 160 characters.
  - [ ] `pubDate`: Valid ISO date format (`YYYY-MM-DD`).
  - [ ] `category`: Matches one of the 6 approved taxonomy values (`ASP.NET Core`, `Architecture`, `Distributed Systems`, `Databases`, `Angular`, `Engineering Notes`).
  - [ ] `tags`: At least 1 properly capitalized technology tag.
  - [ ] `cover`: References an existing image in `/images/blog/` (e.g. `/images/blog/my-pattern.svg`).
  - [ ] `coverAlt`: Descriptive alt text explaining the graphic ($\ge 5$ characters) for WCAG 2.2 AA accessibility.
  - [ ] `seoTitle` / `seoDescription`: If overriding, ensure title $\le 70$ chars and description $\le 160$ chars.
- [ ] **Typography & Heading Structure:**
  - [ ] No `# H1` used in Markdown body (the template automatically injects the article title as the sole H1).
  - [ ] Section headings start with `## H2` and descend logically (`### H3`, `#### H4`). No heading levels are skipped.
- [ ] **Code Blocks & Formatting:**
  - [ ] Every fenced code block specifies a language tag (`csharp`, `typescript`, `sql`, `bash`, `json`).
  - [ ] Indentation is consistent (4 spaces for C#, 2 spaces for TypeScript/JSON).
  - [ ] Complex architectural notes use GitHub-style callouts (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`).
- [ ] **Factual Authenticity & Link Hygiene:**
  - [ ] All code snippets and architecture statements reflect authentic, verified engineering principles.
  - [ ] External links use HTTPS and open safely (`rel="noopener noreferrer"`).
  - [ ] No private phone numbers, residential addresses, or unapproved contact details are present.

---

## 2. Publishing Workflow Checklist (Go-Live Phase)

- [ ] **Step 1: Toggle Publish State in Pages CMS:**
  - Open **[Pages CMS](https://pagescms.org)**.
  - Select your draft post under **"Technical Blog Posts"**.
  - Toggle **"Published (Uncheck for Draft)"** to **ON** (`published: true`).
  - Click **"Save"**.
- [ ] **Step 2: Commit Delivery:**
  - Pages CMS pushes a commit directly to the `main` branch of `fuadhasan01/fuad-portfolio`.
  - Typical commit message: `Update <slug>.md`.
- [ ] **Step 3: Automated Build & Deployment:**
  - Cloudflare Pages detects the commit via GitHub webhook.
  - Cloudflare runs: `npm run build` (`astro check && astro build`).
  - Expected build duration: $\approx 45\text{--}75$ seconds.
  - Status indicator turns green: **"Success: Finished"**.

---

## 3. Post-Publish Verification Checklist (5-Minute Smoke Test)

Once the Cloudflare Pages build succeeds, verify the live deployment:

- [ ] **1. Route Accessibility:**
  - Visit: `https://fuadhasan.is-a.dev/blog/<your-slug>/`
  - Verify the page loads with HTTP 200 (no 404 or white screen).
- [ ] **2. Responsive Typography & Layout:**
  - Inspect on desktop: Title, reading time, sticky Table of Contents, and author metadata render.
  - Inspect on mobile viewport ($\le 390\text{px}$): Heading sizes scale cleanly, no horizontal page overflow.
- [ ] **3. Code Block Functionality:**
  - Confirm syntax highlighting is active.
  - Click the **"Copy"** button on a code snippet; confirm the icon changes to a checkmark with visual confirmation.
  - Verify long code lines scroll horizontally within the code block without stretching the article layout.
- [ ] **4. Blog Catalog & Search Integration:**
  - Navigate to `https://fuadhasan.is-a.dev/blog`.
  - Confirm the new article card appears at the top of the article list.
  - Type a keyword from the new article in the search bar; verify the card appears in search results.
- [ ] **5. RSS Feed Ingestion:**
  - Open `https://fuadhasan.is-a.dev/rss.xml`.
  - Confirm the `<item>` block exists with the new article title, link, pubDate, and description.
- [ ] **6. XML Sitemap Ingestion:**
  - Open `https://fuadhasan.is-a.dev/sitemap-0.xml`.
  - Confirm `<loc>https://fuadhasan.is-a.dev/blog/<your-slug></loc>` is indexed.

---

## 4. Substantive Revision / Content Edit Checklist

When updating an existing published article:

- [ ] **1. Minor Typos / Clarifications:**
  - Edit the Markdown text in Pages CMS and click **"Save"**.
  - `updatedDate` does not need to be updated for trivial spelling corrections.
- [ ] **2. Major Technical Updates or Code Revisions:**
  - Edit the content in Pages CMS.
  - Set the **"Last Updated Date"** field (`updatedDate`) to today's date (`YYYY-MM-DD`).
  - *Validation Rule:* `updatedDate` must be greater than or equal to `pubDate`.
  - Click **"Save"**.
  - Verify that the article header displays: `Updated: [Date]`.

---

## 5. Instant Emergency Rollback Runbook

If an article is published with errors, security concerns, or unexpected rendering issues, use one of the following three zero-downtime recovery methods:

### Method A: Instant Cloudflare Pages Rollback (< 30 Seconds)
*Best for immediate emergency rollback when production must be restored instantly without waiting for a new build.*

1. Log into the **[Cloudflare Dashboard](https://dash.cloudflare.com/)**.
2. Navigate to **Workers & Pages** $\rightarrow$ **`fuad-portfolio`**.
3. Select the **Deployments** tab.
4. Locate the last known good deployment (prior to the problematic publish).
5. Click the three dots icon ($\cdots$) on the right side of that deployment row.
6. Select **"Rollback to this deployment"**.
7. Confirm the prompt.
8. **Result:** Cloudflare Pages immediately points all live edge routing to the prior static snapshot. Downtime is zero seconds.

---

### Method B: Pages CMS Unpublish (< 90 Seconds)
*Best for routine unpublishing where you want to keep your draft edits safe for later.*

1. Open **[Pages CMS](https://pagescms.org)**.
2. Select the article under **"Technical Blog Posts"**.
3. Toggle **"Published (Uncheck for Draft)"** to **OFF** (`published: false`).
4. Click **"Save"**.
5. **Result:** Pages CMS pushes the change to GitHub. Cloudflare Pages rebuilds the site. The article route is deleted from `dist/`, removed from `rss.xml`, excluded from `sitemap-0.xml`, and scrubbed from search.

---

### Method C: Git Revert via Terminal / GitHub Web UI (< 2 Minutes)
*Best for code-level or multi-file rollbacks.*

```bash
# In your local repository or via GitHub Web UI
git checkout main
git pull origin main

# Revert the specific commit that introduced the issue
git revert HEAD --no-edit

# Push the revert commit to trigger automated CI build
git push origin main
```

- **Result:** Cloudflare Pages receives the revert commit, builds the site cleanly, and deploys the restored version.
