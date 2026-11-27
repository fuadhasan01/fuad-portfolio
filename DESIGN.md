---
schema: 1
archetype: "digital-garden-developer-documentation"
reference: "https://www.taniarascia.com/"
author: "Fuad Hasan"
updated: "2026-11-28"
modes:
  persuade: "Personal identity, authentic craftsmanship, and proven technical work"
  read: "Unobstructed technical reading with calm type rhythm, comfortable line length, and warm paper/charcoal tones"
  operate: "Compact, functional navigation, accessible controls, and persistent sidebar"
tokens:
  radii:
    none: "0px"
    sm: "4px"
    md: "6px"
    lg: "8px"
  transitions:
    fast: "120ms ease"
    base: "150ms ease"
  layout:
    sidebar_width: "250px"
    content_width: "760px"
    content_wide: "1020px"
    post_sidebar_width: "240px"
    navbar_height: "56px"
  breakpoints:
    sm: "600px"
    md: "800px"
    lg: "1020px"
    xl: "1360px"
---

# Design System Specification — Fuad Hasan Portfolio

## 1. Overview & Creative North Star

This design system establishes an authentic personal developer website inspired by **Tania Rascia's website (taniarascia.com)**. It balances a **digital garden** with a **technical documentation** layout.

### Visual Philosophy
- **Authentic Developer Identity:** Replaces all generic AI tropes (neon gradient text, pulsing green dots, floating glass badges, vanity metric bento counters, and toy bash prompts) with structural honesty.
- **Warm Tactility:** Replaces cold stark white with a warm paper canvas (`#F8F4E6`) in light mode, and sterile blue-black with a warm charcoal (`#202025`) in dark mode.
- **Content-First Cadence:** Compact components, calm headings, natural whitespace, readable 65–75ch prose line lengths, and purposeful monospace coordinates.
- **Persistent Two-Column Layout:** A dedicated left sidebar on desktop (`>= 1020px`) hosts identity, navigation, socials, theme toggle, and accent selector; main content breathes freely with a balanced reading width.

---

## 2. Color Palette & Semantic Tokens

### Core Neutral Palette

```
/* Light Mode (Warm Paper) */
Canvas Background:        #F8F4E6  (--color-bg)
Alternate / Code Surface: #F1EAD5  (--color-bg-alt)
Input & Tag Surface:      #ECE4CA  (--color-bg-subtle)
Card Background:          #F1EAD5  (--color-bg-card)
Card Border:              #DED4B2  (--color-border-card)
Standard Border:          #E5DCBD  (--color-border)
Strong / Hover Border:    #C6BA93  (--color-border-strong)
Primary Text:             #28282E  (--color-text)
Emphasized Heading Text:  #1D1D22  (--color-text-emphasized)
Muted Metadata Text:      #5A5A61  (--color-text-muted)

/* Dark Mode (Soft Charcoal) */
Canvas Background:        #202025  (--color-bg)
Alternate / Code Surface: #16161A  (--color-bg-alt)
Input & Tag Surface:      #1D1D22  (--color-bg-subtle)
Card Background:          #28282E  (--color-bg-card)
Card Border:              #323239  (--color-border-card)
Standard Border:          #323239  (--color-border)
Strong / Hover Border:    #4E4E55  (--color-border-strong)
Primary Text:             #D4D4D8  (--color-text)
Emphasized Heading Text:  #FBFBFB  (--color-text-emphasized)
Muted Metadata Text:      #A1A1A8  (--color-text-muted)
```

### Canonical Accent Palette

The portfolio features a single, unified accent color inspired by Tania Rascia's signature warm amber and gold, applied through the CSS custom property `--color-primary`:

| Accent Name | Light Mode Value | Dark Mode Value | Semantic Role |
|---|---|---|---|
| **Amber (Canonical)** | `#B26A34` | `#FEDE91` | Warm technical tone, links, primary CTA outline, active navigation dot, chip highlights |

The accent meets WCAG AA contrast standards (minimum 4.5:1 for body links and 3:1 for large text/interactive borders) against both the warm paper and soft charcoal canvas surfaces.

---

## 3. Typography System

The typography creates a natural rhythm inspired by technical documentation:

- **Display & Headings:** `Outfit` (Variable 500, 600, 700) — clean geometric sans with warm humanist curves.
- **Body & Prose:** `DM Sans` / `Google Sans Flex` (Variable 400, 500) — maximum reading clarity, balanced x-height.
- **Monospace & Metadata:** `JetBrains Mono` / `Google Sans Code` (400, 500) — reserved strictly for dates, code, tags, versioning, and tabular data.

### Typographic Hierarchy & Scale

```
Display H1:    2.4rem (38–40px) • SemiBold (600) / Bold (700) • Line Height 1.2
Section H2:    1.8rem (28–30px) • SemiBold (600)               • Line Height 1.25
Subsection H3: 1.4rem (22–24px) • Medium (500) / SemiBold     • Line Height 1.3
Minor H4:      1.15rem (18–20px)• SemiBold (600)               • Line Height 1.35
Body Prose:    1.0rem–1.05rem (16–17px) • Regular (400)        • Line Height 1.6 • Max 65–75ch
Sidebar Text:  0.9rem–0.95rem (14–15px) • Medium (500)         • Line Height 1.4
Metadata / Tag:0.8rem–0.85rem (13–14px) • Monospace Medium    • Line Height 1.2
```

---

## 4. Layout Architecture & Spatial Grid

### Persistent Two-Column Desktop Layout (`>= 1020px`)
- **Left Sidebar (`250px`):** Sticky (`position: sticky; top: 0; height: 100vh; overflow-y: auto;`), border-right (`1px solid var(--color-border)`).
  - Avatar / Profile Image: `52px` rounded square with subtle border.
  - Personal Identity: Name (`Fuad Hasan`), designation (`Full Stack Software Engineer`), short narrative note.
  - Primary Navigation: Stacked vertical links with hover background and active state indicators.
  - Secondary Links: GitHub, LinkedIn, LeetCode, Email, Resume PDF.
  - Controls: Dark/Light mode toggle button and 5-circle Accent Color Dropdown.
- **Main Content Area:**
  - Standard reading pages (Articles, Case Studies, About): `max-w-[760px]`.
  - Wider overview pages (Projects catalog, Blog listing): `max-w-[1020px]`.
  - Padding: `2rem` horizontal, `2.5rem` vertical.
- **Optional Contextual Right Sidebar (`>= 1360px`):**
  - Reserved for long articles and detailed case studies (`240px`).
  - Contains sticky Table of Contents and article metadata.

### Mobile & Tablet Layout (`< 1020px`)
- **Top Mobile Navbar (`56px`):** Sticky header with site name, theme toggle, accent picker, and mobile menu button.
- **Mobile Menu Overlay:** Dropdown navigation panel preserving all navigation links, social channels, and resume link.
- **Content:** Fluid single column with `1.25rem` horizontal padding; zero horizontal overflow.

---

## 5. Component Design Language

### Buttons
- **Primary Button:** Transparent background, `1.5px solid var(--color-primary)`, text color `var(--color-primary)`, `border-radius: 8px`, `padding: 8px 14px`. Hover: Background `var(--color-primary)`, text color white (light) or charcoal (dark).
- **Secondary Button:** Surface background (`var(--color-bg-subtle)`), subtle neutral border (`var(--color-border)`), primary text. Hover: border tints toward `var(--color-primary)`.
- **No gradient pills, no glowing shadows, no bounce animations.**

### Links
- Color: `var(--color-primary)`.
- Underline: Deliberate semi-transparent underline (`text-decoration-color: color-mix(in srgb, var(--color-primary) 45%, transparent)`), expanding to full accent color and subtle background tint on hover.

### Cards (Project Cards, Experience Cards)
- Background: Solid tinted surface (`var(--color-bg-card)`).
- Border: Crisp `1.5px` border (`var(--color-border-card)`).
- Corner Radius: `8px`.
- Padding: `1rem` internal spacing.
- Hover: Border color transitions to `var(--color-primary)` with `150ms ease`.

### Tags & Badges
- Monospace font (`JetBrains Mono`), `0.8rem` font size.
- Preceded by a subtle `#` in accent color: `#tag`.
- Background: `var(--color-bg-subtle)`, border `1px solid var(--color-border)`.
- Subtle `6px` radius. Never oversized pills.

### Blockquotes & Callouts
- Left border: `4px solid var(--color-primary)`.
- Background: `var(--color-bg-alt)`.
- Padding: `1rem 1.25rem`. Rounded right corners (`6px`).

---

## 6. Interaction & Motion Rules

- **Micro-interactions Only:** All transitions are strictly `120ms–150ms ease` for color, background, and border properties.
- **No Scroll-Triggered Fade-Ins:** Content is immediately readable upon scroll.
- **Reduced Motion Support:** `@media (prefers-reduced-motion: reduce)` disables all transitions.

---

## 7. Strict Do's and Don'ts

### Do:
- Use warm paper (`#F8F4E6`) in light mode and soft charcoal (`#202025`) in dark mode.
- Respect content hierarchy: allow the written text and real work to lead.
- Keep the left sidebar sticky and accessible on desktop screens.
- Use 8px radii consistently across buttons, inputs, tags, and cards.
- Provide accessible names and visible focus rings (`2px solid var(--color-primary)`).

### Don't:
- Do not use purple/blue neon gradient text or glowing backgrounds.
- Do not use frosted-glass cards (`backdrop-blur` with semitransparent white/black).
- Do not use pulsing green status dots or toy badge stickers.
- Do not use fake terminal prompts (`fuad@workstation ~`).
- Do not use bento grid vanity metric counters (`3+ projects`, `2+ years`).
- Do not use uppercase section kickers (`// 01. ABOUT ME`).
- Do not invent, alter, or remove any original portfolio text or data.
