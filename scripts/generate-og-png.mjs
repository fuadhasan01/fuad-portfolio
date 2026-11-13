import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

async function generatePng() {
  const svgPath = path.resolve('public/og-default.svg');
  const pngPath = path.resolve('public/og-default.png');

  const svgContent = fs.readFileSync(svgPath, 'utf-8');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;overflow:hidden">${svgContent}</body></html>`);
  await page.screenshot({ path: pngPath });
  await browser.close();
  console.log(`✓ Generated ${pngPath}`);
}

generatePng().catch((err) => {
  console.error('Failed to generate PNG:', err);
  process.exit(1);
});

