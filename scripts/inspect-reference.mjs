import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const TARGET_URL = 'https://patio-saved-34629488.figma.site/';
const OUTPUT_DIR = path.resolve('docs/assets');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function analyze() {
  console.log(`Launching browser to inspect ${TARGET_URL}...`);
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  try {
    // 1. Desktop 1440px
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2
    });
    const desktopPage = await desktopContext.newPage();
    console.log('Navigating to desktop view...');
    await desktopPage.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await desktopPage.waitForTimeout(3000); // Allow animations/fonts to settle

    const desktopScreenshotPath = path.join(OUTPUT_DIR, 'reference-desktop-1440.png');
    await desktopPage.screenshot({ path: desktopScreenshotPath, fullPage: true });
    console.log(`✓ Desktop screenshot saved: ${desktopScreenshotPath}`);

    // Extract design tokens and structure
    const analysis = await desktopPage.evaluate(() => {
      const getStyles = (el) => {
        if (!el) return null;
        const s = window.getComputedStyle(el);
        return {
          color: s.color,
          backgroundColor: s.backgroundColor,
          fontFamily: s.fontFamily,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          lineHeight: s.lineHeight,
          letterSpacing: s.letterSpacing,
          borderRadius: s.borderRadius,
          border: s.border,
          boxShadow: s.boxShadow,
          padding: s.padding,
          margin: s.margin,
          gap: s.gap
        };
      };

      // Collect sections
      const sections = [];
      document.querySelectorAll('section, header, footer, nav, [class*="section"], [class*="hero"], [class*="project"], [class*="card"]').forEach((el) => {
        sections.push({
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          textExcerpt: el.innerText ? el.innerText.slice(0, 150).replace(/\n+/g, ' ') : '',
          styles: getStyles(el)
        });
      });

      // Sample elements
      const bodyStyle = getStyles(document.body);
      const h1 = document.querySelector('h1');
      const h2 = document.querySelector('h2');
      const p = document.querySelector('p');
      const a = document.querySelector('a');
      const button = document.querySelector('button');
      const header = document.querySelector('header') || document.querySelector('nav');

      // Extract raw body HTML structure without deep content
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => ({
        tag: h.tagName,
        text: h.innerText.trim(),
        style: getStyles(h)
      }));

      // Extract colors used
      const allElements = Array.from(document.querySelectorAll('*'));
      const bgColors = new Set();
      const textColors = new Set();
      const fontFamilies = new Set();

      allElements.forEach(el => {
        const cs = window.getComputedStyle(el);
        if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') bgColors.add(cs.backgroundColor);
        if (cs.color) textColors.add(cs.color);
        if (cs.fontFamily) fontFamilies.add(cs.fontFamily);
      });

      return {
        title: document.title,
        bodyStyle,
        headerStyle: getStyles(header),
        h1Style: getStyles(h1),
        h2Style: getStyles(h2),
        pStyle: getStyles(p),
        aStyle: getStyles(a),
        buttonStyle: getStyles(button),
        headings,
        bgColors: Array.from(bgColors),
        textColors: Array.from(textColors),
        fontFamilies: Array.from(fontFamilies),
        fullText: document.body.innerText
      };
    });

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'reference-analysis.json'),
      JSON.stringify(analysis, null, 2),
      'utf-8'
    );
    console.log('✓ Design analysis saved to docs/assets/reference-analysis.json');

    await desktopContext.close();

    // 2. Mobile 390px
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2
    });
    const mobilePage = await mobileContext.newPage();
    console.log('Navigating to mobile view...');
    await mobilePage.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await mobilePage.waitForTimeout(3000);

    const mobileScreenshotPath = path.join(OUTPUT_DIR, 'reference-mobile-390.png');
    await mobilePage.screenshot({ path: mobileScreenshotPath, fullPage: true });
    console.log(`✓ Mobile screenshot saved: ${mobileScreenshotPath}`);

    await mobileContext.close();

    console.log('\n=== REFERENCE ANALYSIS COMPLETED SUCCESSFULLY ===');
  } finally {
    await browser.close();
  }
}

analyze().catch((err) => {
  console.error('Failed to inspect reference site:', err);
  process.exit(1);
});

