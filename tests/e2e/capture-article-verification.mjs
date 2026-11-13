import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const PORT = 4326;
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
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  });
}

async function run() {
  console.log('=== Starting Blog Article Verification & Screenshot Capture ===');
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Server listening on ${BASE_URL}`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const screenshotsDir = path.resolve(process.cwd(), 'tests/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const context = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write']
  });
  const page = await context.newPage();

  const articleUrl = `${BASE_URL}/blog/practical-cqrs-in-dotnet`;
  console.log(`Navigating to ${articleUrl}...`);
  await page.goto(articleUrl, { waitUntil: 'networkidle' });

  // 1. Verify DOM & Computed Styles
  console.log('\n--- Checking Computed Styles ---');

  const h1Styles = await page.evaluate(() => {
    const el = document.querySelector('h1');
    const s = window.getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      fontFamily: s.fontFamily,
      lineHeight: s.lineHeight,
      color: s.color
    };
  });
  console.log('H1:', h1Styles);

  const h2Styles = await page.evaluate(() => {
    const el = document.querySelector('.article-content h2');
    const s = window.getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      fontFamily: s.fontFamily,
      marginTop: s.marginTop,
      marginBottom: s.marginBottom,
      borderBottomWidth: s.borderBottomWidth
    };
  });
  console.log('H2:', h2Styles);

  const pStyles = await page.evaluate(() => {
    const el = document.querySelector('.article-content p');
    const s = window.getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      lineHeight: s.lineHeight,
      marginBottom: s.marginBottom,
      color: s.color
    };
  });
  console.log('Paragraph:', pStyles);

  const codeWrapperCount = await page.locator('.code-block-wrapper').count();
  console.log(`Code Block Wrappers found: ${codeWrapperCount}`);

  const codeHeaders = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.code-block-header')).map(h => ({
      lang: h.querySelector('.code-language-tag')?.textContent?.trim(),
      hasCopyBtn: !!h.querySelector('.code-copy-btn')
    }));
  });
  console.log('Code Block Headers:', codeHeaders);

  // Check TOC single instance on desktop (1440px)
  await page.setViewportSize({ width: 1440, height: 900 });
  const desktopVisibleTocs = await page.evaluate(() => {
    const tocs = Array.from(document.querySelectorAll('nav[aria-label="Table of contents"]'));
    return tocs.map(t => {
      const details = t.querySelector('details');
      const box = t.querySelector('div.rounded-2xl');
      return {
        detailsVisible: details ? window.getComputedStyle(details).display !== 'none' : false,
        boxVisible: box ? window.getComputedStyle(box).display !== 'none' : false
      };
    });
  });
  console.log('TOC Visibility at 1440px desktop:', desktopVisibleTocs);

  // Test copy button interaction
  const copyBtn = page.locator('.code-copy-btn').first();
  await copyBtn.click();
  await page.waitForTimeout(300);
  const copyBtnText = await copyBtn.textContent();
  console.log(`Copy button feedback text: "${copyBtnText.trim()}"`);

  // Check Table
  const tableCount = await page.locator('.article-table-container table').count();
  console.log(`Responsive Tables found: ${tableCount}`);

  // Check Blockquote
  const bqCount = await page.locator('.article-content blockquote').count();
  console.log(`Blockquotes found: ${bqCount}`);

  // 2. Capture Screenshots across viewports & themes
  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'laptop-1024', width: 1024, height: 768 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-360', width: 360, height: 640 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    // Check dark mode
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(100);

    const darkOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    const darkPath = path.join(screenshotsDir, `article-${vp.name}-dark.png`);
    await page.screenshot({ path: darkPath, fullPage: false });
    console.log(`Captured: ${darkPath} (Overflow: ${darkOverflow})`);

    // Check light mode
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.waitForTimeout(100);

    const lightOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    const lightPath = path.join(screenshotsDir, `article-${vp.name}-light.png`);
    await page.screenshot({ path: lightPath, fullPage: false });
    console.log(`Captured: ${lightPath} (Overflow: ${lightOverflow})`);
  }

  console.log('\n✓ All article verification and screenshots completed successfully!');
  await browser.close();
  server.close();
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
