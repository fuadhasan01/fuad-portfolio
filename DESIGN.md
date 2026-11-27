---
name: Fuad Hasan Portfolio
description: Architectural Dossier Design System for Fuad Hasan, Full Stack & Backend Systems Engineer
colors:
  primary: "#111217"
  primary-dark: "#F4F3EF"
  neutral-bg: "#F8F9FA"
  neutral-bg-dark: "#0C0D12"
  surface: "#FFFFFF"
  surface-dark: "#151720"
  secondary: "#F0F0EE"
  secondary-dark: "#1D202B"
  accent: "#D97706"
  accent-dark: "#F59E0B"
  accent-hover: "#B45309"
  accent-dark-hover: "#D97706"
  muted: "#5A5D6B"
  muted-dark: "#9496A1"
  border: "rgba(17, 18, 23, 0.08)"
  border-dark: "rgba(244, 243, 239, 0.10)"
typography:
  display:
    fontFamily: "Cabinet Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Cabinet Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Cabinet Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "DM Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 20px"
---

# Design System: Fuad Hasan Portfolio

## Overview

**Creative North Star: "The Architectural Dossier"**

A design language rooted in structural engineering discipline, industrial restraint, and mathematical clarity. Drawing inspiration from high-end architectural monographs (such as *El Croquis*) and classic Bell Labs / DEC systems documentation, the system communicates the senior-track authority of a backend and full-stack software engineer specializing in distributed reliability, transactional boundaries, and database query profiling.

The system completely rejects generic AI template aesthetics: zero pulsing availability dots, zero neon chartreuse accents, zero fake terminal shell prompt boxes, zero decorative glassmorphism, zero pill badge fatigue, and zero overused decorative serifs. In their place stands an uncompromising dedication to structural layout, readable typography, and authentic technical signal.

**Key Characteristics:**
- **Restrained Materiality:** Solid, opaque surfaces with hairline architectural rules (`1px border`); no gratuitous blurs or zero-offset colored shadows.
- **Unified Color Personality:** A single signature accent—**Technical Amber (`#D97706` / `#F59E0B`)**—that feels natural, mature, and purposeful in both Dark and Light modes.
- **Architectural Typography:** Bold, precise Grotesque headings (**Cabinet Grotesk**) paired with a high-legibility humanist body face (**DM Sans**), with **JetBrains Mono** reserved exclusively for code, measurements, and tabular data.
- **Content as Structure:** Project case studies are formatted as technical system dossiers detailing architectural trade-offs, concurrency models, and database internals rather than generic marketing cards.

## Colors

The palette establishes a dignified, high-contrast visual environment that respects the viewer's focus across both ambient lighting conditions.

| Token | Light Mode (`:root`) | Dark Mode (`.dark`) | Semantic Role |
|---|---|---|---|
| `canvas` | `#F8F9FA` (Architect Drafting Paper) | `#0C0D12` (Graphite Slate) | Base background canvas. Low glare, comfortable for extended technical reading. |
| `surface` | `#FFFFFF` (Pure Crisp White) | `#151720` (Warm Concrete Charcoal) | Container, panel, and ledger card surfaces. |
| `secondary` | `#F0F0EE` (Subtle Warm Tint) | `#1D202B` (Muted Steel Slate) | Code blocks, table headers, and neutral hover states. |
| `primary` | `#111217` (Deep Obsidian Ink) | `#F4F3EF` (Warm Bone White) | Primary typography, headlines, and high-emphasis elements. |
| `muted` | `#5A5D6B` (Architectural Slate) | `#9496A1` (Cool Silver Grey) | Secondary descriptions, timestamps, and supporting text. All meet WCAG AA (≥ 4.5:1). |
| `accent` | `#D97706` (Technical Amber) | `#F59E0B` (Warm Phosphor Amber) | Interactive focus states, key links, and signature highlights. Unified chromatic identity. |
| `border` | `rgba(17, 18, 23, 0.08)` | `rgba(244, 243, 239, 0.10)` | Hairline structural dividers and container bounds. |

## Typography

Typographic scale is strictly calibrated to preserve natural reading rhythm and avoid exaggerated display extremes.

```
Display:      3.5rem – 4.5rem (56–72px)  • Cabinet Grotesk Bold (800)       • Tracking -0.03em
Headline:     2.0rem – 2.5rem (32–40px)  • Cabinet Grotesk SemiBold (700)   • Tracking -0.025em
Title:        1.25rem – 1.5rem (20–24px) • Cabinet Grotesk SemiBold (700)   • Tracking -0.015em
Body:         1.0rem (16px), 1.6 leading • DM Sans Regular (400)             • Line length 65–75ch
Technical:    0.8125rem (13px)           • JetBrains Mono Medium (500)       • Tabular figures
```

**Typography Rules:**
- Never use monospace as a costume for ordinary narrative text or decorative section kickers.
- Eyebrow / kicker labels above headings are forbidden: let the headline carry its own meaning.
- Headings use sentence casing or standard title casing; no forced all-caps on major titles.

## Layout & Spatial System

- **Baseline Grid:** 8px base rhythm with 16px, 24px, 32px, 48px, and 64px vertical spacing increments.
- **Container Max-Width:** `max-w-5xl` (1024px) for editorial balance; `max-w-6xl` (1152px) for structured dossier grids.
- **Pacing:** Generous separation above sections (`py-16 sm:py-20`), tighter grouping within components.
- **Responsive Transitions:** Fluid single-column collapse on viewports `< 768px`; disciplined 2-column or 3-column architectural splits on desktop.

## Elevation & Depth

- **Zero-Blur Zero-Offset Halo Ban:** Glowing colored shadows behind images or cards are strictly banned.
- **Structural Elevation:** Depth is achieved through tonal surface contrast (`canvas` vs. `surface`) and crisp hairline borders (`1px border`).
- **Tactile Shadows:** Where elevation is necessary on elevated elements (e.g. active dialogs), use offset, soft-blur neutral shadows: `0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)`.

## Shapes & Form Language

- **Corner Radii:** Restrained industrial radii (`rounded-md` / `rounded-lg`, 6px–8px). Bubble-like `rounded-2xl` and `rounded-3xl` cards are eliminated.
- **Buttons:** Sharp, solid, and tactile. High contrast with clear label actions (`"View Case Studies ↓"`, `"Get in Touch"`, `"Download CV ↗"`).
- **Badges & Tags:** Eliminated pill badge fatigue. Technologies and parameters are displayed as clean, comma-delimited text or compact monospace specification tables.

## Components

### 1. Header & Navigation
- Clear brand identity: `"Fuad Hasan"` in clean Cabinet Grotesk SemiBold, with role indicator `"Systems & Full Stack"`.
- Navigation items with subtle underline indicator on active route.
- Professional action CTA: `"Get in Touch"` (replaces the freelance `"Hire Me"` button).
- Synchronized, zero-flash theme toggle with accessible tooltip.

### 2. System Dossier (Projects)
- Replaces generic 3-column cards with structured technical dossiers.
- Header: Title, project timeline, and core architectural domain.
- Summary: Specific problem domain and engineering challenge.
- Specification Table: Architecture pattern (e.g. CQRS, Outbox), Primary Database, Message Broker, and Frontend.
- Action Bar: Direct case study link and verified GitHub repository.

### 3. Career Ledger (Experience)
- Replaces the toy dotted line timeline with a publication-grade ledger.
- Horizontal dividing rules with clear date bands (`2024 — Present`).
- Clear company hierarchy and verified engineering bullet points.

### 4. Technical Writing (Blog)
- Clean chronological list with publication date, category, title, excerpt, and reading time.
- Syntax highlighted code blocks with high-contrast comments (WCAG AA compliant).

## Do's and Don'ts

### Do
- Use technical amber (`#D97706` / `#F59E0B`) consistently for key actions and highlights.
- Ground all claims in real architectural case studies and verified repos.
- Ensure all text-to-background contrast ratios exceed 4.5:1.
- Provide explicit keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-amber-500`).
- Test all pages across 360px, 390px, 768px, 1024px, and 1440px viewports.

### Don't
- Never add pulsing green dots, glowing halos, or fake Linux bash prompts.
- Never wrap every single technology keyword in a rounded border pill capsule.
- Never use generic display serifs or gradient text.
- Never create conflicting color schemes between light and dark modes.
- Never invent unverified career achievements, testimonials, or metrics.
