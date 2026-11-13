import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const PORT = 4323;
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
  console.log('--- Starting P4 E2E & Visual Verification ---');
  const server = createStaticServer();

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`✓ Local static server listening on ${BASE_URL}`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  const context = await browser.newContext();
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
    // 1. Projects Catalog (/projects)
    console.log('\n[1] Verifying Projects Catalog (/projects)...');
    const catalogResponse = await page.goto(`${BASE_URL}/projects`, { waitUntil: 'networkidle' });
    assert(catalogResponse.status() === 200, 'Catalog responds with HTTP 200');

    const projectCards = page.locator('[data-project-card]');
    const cardCount = await projectCards.count();
    assert(cardCount === 3, `Found exactly 3 project cards (got ${cardCount})`);

    // Verify Project Titles
    const edusubmitTitle = page.locator('text=EduSubmit').first();
    const libraryTitle = page.locator('text=LibraryMS').first();
    const miniAccountTitle = page.locator('text=Mini Account Management System').first();
    assert(await edusubmitTitle.isVisible(), 'EduSubmit title visible on catalog');
    assert(await libraryTitle.isVisible(), 'LibraryMS title visible on catalog');
    assert(await miniAccountTitle.isVisible(), 'Mini Account title visible on catalog');

    // 2. Interactive Filtering (FR-011)
    console.log('\n[2] Verifying Interactive Category Filter (FR-011)...');
    const fullStackPill = page.locator('button[data-filter="Full Stack"]');
    const backendPill = page.locator('button[data-filter="Backend & Systems"]');
    const erpPill = page.locator('button[data-filter="Architecture & ERP"]');
    const allPill = page.locator('button[data-filter="all"]');

    // Filter: Full Stack
    await fullStackPill.click();
    let visibleCards = await page.locator('[data-project-card]:visible').count();
    assert(visibleCards === 1, `Full Stack filter shows 1 project (got ${visibleCards})`);
    assert(await edusubmitTitle.isVisible(), 'EduSubmit is visible under Full Stack');
    assert(!(await libraryTitle.isVisible()), 'LibraryMS is hidden under Full Stack');

    // Filter: Backend & Systems
    await backendPill.click();
    visibleCards = await page.locator('[data-project-card]:visible').count();
    assert(visibleCards === 1, `Backend & Systems filter shows 1 project (got ${visibleCards})`);
    assert(await libraryTitle.isVisible(), 'LibraryMS is visible under Backend & Systems');
    assert(!(await edusubmitTitle.isVisible()), 'EduSubmit is hidden under Backend & Systems');

    // Filter: Architecture & ERP
    await erpPill.click();
    visibleCards = await page.locator('[data-project-card]:visible').count();
    assert(visibleCards === 1, `Architecture & ERP filter shows 1 project (got ${visibleCards})`);
    assert(await miniAccountTitle.isVisible(), 'Mini Account is visible under Architecture & ERP');

    // Reset Filter to All
    await allPill.click();
    visibleCards = await page.locator('[data-project-card]:visible').count();
    assert(visibleCards === 3, `All filter resets to show all 3 projects (got ${visibleCards})`);

    // 3. EduSubmit Detail Route & Verified CTAs (FR-006, FR-007, FR-008)
    console.log('\n[3] Verifying EduSubmit Case Study (/projects/edusubmit)...');
    const eduResp = await page.goto(`${BASE_URL}/projects/edusubmit`, { waitUntil: 'networkidle' });
    assert(eduResp.status() === 200, 'EduSubmit case study responds with HTTP 200');

    const eduH1 = await page.locator('h1').textContent();
    assert(eduH1.includes('EduSubmit'), `EduSubmit H1 rendered correctly: "${eduH1.trim()}"`);

    // Check Repository CTA
    const eduRepoBtn = page.locator('header a[href="https://github.com/fuadhasan01/EduSubmitAPI"]').first();
    assert(await eduRepoBtn.isVisible(), 'EduSubmit repository link is visible');
    const eduRepoTarget = await eduRepoBtn.getAttribute('target');
    const eduRepoRel = await eduRepoBtn.getAttribute('rel');
    assert(eduRepoTarget === '_blank' && eduRepoRel.includes('noopener'), 'EduSubmit repo button safely opens in new tab with rel="noopener noreferrer"');

    // Check Live Demo CTA (Verified demo exists)
    const eduDemoBtn = page.locator('header a[href="https://edusubmit-web-gamma.vercel.app/login"]').first();
    assert(await eduDemoBtn.isVisible(), 'EduSubmit live demo CTA is visible');

    // Check Cover Image
    const eduCover = page.locator('img[src="/images/projects/edusubmit.svg"]').first();
    assert(await eduCover.isVisible(), 'EduSubmit SVG cover image rendered');

    // 4. LibraryMS Detail Route & Link Verification (FR-008: Absent Links Hidden)
    console.log('\n[4] Verifying LibraryMS Case Study (/projects/libraryms)...');
    const libResp = await page.goto(`${BASE_URL}/projects/libraryms`, { waitUntil: 'networkidle' });
    assert(libResp.status() === 200, 'LibraryMS case study responds with HTTP 200');

    // Check Backend & Frontend Repository CTAs
    const libBackendRepo = page.locator('header a[href="https://github.com/fuadhasan01/LibraryManagementSystemAPI"]').first();
    const libFrontendRepo = page.locator('header a[href="https://github.com/fuadhasan01/LibraryManagementSystemFrontend"]').first();
    assert(await libBackendRepo.isVisible(), 'LibraryMS Backend repository CTA is visible');
    assert(await libFrontendRepo.isVisible(), 'LibraryMS Frontend repository CTA is visible');

    // CRITICAL FR-008: Check that NO demo button exists for LibraryMS in header
    const libDemoBtn = page.locator('header a:has-text("Live Demo")');
    const libDemoCount = await libDemoBtn.count();
    assert(libDemoCount === 0, 'LibraryMS has NO demo button (FR-008: Absent link correctly hidden)');

    // 5. Mini Account Detail Route & Link Verification (FR-008: Insecure/Offline Demo Omitted)
    console.log('\n[5] Verifying Mini Account Case Study (/projects/mini-account)...');
    const accResp = await page.goto(`${BASE_URL}/projects/mini-account`, { waitUntil: 'networkidle' });
    assert(accResp.status() === 200, 'Mini Account case study responds with HTTP 200');

    const accRepo = page.locator('header a[href="https://github.com/fuadhasan01/MiniAccountApp"]').first();
    assert(await accRepo.isVisible(), 'Mini Account repository CTA is visible');

    // Check that NO demo button exists for Mini Account in header
    const accDemoBtn = page.locator('header a:has-text("Live Demo")');
    const accDemoCount = await accDemoBtn.count();
    assert(accDemoCount === 0, 'Mini Account has NO live demo button (FR-008: unverified Somee HTTP link omitted)');

    // 6. Responsive Viewports & Horizontal Overflow Check
    console.log('\n[6] Testing Responsive Viewports (360, 390, 768, 1024, 1440 px)...');
    const viewports = [
      { name: 'mobile-360', width: 360, height: 740 },
      { name: 'mobile-390', width: 390, height: 844 },
      { name: 'tablet-768', width: 768, height: 1024 },
      { name: 'laptop-1024', width: 1024, height: 768 },
      { name: 'desktop-1440', width: 1440, height: 900 }
    ];

    const testRoutes = ['/projects', '/projects/edusubmit', '/projects/libraryms', '/projects/mini-account'];

    for (const route of testRoutes) {
      for (const vp of viewports) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });

        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth - document.documentElement.clientWidth;
        });

        assert(overflow <= 1, `${route} at ${vp.width}px has no horizontal overflow (overflow: ${overflow}px)`);
      }
    }

    // 7. Visual Screenshots in Light and Dark Mode
    console.log('\n[7] Capturing High-Fidelity Screenshots...');

    // Desktop Catalog Light
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/projects`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, 'p4-projects-desktop.png'), fullPage: false });

    // Desktop Catalog Dark
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, 'p4-projects-desktop-dark.png'), fullPage: false });

    // Mobile Catalog Light
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/projects`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, 'p4-projects-mobile-390.png'), fullPage: false });

    // EduSubmit Desktop Light
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/projects/edusubmit`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, 'p4-edusubmit-desktop.png'), fullPage: false });

    // EduSubmit Desktop Dark
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, 'p4-edusubmit-desktop-dark.png'), fullPage: false });

    // EduSubmit Mobile 390 Light
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/projects/edusubmit`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, 'p4-edusubmit-mobile-390.png'), fullPage: false });

    // LibraryMS Desktop Light
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/projects/libraryms`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, 'p4-libraryms-desktop.png'), fullPage: false });

    // Mini Account Desktop Light
    await page.goto(`${BASE_URL}/projects/mini-account`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, 'p4-miniaccount-desktop.png'), fullPage: false });

    console.log(`\n✓ All screenshots captured in tests/screenshots/`);

  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\n========================================`);
  console.log(`P4 Verification Summary: ${passedChecks} Passed, ${failedChecks} Failed`);
  console.log(`========================================\n`);

  if (failedChecks > 0) {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
