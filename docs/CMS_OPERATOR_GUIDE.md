# Pages CMS Operator Guide & Manual Actions

This guide explains how to connect and operate **Pages CMS** (`pagescms.org`) with your GitHub repository to author, edit, and publish technical blog posts and project case studies without editing code.

---

## 1. Overview & Architecture

- **CMS Tool:** [Pages CMS](https://pagescms.org) — an open-source, client-side, GitHub-backed CMS designed for static site generators.
- **Configuration File:** [`.pages.yml`](file:///c:/Fuad/WorkStation/fuad-portfolio/.pages.yml) in repository root.
- **Workflow:**
  ```mermaid
  flowchart LR
      Owner["Fuad (Content Author)"] -->|Edits in Web UI| PagesCMS["Pages CMS (pagescms.org)"]
      PagesCMS -->|Git Commit & Push| GitHub["GitHub Repo (fuad-portfolio)"]
      GitHub -->|Trigger CI & Webhook| CloudflarePages["Cloudflare Pages Build"]
      CloudflarePages -->|Deploy Static HTML| ProductionSite["Live Website"]
  ```

---

## 2. External Actions Required by Owner (One-Time Setup)

To use Pages CMS with this repository, perform the following external actions:

1. **Push Repository to GitHub:**
   - Ensure the repository is pushed to your GitHub account (`https://github.com/fuadhasan01/fuad-portfolio`).
2. **Access Pages CMS:**
   - Navigate to **[https://pagescms.org](https://pagescms.org)** in your browser.
   - Click **"Log in with GitHub"** and authenticate using your GitHub account (`fuadhasan01`).
3. **Grant Repository Access:**
   - In the Pages CMS GitHub App authorization prompt, choose **"Only select repositories"** and select `fuad-portfolio` (or grant access to all repositories).
   - Authorize the application.
4. **Open CMS Dashboard:**
   - Once authorized, Pages CMS reads [`.pages.yml`](file:///c:/Fuad/WorkStation/fuad-portfolio/.pages.yml) from your default branch (`main`).
   - You will see two configured collections:
     - **Technical Blog Posts** (`src/content/blog`)
     - **Project Case Studies** (`src/content/projects`)

---

## 3. How to Author and Manage Content

### A. Creating a Draft Article
1. In Pages CMS, click **"Technical Blog Posts"** $\rightarrow$ **"New entry"**.
2. Enter the Title, Excerpt, Publication Date, Category, and Tags.
3. Leave **"Published (Uncheck for Draft)"** toggled **OFF** (`published: false`).
4. Write your Markdown content in the rich-text editor.
5. Click **"Save"**.
   - *Result:* Pages CMS commits a new Markdown file to GitHub.
   - *Safety Gate:* Because `published` is false, the build process completely excludes this article from public routes, client search indexes, RSS feeds, and sitemaps.

### B. Uploading and Embedding Images
1. In the **"Cover Image"** field, click **"Upload"** and select your image file (SVG, WebP, PNG, JPG).
2. Pages CMS saves media into `public/images/blog/` and outputs clean markdown paths like `/images/blog/my-new-diagram.png`.
3. Provide descriptive **Cover Image Alt Text** (required by schema) for accessibility.

### C. Publishing an Article
1. Open your draft post in Pages CMS.
2. Toggle **"Published"** to **ON** (`published: true`).
3. Click **"Save"**.
   - *Result:* Pages CMS commits the change to GitHub. Cloudflare Pages automatically detects the commit, runs `npm run build`, and your new article goes live immediately.

### D. Editing or Updating an Article
1. Select an existing published article.
2. Modify the body, title, or tags.
3. Optionally set the **"Last Updated Date"** field (`updatedDate`).
4. Click **"Save"**. The changes will rebuild and publish automatically.

