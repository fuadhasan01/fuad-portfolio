import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const PORT = 4333;
const DIST_DIR = path.resolve('dist');
const OUTPUT_DIR = path.resolve('tests/screenshots/redesign');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2'
};

function createServer() {
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
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  });
}

async function capture() {
  const server = createServer();
  await new Promise(r => server.listen(PORT, r));
  console.log(`Server listening on http://localhost:${PORT}`);

  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  const routes = [
    { path: '/', name: 'home' },
    { path: '/about', name: 'about' },
    { path: '/experience', name: 'experience' },
    { path: '/projects', name: 'projects' },
    { path: '/projects/edusubmit', name: 'case-study' },
    { path: '/blog', name: 'blog' },
    { path: '/blog/understanding-outbox-pattern', name: 'article' },
    { path: '/contact', name: 'contact' }
  ];

  const viewports = [
    { width: 1440, height: 900, name: 'desktop' },
    { width: 1024, height: 768, name: 'laptop' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 390, height: 844, name: 'mobile' }
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: 'dark'
    });
    const page = await context.newPage();

    for (const r of routes) {
      if (vp.name !== 'desktop' && r.name !== 'home' && r.name !== 'case-study' && r.name !== 'article') {
        // Capture only desktop + mobile for all, and all viewports for home & articles
        if (vp.name !== 'mobile') continue;
      }

      await page.goto(`http://localhost:${PORT}${r.path}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.documentElement.classList.add('dark'));
      await page.waitForTimeout(100);

      const filename = `${r.name}-${vp.name}-dark.png`;
      await page.screenshot({ path: path.join(OUTPUT_DIR, filename), fullPage: r.name !== 'home' });
      console.log(`Saved: ${filename}`);

      if (vp.name === 'desktop') {
        await page.evaluate(() => {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        });
        await page.waitForTimeout(100);
        const filenameLight = `${r.name}-${vp.name}-light.png`;
        await page.screenshot({ path: path.join(OUTPUT_DIR, filenameLight), fullPage: r.name !== 'home' });
        console.log(`Saved: ${filenameLight}`);
      }
    }

    await context.close();
  }

  await browser.close();
  server.close();
  console.log('All screenshots captured successfully.');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
