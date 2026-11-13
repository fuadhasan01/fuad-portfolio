import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const PORT = 4330;
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
  '.txt': 'text/plain',
  '.pdf': 'application/pdf'
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

async function main() {
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Server running at ${BASE_URL}`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
    args: ['--remote-debugging-port=9222']
  });

  const context = await browser.newContext({
    colorScheme: 'dark',
    permissions: ['clipboard-read', 'clipboard-write']
  });
  const page = await context.newPage();

  const outDir = path.resolve(process.cwd(), 'docs/assets');

  console.log('\n--- Capturing Redesign Screenshots ---');

  // 1. Desktop 1440px Dark
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'redesign-desktop-1440.png'), fullPage: true });
  console.log('✓ Captured docs/assets/redesign-desktop-1440.png');

  // 2. Desktop 1440px Light Mode
  const lightContext = await browser.newContext({
    colorScheme: 'light',
    permissions: ['clipboard-read', 'clipboard-write']
  });
  const lightPage = await lightContext.newPage();
  await lightPage.setViewportSize({ width: 1440, height: 900 });
  await lightPage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await lightPage.screenshot({ path: path.join(outDir, 'redesign-desktop-1440-light.png'), fullPage: true });
  console.log('✓ Captured docs/assets/redesign-desktop-1440-light.png');
  await lightContext.close();

  // 3. Tablet 768px Dark
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'redesign-tablet-768.png'), fullPage: true });
  console.log('✓ Captured docs/assets/redesign-tablet-768.png');

  // 4. Mobile 390px Dark
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'redesign-mobile-390.png'), fullPage: true });
  console.log('✓ Captured docs/assets/redesign-mobile-390.png');

  // 5. Projects Listing 1440px
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/projects`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'redesign-projects-1440.png'), fullPage: true });
  console.log('✓ Captured docs/assets/redesign-projects-1440.png');

  // 6. Case Study 1440px
  await page.goto(`${BASE_URL}/projects/edusubmit`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'redesign-casestudy-1440.png'), fullPage: true });
  console.log('✓ Captured docs/assets/redesign-casestudy-1440.png');

  // 7. Blog Listing 1440px
  await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'redesign-blog-1440.png'), fullPage: true });
  console.log('✓ Captured docs/assets/redesign-blog-1440.png');

  // 8. Blog Article 1440px
  await page.goto(`${BASE_URL}/blog/understanding-outbox-pattern`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'redesign-article-1440.png'), fullPage: true });
  console.log('✓ Captured docs/assets/redesign-article-1440.png');

  // 9. Experience 1440px
  await page.goto(`${BASE_URL}/experience`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'redesign-experience-1440.png'), fullPage: true });
  console.log('✓ Captured docs/assets/redesign-experience-1440.png');

  // 10. About 1440px
  await page.goto(`${BASE_URL}/about`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'redesign-about-1440.png'), fullPage: true });
  console.log('✓ Captured docs/assets/redesign-about-1440.png');

  // 11. Contact 1440px
  await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'redesign-contact-1440.png'), fullPage: true });
  console.log('✓ Captured docs/assets/redesign-contact-1440.png');

  console.log('\n--- Running Axe Accessibility Audit on Home Page ---');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  const axeResults = await new AxeBuilder({ page }).analyze();
  console.log(`Axe Violations: ${axeResults.violations.length}`);
  if (axeResults.violations.length > 0) {
    axeResults.violations.forEach((v) => {
      console.log(`  - [${v.impact}] ${v.id}: ${v.description}`);
      v.nodes.forEach((n) => console.log(`      Node: ${n.target.join(' ')}`));
    });
  }

  await browser.close();
  server.close();
  console.log('\n✓ Redesign verification and screenshot capture complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
