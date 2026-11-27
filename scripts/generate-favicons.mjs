import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const PUBLIC_DIR = path.resolve('public');
const svgContent = fs.readFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), 'utf-8');

const targets = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 }
];

async function generate() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  for (const target of targets) {
    const page = await browser.newPage({
      viewport: { width: target.size, height: target.size },
      deviceScaleFactor: 1
    });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { width: ${target.size}px; height: ${target.size}px; overflow: hidden; background: transparent; }
            svg { width: 100%; height: 100%; display: block; }
          </style>
        </head>
        <body>
          ${svgContent}
        </body>
      </html>
    `;

    await page.setContent(html);
    await page.screenshot({
      path: path.join(PUBLIC_DIR, target.name),
      omitBackground: true
    });
    console.log(`Generated: ${target.name} (${target.size}x${target.size})`);
    await page.close();
  }

  await browser.close();
  console.log('All favicon PNGs generated successfully.');
}

generate().catch(console.error);
