import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const svgPath = path.resolve(process.cwd(), 'public/favicon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

const targets = [
  { file: 'public/favicon-16x16.png', size: 16 },
  { file: 'public/favicon-32x32.png', size: 32 },
  { file: 'public/apple-touch-icon.png', size: 180 },
  { file: 'public/icon-192.png', size: 192 },
  { file: 'public/icon-512.png', size: 512 }
];

async function generate() {
  console.log('Generating PNG favicons from SVG...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const page = await browser.newPage();

  for (const target of targets) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body, html { width: ${target.size}px; height: ${target.size}px; overflow: hidden; background: transparent; }
            svg { width: ${target.size}px; height: ${target.size}px; display: block; }
          </style>
        </head>
        <body>
          ${svgContent}
        </body>
      </html>
    `;

    await page.setViewportSize({ width: target.size, height: target.size });
    await page.setContent(html);
    const destPath = path.resolve(process.cwd(), target.file);
    await page.screenshot({
      path: destPath,
      omitBackground: true
    });
    const stat = fs.statSync(destPath);
    console.log(`✓ Generated ${target.file} (${target.size}x${target.size}) - ${stat.size} bytes`);
  }

  await browser.close();
  console.log('All PNG favicons generated successfully!');
}

generate().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
