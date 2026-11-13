import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const PORT = 4324;
const BASE_URL = `http://localhost:${PORT}`;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml',
  '.txt': 'text/plain'
};

function createStaticServer() {
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath.endsWith('/')) {
      reqPath += 'index.html';
    } else if (!path.extname(reqPath)) {
      if (fs.existsSync(path.join(DIST_DIR, reqPath, 'index.html'))) {
        reqPath = path.join(reqPath, 'index.html');
      } else if (fs.existsSync(path.join(DIST_DIR, reqPath + '.html'))) {
        reqPath = reqPath + '.html';
      }
    }

    const filePath = path.join(DIST_DIR, reqPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      const notFoundPath = path.join(DIST_DIR, '404.html');
      if (fs.existsSync(notFoundPath)) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(notFoundPath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
    }
  });
}

async function runVerification() {
  console.log('--- Starting P5 E2E & Blog / CMS Verification ---');
  const server = createStaticServer();

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`✓ Local static server listening on ${BASE_URL}`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  const context = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write']
  });
  const page = await context.newPage();

  const screenshotsDir = path.resolve(process.cwd(), 'tests/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  let passedChecks = 0;
  let failedChecks = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passedChecks++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failedChecks++;
    }
  }

  try {
    // 1. Blog Catalog Listing (/blog)
    console.log('\n[1] Verifying Blog Catalog Listing (/blog)...');
    const catalogResp = await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle' });
    assert(catalogResp.status() === 200, 'Blog catalog responds with HTTP 200');

    const blogCards = page.locator('[data-blog-card]');
    const cardCount = await blogCards.count();
    assert(cardCount === 3, `Found exactly 3 published blog cards (got ${cardCount})`);

    // Verify all 3 published titles
    const outboxTitle = page.locator('text=Understanding the Outbox Pattern in .NET Applications').first();
    const cqrsTitle = page.locator('text=Practical CQRS in .NET APIs Without Over-Engineering').first();
    const efTitle = page.locator('text=Optimizing Entity Framework Core Queries in Production').first();
    assert(await outboxTitle.isVisible(), 'Outbox Pattern article is visible on /blog');
    assert(await cqrsTitle.isVisible(), 'Practical CQRS article is visible on /blog');
    assert(await efTitle.isVisible(), 'EF Core Query Optimization article is visible on /blog');

    // 2. Draft Isolation Check (FR-013, FR-022, TC-006)
    console.log('\n[2] Verifying Draft Isolation (FR-013, FR-022, TC-006)...');
    const draftTitle = page.locator('text=Advanced Distributed Caching Patterns with Redis');
    assert((await draftTitle.count()) === 0, 'Draft article title is ABSENT from /blog listing');

    const draftRouteResp = await page.goto(`${BASE_URL}/blog/draft-distributed-caching`, { waitUntil: 'networkidle' });
    assert(draftRouteResp.status() === 404, 'Direct navigation to draft slug returns HTTP 404');

    // Return to blog for filter tests
    await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle' });

    // 3. Search and Category Filter (FR-016, FR-017, TC-011)
    console.log('\n[3] Testing Blog Search & Category Filters (FR-016, FR-017, TC-011)...');
    const distPill = page.locator('button[data-category="Distributed Systems"]');
    const archPill = page.locator('button[data-category="Architecture"]');
    const dbPill = page.locator('button[data-category="Databases"]');
    const allPill = page.locator('button[data-category="all"]');
    const searchInput = page.locator('#blog-search-input');
    const resetBtn = page.locator('#blog-empty-reset-btn');

    // Filter: Distributed Systems
    await distPill.click();
    let visibleCount = await page.locator('[data-blog-card]:visible').count();
    assert(visibleCount === 1, `Distributed Systems pill displays 1 article (got ${visibleCount})`);
    assert(await outboxTitle.isVisible(), 'Outbox Pattern visible under Distributed Systems');

    // Filter: Architecture
    await archPill.click();
    visibleCount = await page.locator('[data-blog-card]:visible').count();
    assert(visibleCount === 1, `Architecture pill displays 1 article (got ${visibleCount})`);
    assert(await cqrsTitle.isVisible(), 'Practical CQRS visible under Architecture');

    // Filter: Databases
    await dbPill.click();
    visibleCount = await page.locator('[data-blog-card]:visible').count();
    assert(visibleCount === 1, `Databases pill displays 1 article (got ${visibleCount})`);
    assert(await efTitle.isVisible(), 'EF Core article visible under Databases');

    // Reset to All Topics
    await allPill.click();
    visibleCount = await page.locator('[data-blog-card]:visible').count();
    assert(visibleCount === 3, `All Topics pill restores all 3 articles (got ${visibleCount})`);

    // Search Keyword: "outbox"
    await searchInput.fill('outbox');
    visibleCount = await page.locator('[data-blog-card]:visible').count();
    assert(visibleCount === 1, `Search "outbox" returns 1 article (got ${visibleCount})`);
    assert(await outboxTitle.isVisible(), 'Outbox Pattern visible for search query "outbox"');

    // Search Keyword: "redis" (draft keyword, should return 0 results)
    await searchInput.fill('redis');
    visibleCount = await page.locator('[data-blog-card]:visible').count();
    assert(visibleCount === 0, 'Search for draft keyword "redis" returns 0 results (draft excluded from search)');
    const emptyState = page.locator('#blog-empty-state');
    assert(await emptyState.isVisible(), 'Empty state container displayed on 0 results');

    // Reset via Empty State Button
    await resetBtn.click();
    visibleCount = await page.locator('[data-blog-card]:visible').count();
    assert(visibleCount === 3, 'Empty state reset button clears search and restores 3 articles');

    // 4. Article Detail Pages & Markdown/Code Styling (FR-014, FR-015, FR-024, CMP-15-18)
    console.log('\n[4] Testing Article Detail Route: Outbox Pattern (/blog/understanding-outbox-pattern)...');
    const outboxResp = await page.goto(`${BASE_URL}/blog/understanding-outbox-pattern`, { waitUntil: 'networkidle' });
    assert(outboxResp.status() === 200, 'Outbox pattern article responds with HTTP 200');

    const outboxH1 = await page.locator('h1').textContent();
    assert(outboxH1.includes('Understanding the Outbox Pattern'), `H1 rendered: "${outboxH1.trim()}"`);

    // Check Breadcrumb
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    assert(await breadcrumb.isVisible(), 'Breadcrumb navigation is visible');

    // Check Cover Image
    const coverImg = page.locator('img[src="/images/blog/outbox-pattern.svg"]');
    assert(await coverImg.isVisible(), 'Cover SVG image rendered');

    // Check Code Block & Copy Button (CMP-16, FR-024)
    const codeBlock = page.locator('pre code').first();
    assert(await codeBlock.isVisible(), 'Syntax-highlighted code block is visible');

    const copyBtn = page.locator('.code-copy-btn').first();
    assert(await copyBtn.isVisible(), 'Copy button is present on code block');
    await copyBtn.click();
    await page.waitForTimeout(200);
    const btnText = await copyBtn.textContent();
    assert(btnText.includes('Copied'), `Copy button updates text to "Copied!" on click (got "${btnText}")`);

    // Check Table of Contents (CMP-17)
    const toc = page.locator('nav[aria-label="Table of contents"]').first();
    assert(await toc.isVisible(), 'Table of contents is present and rendered');

    // Check Related Articles (CMP-18)
    const relatedSection = page.locator('text=Related Reading').first();
    assert(await relatedSection.isVisible(), 'Related Reading section is visible in sidebar');

    // 5. Test Other Published Articles
    console.log('\n[5] Testing Article Detail Route: Practical CQRS (/blog/practical-cqrs-in-dotnet)...');
    const cqrsResp = await page.goto(`${BASE_URL}/blog/practical-cqrs-in-dotnet`, { waitUntil: 'networkidle' });
    assert(cqrsResp.status() === 200, 'CQRS article responds with HTTP 200');
    const cqrsCode = page.locator('pre code').first();
    assert(await cqrsCode.isVisible(), 'CQRS code block rendered');

    console.log('\n[6] Testing Article Detail Route: EF Core Optimization (/blog/ef-core-query-optimization)...');
    const efResp = await page.goto(`${BASE_URL}/blog/ef-core-query-optimization`, { waitUntil: 'networkidle' });
    assert(efResp.status() === 200, 'EF Core article responds with HTTP 200');
    const efCode = page.locator('pre code').first();
    assert(await efCode.isVisible(), 'EF Core code block rendered');

    // 6. RSS and Sitemap Integrity (FR-025, TC-013)
    console.log('\n[7] Verifying RSS Feed (/rss.xml) & Sitemap (/sitemap-0.xml)...');
    const rssResp = await page.goto(`${BASE_URL}/rss.xml`);
    assert(rssResp.status() === 200, 'RSS feed responds with HTTP 200');
    const rssText = await rssResp.text();
    assert(rssText.includes('Understanding the Outbox Pattern'), 'RSS includes Outbox Pattern post');
    assert(rssText.includes('Practical CQRS in .NET APIs'), 'RSS includes Practical CQRS post');
    assert(rssText.includes('Optimizing Entity Framework Core Queries'), 'RSS includes EF Core post');
    assert(!rssText.includes('Advanced Distributed Caching'), 'RSS EXCLUDES draft post');

    const sitemapResp = await page.goto(`${BASE_URL}/sitemap-0.xml`);
    assert(sitemapResp.status() === 200, 'Sitemap responds with HTTP 200');
    const sitemapText = await sitemapResp.text();
    assert(sitemapText.includes('/blog/understanding-outbox-pattern'), 'Sitemap includes Outbox Pattern URL');
    assert(sitemapText.includes('/blog/practical-cqrs-in-dotnet'), 'Sitemap includes Practical CQRS URL');
    assert(sitemapText.includes('/blog/ef-core-query-optimization'), 'Sitemap includes EF Core URL');
    assert(!sitemapText.includes('draft-distributed-caching'), 'Sitemap EXCLUDES draft URL');

    // 7. Responsive Viewports & Horizontal Overflow Check (360, 390, 768, 1024, 1440 px)
    console.log('\n[8] Testing Responsive Viewports (360, 390, 768, 1024, 1440 px)...');
    const viewports = [
      { name: 'mobile-360', width: 360, height: 740 },
      { name: 'mobile-390', width: 390, height: 844 },
      { name: 'tablet-768', width: 768, height: 1024 },
      { name: 'laptop-1024', width: 1024, height: 768 },
      { name: 'desktop-1440', width: 1440, height: 900 }
    ];

    const blogRoutes = [
      '/blog',
      '/blog/understanding-outbox-pattern',
      '/blog/practical-cqrs-in-dotnet',
      '/blog/ef-core-query-optimization'
    ];

    for (const route of blogRoutes) {
      for (const vp of viewports) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });

        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth - document.documentElement.clientWidth;
        });

        assert(overflow <= 1, `${route} at ${vp.width}px has 0 horizontal overflow (overflow: ${overflow}px)`);
      }
    }

    // 8. Capture Visual Screenshots
    console.log('\n[9] Capturing High-Fidelity Screenshots...');

    // Blog Catalog Desktop Light
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, 'p5-blog-desktop.png'), fullPage: false });

    // Blog Catalog Desktop Dark
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, 'p5-blog-desktop-dark.png'), fullPage: false });

    // Blog Catalog Mobile 390
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, 'p5-blog-mobile-390.png'), fullPage: false });

    // Article Desktop Light (Outbox)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/blog/understanding-outbox-pattern`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, 'p5-article-outbox-desktop.png'), fullPage: false });

    // Article Desktop Dark (Outbox)
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, 'p5-article-outbox-desktop-dark.png'), fullPage: false });

    // Article Mobile 390 (Outbox)
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/blog/understanding-outbox-pattern`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, 'p5-article-outbox-mobile-390.png'), fullPage: false });

    // Article Desktop Light (CQRS)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/blog/practical-cqrs-in-dotnet`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, 'p5-article-cqrs-desktop.png'), fullPage: false });

    // Article Desktop Light (EF Core)
    await page.goto(`${BASE_URL}/blog/ef-core-query-optimization`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, 'p5-article-efcore-desktop.png'), fullPage: false });

    console.log(`\n✓ All screenshots captured in tests/screenshots/`);

  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\n========================================`);
  console.log(`P5 Verification Summary: ${passedChecks} Passed, ${failedChecks} Failed`);
  console.log(`========================================\n`);

  if (failedChecks > 0) {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
