import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const PORT = 4329;
const DIST_DIR = path.resolve('dist');
const SCREENSHOTS_DIR = path.resolve('tests/screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Simple static file server
function createServer() {
  return http.createServer((req, res) => {
    let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.xml': 'application/xml',
      '.txt': 'text/plain'
    };

    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
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

async function runVerification() {
  const server = createServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Static server running on http://localhost:${PORT}`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  try {
    console.log('\n======================================================');
    console.log('--- 1. Testing Default Dark Mode in Fresh Session ---');
    console.log('======================================================');

    // Emulate light OS system theme to verify dark mode overrides it by default!
    const context = await browser.newContext({
      colorScheme: 'light',
      viewport: { width: 1440, height: 900 }
    });

    const page = await context.newPage();
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });

    // 1.1 Verify dark mode is active by default
    const isDarkByDefault = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    assert(isDarkByDefault, 'Website loads in DARK MODE by default on fresh visit (even with light OS colorScheme)');

    const storedThemeInitial = await page.evaluate(() => localStorage.getItem('theme'));
    assert(storedThemeInitial === null, 'localStorage has no pre-existing theme key (clean visitor state)');

    // 1.2 Verify Theme Toggle switches to Light mode
    console.log('\n[1.2] Testing Theme Toggle & Persistence...');
    const themeBtn = page.locator('#theme-toggle').first();
    assert(await themeBtn.isVisible(), 'Theme toggle button is present in navbar');

    await themeBtn.click();
    await page.waitForTimeout(300);

    const isLightAfterClick = await page.evaluate(() => !document.documentElement.classList.contains('dark'));
    assert(isLightAfterClick, 'Clicking theme toggle switches to LIGHT MODE');

    const storedLight = await page.evaluate(() => localStorage.getItem('theme'));
    assert(storedLight === 'light', 'User selection "light" is saved in localStorage');

    // 1.3 Reload to test persistence
    await page.reload({ waitUntil: 'networkidle' });
    const isLightAfterReload = await page.evaluate(() => !document.documentElement.classList.contains('dark'));
    assert(isLightAfterReload, 'Light mode preference persists across page reload');

    // 1.4 Switch back to Dark mode
    await themeBtn.click();
    await page.waitForTimeout(300);
    const isDarkAfterSecondClick = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    assert(isDarkAfterSecondClick, 'Clicking toggle again switches back to DARK MODE');

    const storedDark = await page.evaluate(() => localStorage.getItem('theme'));
    assert(storedDark === 'dark', 'User selection "dark" is saved in localStorage');

    // 1.5 Reload to test dark persistence
    await page.reload({ waitUntil: 'networkidle' });
    const isDarkAfterReload = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    assert(isDarkAfterReload, 'Dark mode preference persists across page reload');

    console.log('\n======================================================');
    console.log('--- 2. Testing Social Icons & Links ---');
    console.log('======================================================');

    // Check Hero social buttons
    const heroSection = page.locator('section[aria-label="Introduction"]');
    assert(await heroSection.isVisible(), 'Hero section is visible');

    // Check GitHub link
    const githubLink = heroSection.locator('a[href="https://github.com/fuadhasan01"]').first();
    assert(await githubLink.isVisible(), 'GitHub social link is present in hero');
    const githubSvg = githubLink.locator('svg');
    assert(await githubSvg.count() > 0, 'GitHub link contains real SVG icon');

    // Check LinkedIn link
    const linkedinLink = heroSection.locator('a[href="https://linkedin.com/in/fuadhasan01"]').first();
    assert(await linkedinLink.isVisible(), 'LinkedIn social link is present in hero');
    const linkedinSvg = linkedinLink.locator('svg');
    assert(await linkedinSvg.count() > 0, 'LinkedIn link contains real SVG icon');

    // Check LeetCode link
    const leetcodeLink = heroSection.locator('a[href="https://leetcode.com/u/fuadhasan01/"]').first();
    assert(await leetcodeLink.isVisible(), 'LeetCode social link is present in hero');
    const leetcodeSvg = leetcodeLink.locator('svg');
    assert(await leetcodeSvg.count() > 0, 'LeetCode link contains real SVG icon');

    // Check Email link
    const emailLink = heroSection.locator('a[href="mailto:contact@fuadhasan.dev"]').first();
    assert(await emailLink.isVisible(), 'Direct email link is present in hero');
    const emailSvg = emailLink.locator('svg');
    assert(await emailSvg.count() > 0, 'Email link contains real SVG icon');

    // Verify zero text abbreviations in hero social buttons
    const heroSocialText = await heroSection.locator('.flex.items-center.gap-2\\.5').first().innerText();
    assert(!heroSocialText.includes('GI'), 'Zero "GI" text placeholder found');
    assert(!heroSocialText.includes('LI'), 'Zero "LI" text placeholder found');
    assert(!heroSocialText.includes('LE'), 'Zero "LE" text placeholder found');
    assert(!heroSocialText.includes('EM'), 'Zero "EM" text placeholder found');

    // Check Footer social icons as well
    const footer = page.locator('footer');
    const footerSvgs = footer.locator('svg');
    assert(await footerSvgs.count() >= 4, 'Footer contains real SVG icons for social channels and RSS');

    // Check that Home About section omits redundant profile image
    const aboutSection = page.locator('#about');
    assert(await aboutSection.isVisible(), 'About section is present on home');
    const aboutImgs = aboutSection.locator('img');
    assert(await aboutImgs.count() === 0, 'Homepage About section has NO redundant image (image is solely in Hero)');

    console.log('\n======================================================');
    console.log('--- 3. Testing Hero Layout & Initial Viewport Visibility ---');
    console.log('======================================================');

    const h1 = heroSection.locator('h1').first();
    const h1Box = await h1.boundingBox();
    const profileImg = heroSection.locator('img[alt="Portrait of Fuad Hasan"]').first();
    const imgBox = await profileImg.boundingBox();

    assert(h1Box !== null, 'H1 name element has valid geometry');
    assert(imgBox !== null, 'Profile image element has valid geometry');

    console.log(`  Desktop 1440 Viewport Geometry:`);
    console.log(`    - H1 Name: top=${Math.round(h1Box.y)}px, left=${Math.round(h1Box.x)}px, width=${Math.round(h1Box.width)}px, height=${Math.round(h1Box.height)}px`);
    console.log(`    - Image: top=${Math.round(imgBox.y)}px, left=${Math.round(imgBox.x)}px, width=${Math.round(imgBox.width)}px, height=${Math.round(imgBox.height)}px`);

    // Verify both H1 and Image are inside 900px viewport
    assert(h1Box.y < 900 && (h1Box.y + h1Box.height) < 900, 'Name H1 is fully visible within initial 900px desktop viewport');
    assert(imgBox.y < 900 && (imgBox.y + imgBox.height) < 900, 'Profile image is fully visible within initial 900px desktop viewport');

    // Verify 2-column side-by-side layout on desktop: H1 is on left, Image is on right
    assert(h1Box.x < imgBox.x, 'Name is positioned on LEFT and profile image is positioned on RIGHT (2-column layout)');

    // Verify availability text is positioned above the name
    const availPill = heroSection.locator('text=Available for select engagements').first();
    const availBox = await availPill.boundingBox();
    assert(availBox.y < h1Box.y, 'Availability text is positioned naturally ABOVE the name');

    // Capture desktop screenshots
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'hero-desktop-1440-dark.png') });
    console.log('  ✓ Saved screenshot: hero-desktop-1440-dark.png');

    await themeBtn.click(); // Switch to light
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'hero-desktop-1440-light.png') });
    console.log('  ✓ Saved screenshot: hero-desktop-1440-light.png');

    await themeBtn.click(); // Switch back to dark

    console.log('\n======================================================');
    console.log('--- 4. Testing Responsive Viewports (1024, 768, 390, 360) ---');
    console.log('======================================================');

    const viewports = [
      { width: 1024, height: 768, name: 'laptop-1024' },
      { width: 768, height: 1024, name: 'tablet-768' },
      { width: 390, height: 844, name: 'mobile-390' },
      { width: 360, height: 740, name: 'mobile-360' }
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(300);

      // Check horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      assert(!hasOverflow, `No horizontal overflow at ${vp.width}px (${vp.name})`);

      const currentH1 = await heroSection.locator('h1').first().boundingBox();
      const currentImg = await heroSection.locator('img[alt="Portrait of Fuad Hasan"]').first().boundingBox();

      assert(currentH1 !== null && currentH1.y < vp.height, `Name H1 visible within viewport on ${vp.width}px`);
      assert(currentImg !== null, `Profile image present and rendered on ${vp.width}px`);

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `hero-${vp.name}-dark.png`) });
      console.log(`  ✓ Saved screenshot: hero-${vp.name}-dark.png`);
    }

    console.log('\n======================================================');
    console.log(`Verification Complete: ${passed} Passed, ${failed} Failed.`);
    console.log('======================================================\n');

    await context.close();
  } finally {
    await browser.close();
    server.close();
  }

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Fatal error during hero & theme verification:', err);
  process.exit(1);
});
