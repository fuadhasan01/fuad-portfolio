import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const BLOG_DIR = path.resolve('src/content/blog');
const DIST_DIR = path.resolve('dist');
const TEST_POST_PATH = path.join(BLOG_DIR, 'cms-test-lifecycle.md');

function runBuild() {
  execSync('npm run build', {
    stdio: 'pipe',
    env: { ...process.env, Path: `C:\\nvm4w\\nodejs;C:\\Program Files\\Git\\cmd;${process.env.Path}` }
  });
}

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    throw new Error(message);
  }
}

async function runCMSLifecycleTest() {
  console.log('\n--- Testing Complete Draft -> Publish -> Edit -> Image CMS Workflow ---\n');

  try {
    // 1. DRAFT CREATION
    console.log('[Step 1] Creating new article as DRAFT (published: false)...');
    const draftContent = `---
title: "Lifecycle Verification Draft"
excerpt: "Testing draft state isolation across routes, search, RSS, and sitemap."
published: false
pubDate: 2026-11-13
category: "Engineering Notes"
tags: ["Testing", "CMS"]
cover: "/images/blog/outbox-pattern.svg"
coverAlt: "Test cover image"
---

This is a draft article content.
`;
    fs.writeFileSync(TEST_POST_PATH, draftContent, 'utf-8');

    runBuild();

    const draftHtmlPath = path.join(DIST_DIR, 'blog/cms-test-lifecycle/index.html');
    assert(!fs.existsSync(draftHtmlPath), 'Draft HTML route was NOT generated in dist/');

    const rssXml = fs.readFileSync(path.join(DIST_DIR, 'rss.xml'), 'utf-8');
    assert(!rssXml.includes('Lifecycle Verification Draft'), 'Draft article is ABSENT from rss.xml');

    const sitemapXml = fs.readFileSync(path.join(DIST_DIR, 'sitemap-0.xml'), 'utf-8');
    assert(!sitemapXml.includes('cms-test-lifecycle'), 'Draft article is ABSENT from sitemap-0.xml');

    // 2. PUBLISH WORKFLOW
    console.log('\n[Step 2] Updating article to PUBLISHED (published: true)...');
    const publishedContent = `---
title: "Lifecycle Verification Published"
excerpt: "Testing published article presence in routes, RSS, and sitemap."
published: true
pubDate: 2026-11-13
category: "Engineering Notes"
tags: ["Testing", "CMS"]
cover: "/images/blog/outbox-pattern.svg"
coverAlt: "Test cover image"
---

This article is now published and should be generated.
`;
    fs.writeFileSync(TEST_POST_PATH, publishedContent, 'utf-8');

    runBuild();

    assert(fs.existsSync(draftHtmlPath), 'Published HTML route WAS generated in dist/blog/cms-test-lifecycle/index.html');

    const updatedRssXml = fs.readFileSync(path.join(DIST_DIR, 'rss.xml'), 'utf-8');
    assert(updatedRssXml.includes('Lifecycle Verification Published'), 'Published article IS PRESENT in rss.xml');

    const updatedSitemapXml = fs.readFileSync(path.join(DIST_DIR, 'sitemap-0.xml'), 'utf-8');
    assert(updatedSitemapXml.includes('/blog/cms-test-lifecycle'), 'Published article IS PRESENT in sitemap-0.xml');

    // 3. EDIT WORKFLOW
    console.log('\n[Step 3] Editing published article content and title...');
    const editedContent = `---
title: "Lifecycle Verification Edited"
excerpt: "Testing edited content reflections."
published: true
pubDate: 2026-11-13
updatedDate: 2026-11-13
category: "Engineering Notes"
tags: ["Testing", "CMS"]
cover: "/images/blog/cqrs-pattern.svg"
coverAlt: "Updated image for edited article"
---

Edited paragraph content with updated text.
`;
    fs.writeFileSync(TEST_POST_PATH, editedContent, 'utf-8');

    runBuild();

    const postHtml = fs.readFileSync(draftHtmlPath, 'utf-8');
    assert(postHtml.includes('Lifecycle Verification Edited'), 'Edited title appears in generated HTML');
    assert(postHtml.includes('Updated image for edited article'), 'Updated image alt appears in generated HTML');
    assert(postHtml.includes('src="/images/blog/cqrs-pattern.svg"'), 'Updated image source appears in generated HTML');

    console.log('\n✓ CMS Lifecycle (Draft -> Publish -> Edit -> Image) verified successfully!');
  } finally {
    // 4. CLEANUP
    console.log('\n[Step 4] Cleaning up test file and restoring clean production build...');
    if (fs.existsSync(TEST_POST_PATH)) {
      fs.unlinkSync(TEST_POST_PATH);
    }
    runBuild();
    console.log('✓ Clean production build restored.');
  }
}

runCMSLifecycleTest().catch((err) => {
  console.error('CMS Lifecycle test failed:', err);
  process.exit(1);
});

