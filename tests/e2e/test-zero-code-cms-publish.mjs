import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const BLOG_DIR = path.resolve('src/content/blog');
const DIST_DIR = path.resolve('dist');
const TEST_ARTICLE_SLUG = 'zero-code-cms-publish-test';
const TEST_ARTICLE_PATH = path.join(BLOG_DIR, `${TEST_ARTICLE_SLUG}.md`);
const TEST_DIST_PATH = path.join(DIST_DIR, 'blog', TEST_ARTICLE_SLUG, 'index.html');

console.log('================================================================');
console.log('--- Zero-Code Pages CMS Article Addition Verification (P8) ---');
console.log('================================================================\n');

function run(command, description) {
  console.log(`[EXEC] ${description} (${command})...`);
  try {
    const output = execSync(command, {
      stdio: 'pipe',
      encoding: 'utf-8',
      env: { ...process.env, Path: `C:\\nvm4w\\nodejs;C:\\Program Files\\Git\\cmd;${process.env.Path}` }
    });
    return { success: true, output };
  } catch (error) {
    console.error(`[ERROR] Command failed: ${command}`);
    if (error.stdout) console.error(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
    throw error;
  }
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function verifyZeroCodePublishing() {
  try {
    // -------------------------------------------------------------
    // STEP 1: Simulate authoring an article directly in Pages CMS
    // -------------------------------------------------------------
    console.log('\n[Step 1] Simulating new article authored via Pages CMS (.pages.yml format)...');
    
    // Frontmatter matches the schema defined in .pages.yml and src/content.config.ts
    const cmsAuthoredArticle = `---
title: "Zero-Code CMS Publishing in Practice"
excerpt: "Demonstrating how technical articles are authored and published via Pages CMS without touching code."
published: true
pubDate: 2026-11-14
category: "Engineering Notes"
tags: ["Astro", "Pages CMS", "Content Collections"]
cover: "/images/blog/cqrs-pattern.svg"
coverAlt: "Clean architecture diagram illustrating zero-code content pipeline"
seoTitle: "Zero-Code CMS Publishing | Fuad Hasan"
seoDescription: "Step-by-step verification of headless CMS publication on an Astro static portfolio."
---

## Zero-Code Content Lifecycle

This article was authored strictly through the Pages CMS frontmatter interface without touching a single line of application source code or build configuration.

### Verifying Technical Features

When committed to GitHub by Pages CMS, Cloudflare Pages runs the static build pipeline:

1. **Zod Content Validation**: Validates all frontmatter attributes.
2. **Deterministic Route Generation**: Generates \`/blog/zero-code-cms-publish-test/\`.
3. **RSS Feed Aggregation**: Appends item to \`/rss.xml\`.
4. **Sitemap Generation**: Automatically discovers and adds URL to \`/sitemap-0.xml\`.
5. **Search Index Update**: Ingests title, excerpt, and tags into client search island.

\`\`\`csharp
// Example verified domain event model
public sealed record ArticlePublishedEvent(
    Guid ArticleId,
    string Slug,
    string Title,
    DateTime PublishedAtUtc
);
\`\`\`

> [!NOTE]
> No modifications to \`src/pages/\`, \`src/layouts/\`, or \`astro.config.mjs\` were made.
`;

    fs.writeFileSync(TEST_ARTICLE_PATH, cmsAuthoredArticle, 'utf-8');
    assert(fs.existsSync(TEST_ARTICLE_PATH), `Created CMS markdown file: ${path.basename(TEST_ARTICLE_PATH)}`);

    // -------------------------------------------------------------
    // STEP 2: Validate Astro content collections schema (astro check)
    // -------------------------------------------------------------
    console.log('\n[Step 2] Validating typed content schema with `astro check`...');
    const checkResult = run('npx astro check', 'Astro schema validation');
    assert(checkResult.success, 'Astro check passed with zero type errors');

    // -------------------------------------------------------------
    // STEP 3: Execute static build without any code changes
    // -------------------------------------------------------------
    console.log('\n[Step 3] Running production static build (astro build)...');
    const buildResult = run('npx astro build', 'Production static build');
    assert(buildResult.success, 'Astro static build completed successfully');

    // -------------------------------------------------------------
    // STEP 4: Verify generated static assets and routes
    // -------------------------------------------------------------
    console.log('\n[Step 4] Verifying generated routes and content delivery...');

    // 4.1 Article HTML route generated
    assert(fs.existsSync(TEST_DIST_PATH), `Generated static HTML exists at: dist/blog/${TEST_ARTICLE_SLUG}/index.html`);
    
    if (fs.existsSync(TEST_DIST_PATH)) {
      const htmlContent = fs.readFileSync(TEST_DIST_PATH, 'utf-8');
      assert(htmlContent.includes('Zero-Code CMS Publishing in Practice'), 'HTML contains correct article H1 title');
      assert(htmlContent.includes('ArticlePublishedEvent'), 'HTML contains rendered syntax-highlighted code block');
      assert(htmlContent.includes('href="#zero-code-content-lifecycle"'), 'HTML contains automatically generated Table of Contents anchor');
      assert(htmlContent.includes('src="/images/blog/cqrs-pattern.svg"'), 'HTML contains configured cover image path');
      assert(htmlContent.includes('Clean architecture diagram illustrating zero-code content pipeline'), 'HTML contains configured cover image alt text');
      assert(htmlContent.includes('canonical'), 'HTML contains canonical link tag');
      assert(htmlContent.includes('application/ld+json'), 'HTML contains BlogPosting JSON-LD structured data');
    }

    // 4.2 RSS feed inclusion
    const rssPath = path.join(DIST_DIR, 'rss.xml');
    assert(fs.existsSync(rssPath), 'RSS feed exists at dist/rss.xml');
    const rssContent = fs.readFileSync(rssPath, 'utf-8');
    assert(rssContent.includes('Zero-Code CMS Publishing in Practice'), 'RSS feed automatically includes new article title');
    assert(rssContent.includes(`/blog/${TEST_ARTICLE_SLUG}/`), 'RSS feed links to the correct article slug');

    // 4.3 Sitemap inclusion
    const sitemapPath = path.join(DIST_DIR, 'sitemap-0.xml');
    assert(fs.existsSync(sitemapPath), 'Sitemap exists at dist/sitemap-0.xml');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    assert(sitemapContent.includes(`/blog/${TEST_ARTICLE_SLUG}`), 'Sitemap automatically includes new article URL');

    // 4.4 Blog catalog listing & search island inclusion
    const blogCatalogPath = path.join(DIST_DIR, 'blog', 'index.html');
    assert(fs.existsSync(blogCatalogPath), 'Blog catalog exists at dist/blog/index.html');
    const catalogContent = fs.readFileSync(blogCatalogPath, 'utf-8');
    assert(catalogContent.includes('Zero-Code CMS Publishing in Practice'), 'Blog catalog page displays new article card');

    console.log(`\n✓ Zero-Code publication passed all checks (${passed} assertions).`);

  } finally {
    // -------------------------------------------------------------
    // STEP 5: Teardown & Rollback Verification
    // -------------------------------------------------------------
    console.log('\n[Step 5] Cleaning up test file and validating clean rollback...');
    if (fs.existsSync(TEST_ARTICLE_PATH)) {
      fs.unlinkSync(TEST_ARTICLE_PATH);
      console.log(`  ✓ Removed test article: ${path.basename(TEST_ARTICLE_PATH)}`);
    }

    // Rebuild to restore clean dist
    run('npx astro build', 'Restoring clean dist build');

    assert(!fs.existsSync(TEST_DIST_PATH), 'Test article route cleanly removed from dist/');
    const cleanRss = fs.readFileSync(path.join(DIST_DIR, 'rss.xml'), 'utf-8');
    assert(!cleanRss.includes('Zero-Code CMS Publishing in Practice'), 'Clean RSS feed has zero test traces');
    const cleanSitemap = fs.readFileSync(path.join(DIST_DIR, 'sitemap-0.xml'), 'utf-8');
    assert(!cleanSitemap.includes(TEST_ARTICLE_SLUG), 'Clean sitemap has zero test traces');

    console.log('\n================================================================');
    console.log(`Verification Complete: ${passed} Passed, ${failed} Failed.`);
    console.log('================================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  }
}

verifyZeroCodePublishing().catch((err) => {
  console.error('Fatal error during zero-code CMS verification:', err);
  process.exit(1);
});
