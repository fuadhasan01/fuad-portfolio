import { chromium } from 'playwright';

const TARGET_URL = (process.env.PRODUCTION_URL || process.argv[2] || 'https://fuadhasan.is-a.dev').replace(/\/$/, '');

console.log(`\n======================================================`);
console.log(`--- Production Smoke Test Suite ---`);
console.log(`Target Host: ${TARGET_URL}`);
console.log(`======================================================\n`);

async function runSmokeTests() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const page = await browser.newPage();
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

  try {
    // 1. Core Route Availability
    console.log('[1] Checking Core Routes Availability...');
    const routes = [
      '/',
      '/about',
      '/experience',
      '/projects',
      '/projects/edusubmit',
      '/projects/libraryms',
      '/projects/mini-account',
      '/blog',
      '/blog/understanding-outbox-pattern',
      '/blog/practical-cqrs-in-dotnet',
      '/blog/ef-core-query-optimization',
      '/contact'
    ];

    for (const route of routes) {
      const resp = await page.goto(`${TARGET_URL}${route}`, { waitUntil: 'networkidle', timeout: 15000 });
      assert(resp.status() === 200, `${route} responds with HTTP 200`);
    }

    // 2. Draft Isolation
    console.log('\n[2] Verifying Draft Isolation on Live Host...');
    const draftResp = await page.goto(`${TARGET_URL}/blog/draft-distributed-caching`, { waitUntil: 'networkidle' });
    assert(draftResp.status() === 404, 'Draft slug returns HTTP 404 (draft isolated)');

    // 3. 404 Recovery Page
    console.log('\n[3] Verifying 404 Page...');
    const notFoundResp = await page.goto(`${TARGET_URL}/nonexistent-test-path-999`, { waitUntil: 'networkidle' });
    assert(notFoundResp.status() === 404, 'Unknown path returns HTTP 404');
    const homeLink = page.locator('a[href="/"]').first();
    assert(await homeLink.isVisible(), '404 page provides functional recovery link to Home');

    // 4. Feeds and Machine Endpoints
    console.log('\n[4] Verifying Robots, Sitemap & RSS...');
    const robotsResp = await page.goto(`${TARGET_URL}/robots.txt`);
    assert(robotsResp.status() === 200, 'robots.txt responds with HTTP 200');

    const sitemapResp = await page.goto(`${TARGET_URL}/sitemap-index.xml`);
    assert(sitemapResp.status() === 200, 'sitemap-index.xml responds with HTTP 200');

    const rssResp = await page.goto(`${TARGET_URL}/rss.xml`);
    assert(rssResp.status() === 200, 'rss.xml responds with HTTP 200');
    const rssText = await rssResp.text();
    assert(rssText.includes('<rss version="2.0">') && !rssText.includes('draft-distributed-caching'), 'RSS is valid and excludes drafts');

    // 5. Canonical URLs & Metadata
    console.log('\n[5] Verifying Canonical URLs & Assets...');
    await page.goto(`${TARGET_URL}/blog/understanding-outbox-pattern`, { waitUntil: 'networkidle' });
    const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
    assert(canonicalHref?.startsWith(TARGET_URL), `Canonical URL uses production origin (${canonicalHref})`);

    const faviconResp = await page.goto(`${TARGET_URL}/favicon.svg`);
    assert(faviconResp.status() === 200, 'favicon.svg resolves with HTTP 200');

    // 6. Resume PDF Download
    console.log('\n[6] Verifying Resume Asset...');
    const resumeResp = await page.goto(`${TARGET_URL}/resume/Fuad_Hasan_Resume.pdf`);
    assert(resumeResp.status() === 200, 'Resume PDF resolves with HTTP 200');

  } catch (err) {
    console.error(`\nConnection or verification error: ${err.message}`);
    console.log(`Note: If the live domain has not yet completed DNS propagation, run this test once DNS is active.`);
  } finally {
    await browser.close();
  }

  console.log(`\n======================================================`);
  console.log(`Smoke Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`======================================================\n`);
}

runSmokeTests();
