# Phase P7 Deployment & Operational Runbook
**Fuad Hasan | Professional Portfolio & Technical Blog**
**Platform:** Cloudflare Pages (Static Hosting)  
**Production Branch:** `main`  
**Output Directory:** `dist`  

---

## 1. Overview & Build Contract

The portfolio is architected as an immutable, zero-server static site. Cloudflare Pages serves the compiled HTML, CSS, JavaScript, and media assets globally from Cloudflare's Anycast edge network with zero operating costs.

### Cloudflare Pages Build Specification
| Setting | Value | Notes |
|---|---|---|
| **Framework preset** | `Astro` | Standard static site configuration |
| **Build command** | `npm run build` | Runs `astro check && astro build` |
| **Build output directory** | `dist` | Contains all pre-rendered HTML and assets |
| **Root directory** | `/` | Root of repository |
| **Production branch** | `main` | Automatic deployment trigger on commit |

### Recommended Environment Variables (Cloudflare Pages Dashboard)
| Variable Name | Recommended Value | Purpose |
|---|---|---|
| `NODE_VERSION` | `22` (or `20.18.0`) | Ensures modern Node.js runtime for build runner |
| `PUBLIC_SITE_URL` | `https://fuadhasan.is-a.dev` | Canonical domain origin override for builds |
| `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` | *(Optional token from Cloudflare)* | Activates privacy-minded Web Analytics beacon |

---

## 2. External Approvals Queue (Required Before Public Activation)

Before initiating live public deployment and DNS routing, the following approvals must be authorized by the owner:

1. **Repository Connection Authorization:**
   - Authorize Cloudflare Pages to access `https://github.com/fuadhasan01/fuad-portfolio`.
   - Grant repository read and webhook permissions for branch `main`.

2. **Final Domain Ownership & Strategy Selection:**
   - **Path A (Free Developer Subdomain):** `fuadhasan.is-a.dev` via the `is-a-dev/register` community repository.
   - **Path B (Independent Custom Domain):** e.g. `fuadhasan.dev` registered via Cloudflare Registrar, Namecheap, or Porkbun.
   - *Status:* Domain is treated as unconfirmed until explicitly activated by the owner.

3. **DNS Records & SSL/TLS Issuance Authorization:**
   - Authorize adding the `CNAME` record targeting `<project>.pages.dev`.
   - Confirm Cloudflare Universal SSL issuance (Automatic HTTPS).

4. **Public Privacy Compliance (Email & Resume Publication):**
   - Confirm publication of approved public contact email: `contact@fuadhasan.dev`.
   - Confirm publication of sanitized resume PDF: `/resume/Fuad_Hasan_Resume.pdf` (contains verified employment & education; zero personal phone numbers or residential addresses).

5. **Analytics Activation:**
   - Confirm whether Cloudflare Web Analytics should be activated on launch.

---

## 3. Step-by-Step Cloudflare Pages Setup Guide

### Step 3.1: Connect GitHub Repository to Cloudflare Pages
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, navigate to **Compute (Workers & Pages)** $\rightarrow$ **Pages**.
3. Click **Create a project** $\rightarrow$ **Connect to Git**.
4. Select the GitHub account and choose repository: `fuadhasan01/fuad-portfolio`.
5. Configure build settings:
   - **Project name:** `fuad-portfolio`
   - **Production branch:** `main`
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Under **Environment variables (Advanced)**, add:
   - `NODE_VERSION` = `22`
   - `PUBLIC_SITE_URL` = `https://fuadhasan.is-a.dev` (or your chosen production domain)
7. Click **Save and Deploy**. Cloudflare Pages will execute the initial build and assign a technical preview address (e.g. `fuad-portfolio.pages.dev`).

---

### Step 3.2: Custom Domain Binding

#### Option A: Binding `fuadhasan.is-a.dev` (Free Developer Subdomain)
1. In Cloudflare Pages project settings, go to **Custom domains** $\rightarrow$ **Set up a custom domain**.
2. Enter `fuadhasan.is-a.dev` and click **Continue**.
3. Cloudflare will provide the target CNAME (e.g., `fuad-portfolio.pages.dev`).
4. Fork the [is-a-dev/register](https://github.com/is-a-dev/register) repository on GitHub.
5. Create a new file `domains/fuadhasan.json`:
   ```json
   {
     "owner": {
       "username": "fuadhasan01",
       "email": "contact@fuadhasan.dev"
     },
     "record": {
       "CNAME": "fuad-portfolio.pages.dev"
     }
   }
   ```
6. Submit a Pull Request. Once merged by the is-a.dev maintainers, DNS will propagate automatically.
7. Return to Cloudflare Pages; status will update to **Active** with automatic SSL.

#### Option B: Binding Independent Domain (`fuadhasan.dev`)
1. In Cloudflare Pages, go to **Custom domains** $\rightarrow$ **Set up a custom domain**.
2. Enter `fuadhasan.dev` (or `www.fuadhasan.dev`).
3. If the domain is managed in Cloudflare DNS, Cloudflare will automatically configure the CNAME record.
4. If using an external DNS provider, create:
   - Type: `CNAME`
   - Name: `@` (or `www`)
   - Target: `fuad-portfolio.pages.dev`
   - Proxy status: Proxied (or DNS only)

---

## 4. Post-Deployment Smoke Test Protocol (Run After Activation)

Once deployment is authorized and DNS is active, execute the automated smoke test:

```bash
# Set production URL for verification
$env:PRODUCTION_URL = "https://fuadhasan.is-a.dev"
node tests/e2e/smoke-test-production.mjs
```

### Manual Smoke Test Checklist
- [ ] **HTTPS Enforced:** Navigate to `http://<domain>` $\rightarrow$ redirects to `https://<domain>`.
- [ ] **SSL Certificate:** Valid TLS certificate issued by Cloudflare / Let's Encrypt.
- [ ] **Core Pages Reachable:**
  - Home: `https://<domain>/` (HTTP 200, hero renders, theme toggle works).
  - About: `https://<domain>/about` (HTTP 200).
  - Experience: `https://<domain>/experience` (HTTP 200).
  - Projects: `https://<domain>/projects` (HTTP 200, 3 project cards render).
  - Case Studies: `https://<domain>/projects/edusubmit` and `libraryms` (HTTP 200).
  - Blog: `https://<domain>/blog` (HTTP 200, search & filter work).
  - Articles: `https://<domain>/blog/understanding-outbox-pattern` (HTTP 200, code blocks, TOC).
  - Contact: `https://<domain>/contact` (HTTP 200).
  - 404 Recovery: `https://<domain>/nonexistent-path` (HTTP 404, home recovery link).
- [ ] **SEO & Machine Feeds:**
  - Sitemap: `https://<domain>/sitemap-index.xml` (HTTP 200, valid XML).
  - Robots: `https://<domain>/robots.txt` (HTTP 200, points to sitemap index).
  - RSS Feed: `https://<domain>/rss.xml` (HTTP 200, valid RSS 2.0).
  - Canonical URLs: Check `<link rel="canonical">` points to the production domain, never `*.pages.dev`.
- [ ] **Privacy & Security Check:**
  - Resume PDF: `https://<domain>/resume/Fuad_Hasan_Resume.pdf` (HTTP 200).
  - External links: Confirm `target="_blank"` enforces `rel="noopener noreferrer"`.
  - Draft isolation: Confirm `https://<domain>/blog/draft-distributed-caching` returns HTTP 404.

---

## 5. Rollback and Disaster Recovery Runbook

Cloudflare Pages maintains immutable deployment history for every build.

### Instant Rollback (Zero Downtime)
If an unexpected defect occurs on production:
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) $\rightarrow$ **Compute (Workers & Pages)** $\rightarrow$ **fuad-portfolio**.
2. Go to **Deployments** tab.
3. Locate the previous known-good deployment (e.g., prior successful commit).
4. Click the three dots menu ($\dots$) next to that deployment $\rightarrow$ click **Rollback to this deployment**.
5. Within 5–10 seconds, Cloudflare edge servers globally revert to the selected build artifacts with zero downtime.

### Git Revert Recovery
Alternatively, revert via Git:
```bash
git revert HEAD
git push origin main
```
Cloudflare Pages will detect the push on `main`, run `npm run build`, and automatically deploy the clean state.
