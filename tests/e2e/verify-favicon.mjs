import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const PORT = 4327;
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

async function verify() {
  console.log('=== Starting Favicon Integration & Display Verification ===');
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Server listening on ${BASE_URL}`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const page = await browser.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

  // 1. Check head links
  const links = await page.evaluate(() => {
    const rels = ['icon', 'apple-touch-icon'];
    const elements = Array.from(document.querySelectorAll('link')).filter(l => rels.some(r => l.rel.includes(r)));
    return elements.map(l => ({
      rel: l.rel,
      type: l.type,
      sizes: l.sizes ? Array.from(l.sizes).join(' ') : null,
      href: l.href
    }));
  });

  console.log('Favicon links found in <head>:', links);

  let allPassed = true;
  for (const l of links) {
    const resp = await page.goto(l.href);
    const status = resp.status();
    const contentType = resp.headers()['content-type'];
    const body = await resp.body();
    const valid = status === 200 && body.length > 0;
    console.log(`  ✓ ${l.rel} (${l.sizes || 'any'}): HTTP ${status}, Content-Type: ${contentType}, Size: ${body.length} bytes`);
    if (!valid) allPassed = false;
  }

  // 2. Generate visual showcase / preview in browser context
  const showcaseHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <base href="${BASE_URL}">
      <title>FH Monogram Favicon Showcase</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #0E1117;
          color: #F0EDE8;
          padding: 40px;
        }
        h1 { font-size: 24px; margin-bottom: 8px; color: #F0EDE8; }
        p.subtitle { color: #8B949E; margin-bottom: 32px; font-size: 14px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
        .card {
          background: #161B22;
          border: 1px solid rgba(240, 237, 232, 0.1);
          border-radius: 12px;
          padding: 24px;
        }
        .card h2 { font-size: 16px; margin-bottom: 16px; color: #C8F73E; font-family: monospace; }
        
        /* Browser Tab Simulation: Dark */
        .tab-bar-dark {
          background: #18181F;
          padding: 8px 12px 0 12px;
          border-radius: 8px 8px 0 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tab-dark {
          background: #09090E;
          border-radius: 8px 8px 0 0;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #F0EDE8;
          width: 220px;
          box-shadow: 0 -1px 3px rgba(0,0,0,0.3);
        }

        /* Browser Tab Simulation: Light */
        .tab-bar-light {
          background: #E5E5EA;
          padding: 8px 12px 0 12px;
          border-radius: 8px 8px 0 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tab-light {
          background: #FFFFFF;
          border-radius: 8px 8px 0 0;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #111116;
          width: 220px;
          box-shadow: 0 -1px 3px rgba(0,0,0,0.1);
        }

        /* Bookmark Bar Simulation */
        .bookmark-bar {
          background: #20232B;
          padding: 8px 12px;
          border-radius: 0 0 8px 8px;
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 12px;
          color: #C9D1D9;
        }
        .bookmark-item { display: flex; align-items: center; gap: 8px; }

        /* Icon Grid */
        .sizes-row {
          display: flex;
          align-items: flex-end;
          gap: 24px;
          padding: 16px 0;
        }
        .size-box { text-align: center; }
        .size-box span { display: block; font-size: 11px; color: #8B949E; margin-top: 8px; font-family: monospace; }
        .size-box img { display: inline-block; }
      </style>
    </head>
    <body>
      <h1>FH Monogram - Favicon & App Icon System</h1>
      <p class="subtitle">Designed for high-contrast visibility on dark/light tabs, bookmarks, and mobile home screens.</p>

      <div class="grid">
        <!-- Tab Simulation: Dark -->
        <div class="card">
          <h2>01. Dark Browser Tab Simulation</h2>
          <div class="tab-bar-dark">
            <div class="tab-dark">
              <img src="/favicon.svg" width="16" height="16" alt="favicon">
              <span style="truncate">Fuad Hasan | Software Engineer</span>
            </div>
          </div>
          <div class="bookmark-bar">
            <div class="bookmark-item">
              <img src="/favicon-16x16.png" width="16" height="16" alt="favicon">
              <span>FH Portfolio</span>
            </div>
            <div class="bookmark-item">
              <img src="/favicon-16x16.png" width="16" height="16" alt="favicon">
              <span>Articles</span>
            </div>
          </div>
        </div>

        <!-- Tab Simulation: Light -->
        <div class="card">
          <h2>02. Light Browser Tab Simulation</h2>
          <div class="tab-bar-light">
            <div class="tab-light">
              <img src="/favicon.svg" width="16" height="16" alt="favicon">
              <span style="truncate">Fuad Hasan | Software Engineer</span>
            </div>
          </div>
          <div class="bookmark-bar" style="background: #F2F2F7; color: #3A3A3C;">
            <div class="bookmark-item">
              <img src="/favicon-16x16.png" width="16" height="16" alt="favicon">
              <span>FH Portfolio</span>
            </div>
            <div class="bookmark-item">
              <img src="/favicon-16x16.png" width="16" height="16" alt="favicon">
              <span>Articles</span>
            </div>
          </div>
        </div>

        <!-- Scale Verification -->
        <div class="card" style="grid-column: 1 / -1;">
          <h2>03. Scalability: Vector & Raster Renderings (16px to 180px)</h2>
          <div class="sizes-row">
            <div class="size-box">
              <img src="/favicon-16x16.png" width="16" height="16" alt="16x16">
              <span>16x16 PNG</span>
            </div>
            <div class="size-box">
              <img src="/favicon-32x32.png" width="32" height="32" alt="32x32">
              <span>32x32 PNG</span>
            </div>
            <div class="size-box">
              <img src="/favicon.svg" width="64" height="64" alt="64x64">
              <span>64x64 SVG</span>
            </div>
            <div class="size-box">
              <img src="/apple-touch-icon.png" width="96" height="96" alt="96x96">
              <span>Apple Touch Icon (180x180)</span>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const showcaseFilePath = path.join(DIST_DIR, 'favicon-showcase.html');
  fs.writeFileSync(showcaseFilePath, showcaseHtml);
  await page.goto(`${BASE_URL}/favicon-showcase.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  const showcasePath = path.resolve(process.cwd(), 'tests/screenshots/favicon-verification-showcase.png');
  await page.screenshot({ path: showcasePath, fullPage: true });
  console.log(`✓ Showcase screenshot saved to ${showcasePath}`);
  
  if (fs.existsSync(showcaseFilePath)) {
    fs.unlinkSync(showcaseFilePath);
  }

  await browser.close();
  server.close();

  if (allPassed) {
    console.log('========================================');
    console.log('✓ All Favicon checks PASSED!');
    console.log('========================================');
  } else {
    console.error('✗ Some favicon checks failed.');
    process.exit(1);
  }
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
