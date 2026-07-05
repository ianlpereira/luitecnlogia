# LUi Tecnologia — Agent Instructions

This document is the authoritative reference for any agent (human or AI) working on the **LUi Tecnologia** website. Read it fully before making any changes.

---

## 1. Project Overview

**What it is:** A single-page marketing website for LUi Tecnologia, a Brazilian software consultancy offering web development, mobile apps, and technical consulting.

**Live URL:** https://lui-tecnologia.com/  
**Repository:** ianlpereira/luitecnlogia  
**Language:** Portuguese (pt-BR)  
**Tech stack:** Vanilla HTML5, CSS3 (no preprocessor), vanilla JavaScript (ES2020+). No frameworks, no build step, no package manager.

**Key facts:**
- Single HTML file: `index.html` (≈ 650 lines)
- Single CSS file: `assets/css/style.css` (≈ 1 400 lines)
- Single JS file: `assets/js/main.js` (≈ 290 lines)
- Deployed via GitHub Actions → GitHub Pages
- No backend. The contact form currently has `action="#"` — it is a UI demo only.

---

## 2. File Structure

```
luitecnlogia/
├── index.html                  # Entire page markup + SEO metadata
├── favicon.svg                 # SVG favicon
├── apple-touch-icon.png        # 180×180 iOS icon
├── manifest.json               # PWA web manifest
├── robots.txt                  # SEO robots file
├── sitemap.xml                 # XML sitemap
├── instructions.md             # ← You are here
├── assets/
│   ├── css/
│   │   └── style.css           # All styles, single file, section-commented
│   ├── js/
│   │   └── main.js             # All client-side JS, single file, section-commented
│   └── images/
│       └── og-image.png        # 1200×630 Open Graph share image
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Actions CI/CD pipeline
```

---

## 3. Design System (CSS Custom Properties)

All design tokens live in `:root` at the top of `style.css`. **Always use these variables — never hardcode values.**

### Colors

| Variable | Value | Usage |
|---|---|---|
| `--color-primary` | `#282743` | Navy — header, hero, why, footer backgrounds; also `--color-ink` |
| `--color-accent` | `#05ccbb` | Teal — CTAs, highlights, focus rings, accent-i on dark bg (7.09:1 AAA) |
| `--color-accent-dark` | `#037171` | Dark teal — hover states, accent-i on light bg (5.57:1 AA) |
| `--color-surface` | `#f7faff` | Page background, process/services section bg |
| `--color-surface-soft` | `#f0f3f8` | FAQ, custom section bg |
| `--color-hairline` | `#d9dce3` | Borders on cards and inputs |
| `--color-ink` | `#282743` | Default body text color (same as primary) |
| `--color-muted` | `#6b7280` | Secondary text (4.62:1 AA on white) |
| `--color-muted-soft` | `#9ca3af` | Tertiary / placeholder text |
| `--color-white` | `#ffffff` | — |
| `--color-error` | `#dc2626` | Form error states |
| `--color-success` | `#047857` | Success states (5.48:1 AA) |
| `--color-warning` | `#b45309` | Warning states (5.02:1 AA) |

> **Accessibility rule:** Never use `--color-accent` (#05ccbb) as text on a white/light background — it fails contrast. Use `--color-accent-dark` (#037171) for text/icons on light backgrounds. The bright teal is only safe on the navy primary background.

### Typography

| Variable | Fonts | Usage |
|---|---|---|
| `--font-display` | `'Exo 2'`, fallback `'Rajdhani'`, sans-serif | Headings, logo wordmark, process numbers |
| `--font-body` | `'Montserrat'`, fallback `'Inter'`, sans-serif | Body text, labels, nav links |

Fonts are self-hosted in `assets/fonts/` as `.woff2` files (latin + latin-ext subsets). `@font-face` rules are at the top of `style.css`. Do not add Google Fonts links back.

### Spacing Scale

| Variable | Value |
|---|---|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |
| `--space-3xl` | 64px |

### Other Tokens

| Variable | Value | Notes |
|---|---|---|
| `--header-height` | `68px` | Sticky header height. Used in hero min-height and mobile nav offset. Do not change without updating JS too. |
| `--container-max` | `1200px` | Max width of `.container` |
| `--radius-sm` | `6px` | Buttons, small elements |
| `--radius-md` | `12px` | Cards, modals |
| `--shadow-card` | subtle | Default card shadow |
| `--shadow-hover` | elevated | Card/button on hover |

---

## 4. Page Sections

The page follows this exact order. Each section uses an `id` that matches the nav `href` anchors.

### 4.1 Header (`<header class="site-header">`)

- `position: sticky; top: 0; z-index: 100`
- Contains: `.site-logo` (SVG wordmark) + `.site-nav` (desktop nav, hidden below 1024px) + `.hamburger` button (visible below 1024px)
- The `.site-logo` **starts at `opacity: 0`** — it is revealed by the hero logo scroll animation in JS. Do not remove that CSS rule.
- Nav links use `href="#section-id"` anchors.
- The "Contato" link uses class `.nav-link--cta` for teal CTA styling.

### 4.2 Mobile Nav Overlay (`<div class="mobile-nav">`)

- `position: fixed`, covers viewport below the header (`inset: var(--header-height) 0 0 0`)
- Toggled by adding `nav-open` class to `<body>` via JS
- Hidden on desktop (≥1024px) via `display: none !important`
- Has focus trap and Escape key handling in JS

### 4.3 Hero (`<section class="hero" id="hero">`)

- Dark navy background (`--color-primary`)
- `min-height: calc(100svh - var(--header-height))`
- Contains `.hero-logo` (the large logo — see §6.1), `.eyebrow`, `h1.hero-heading`, `p.hero-subtext`, `.hero-actions` (two buttons), and two animated SVG blobs
- The `.hero-inner` is a flex column with `gap: var(--space-lg)`

### 4.4 About (`<section class="about" id="about">`)

- White background
- `.about-inner` grid with `.about-content` (text column) and a decorative blob
- Contains `h2`, two paragraphs of `.about-text`

### 4.5 Services (`<section class="services" id="services">`)

- Surface background (`--color-surface`)
- `.services-grid`: 1 col mobile → 2 col tablet → 3 col desktop
- Each `.service-card` contains: `.service-icon` (SVG in teal bubble), `h3.service-title`, `p.service-description`
- Cards get a teal border + elevated shadow on hover

### 4.6 Custom / Palette Switcher (`<section class="custom" id="custom">`)

- Soft surface background (`--color-surface-soft`)
- Demonstrates brand customizability with live palette swapping
- `.palette-switcher` contains 5 `.palette-btn` elements (data-palette="0..4")
- See §6.2 for how the palette system works

### 4.7 Process (`<section class="process" id="process">`)

- Surface background
- `<ol class="process-steps">`: 1 col → 2 col → 4 col grid
- Each `.process-step` contains `.process-number` (01–04 in teal circle) + `.process-content` (title + description)
- On desktop, steps are `flex-direction: column`

### 4.8 Why LUi (`<section class="why" id="why">`)

- Navy background (`--color-primary`) — dark section
- `.why-grid`: 1 col → 2 col → 3 col
- Each `.why-item` has `.why-icon` (SVG in semi-transparent teal bubble) + `h3.why-title` + `p.why-description`
- Text colors use `--color-white` and `rgba(255,255,255,0.65)`
- Uses `.section-tag--light` and `.section-heading--light` variants

### 4.9 FAQ (`<section class="faq" id="faq">`)

- Soft surface background
- `<dl class="faq-list">` → each `.faq-item` contains `<dt>` with `.faq-question` button + `<dd class="faq-answer" hidden>`
- Accordion JS: one item open at a time. Uses `aria-expanded` + `hidden` attribute
- `.faq-chevron` SVG rotates 180° when open
- FAQ IDs: `faq-a1` through `faq-a6`
- To add an FAQ: copy any `.faq-item`, increment the ID (`faq-a7`), update `aria-controls`, add matching structured data in `<head>`

### 4.10 Contact (`<section class="contact" id="contact">`)

- White background
- `.contact-inner` max-width 680px
- `.contact-form`: name, email, message fields + submit button
- `.contact-alternatives`: email link + WhatsApp link
- **The form has no backend integration.** `action="#"`, no JS form handling. To wire it up, add a `submit` event listener in `main.js` or point `action` to a form service (e.g., Formspree).
- Contact details: `luitecnologia@gmail.com` | WhatsApp `+55 98 99109-2411`

### 4.11 Footer (`<footer class="site-footer">`)

- Navy background
- `.footer-inner` flex row on tablet+, column on mobile
- Left: `.footer-brand` (small logo SVG + `.footer-address`)
- Right: `.footer-meta` (copyright + LGPD privacy link)
- The "Política de Privacidade" link (`#privacy-trigger`) opens the privacy modal

### 4.12 Privacy Policy Modal (`#privacy-modal`)

- `position: fixed`, full viewport, `z-index: 1000`
- Opened/closed by JS; adds `.modal-open` class + manages `aria-hidden`
- Has focus trap and Escape key handler
- Close targets: `.modal-close` (×), `.modal-close-btn` ("Entendi"), and backdrop click
- Full LGPD-compliant privacy policy text inside `.modal-body`

### 4.13 Scroll-to-Top Button (`#scroll-top`)

- `position: fixed; bottom: 24px; right: 24px; z-index: 900`
- Appears (`hidden` removed, `.visible` added) after scrollY > 400px
- `hidden` attribute used as initial state — JS removes it on first trigger

---

## 5. CSS Conventions

### File Organization

`style.css` is divided into sections with this header pattern:
```css
/* =============================================================
   SECTION NAME
   ============================================================= */
```

Sections in order: CSS Custom Properties → Reset & Base → Layout Utilities → Typography → Buttons → Header → Hero → Blobs → About → Services → Custom/Palette Switcher → Why LUi → Contact → Footer → Responsive (640px) → Responsive (1024px) → Reduced Motion → Process → FAQ → Privacy Modal → Scroll-to-Top.

### Responsive Breakpoints

| Breakpoint | Width | Key changes |
|---|---|---|
| Mobile (default) | < 640px | Single-column layouts, hamburger menu |
| Tablet | ≥ 640px | 2-col grids, footer row layout |
| Desktop | ≥ 1024px | 3–4-col grids, desktop nav visible, hamburger hidden |

### Class Naming

- BEM-like: block (`service-card`), element (`service-card__title` → actually flat `service-title`), modifier (`section-tag--light`)
- JS hooks use `js-` prefix where applicable (e.g., `.js-blob`)
- State classes: `.nav-open` (on `<body>`), `.modal-open` (on modal), `.visible` (scroll-top), `.palette-btn--active`

### Key Utility Classes

| Class | Purpose |
|---|---|
| `.container` | Centered max-width wrapper (max 1200px, 24px side padding) |
| `.section-tag` | Small uppercase label above section headings (teal on light) |
| `.section-tag--light` | Section tag variant for dark backgrounds |
| `.section-heading` | `h2` style for sections (dark ink) |
| `.section-heading--light` | `h2` variant for dark section backgrounds |
| `.section-header` | Centered wrapper for tag + heading + subtext |
| `.btn` | Base button — requires `.btn-primary` or `.btn-ghost` |
| `.btn-primary` | Teal filled button |
| `.btn-ghost` | Transparent button with white border (for dark backgrounds) |
| `.accent-i` | The lowercase `i` in LUi — teal, `font-style: normal` |
| `.brand-name` | LUi in running text — letter-spacing + `.accent-i` inside |
| `.brand-name--tight` | Compensates trailing letter-spacing before punctuation |

---

## 6. JavaScript Modules

`main.js` has **no imports/exports** — it's a single flat script loaded at the end of `<body>`. All code runs after DOM is ready. Modules are clearly delimited with comments.

### 6.1 Hero Logo Scroll Animation

**Purpose:** The large `.hero-logo` in the hero section cross-fades into the small `.site-logo` in the header as the user scrolls.

**How it works:**
1. On scroll (rAF-throttled), reads `heroLogoEl.getBoundingClientRect().bottom`
2. Computes `t` (0 = hero visible, 1 = header visible) based on scroll position:
   - `t = 0` when bottom ≥ `headerHeight + 120` (logo fully in view)
   - `t = 1` when bottom ≤ `headerHeight` (logo behind the header)
   - Linear interpolation in between
3. Sets `opacity` on both elements; manages `pointer-events: none` for the invisible one
4. `syncLogoOpacity()` is called immediately on load (handles deep-links and refresh)
5. For `prefers-reduced-motion`: snaps to 0 or 1 at the midpoint instead of interpolating

**CSS dependency:** `.site-logo { opacity: 0; transition: opacity 0.35s ease; }` — this is intentional, do not remove.

**Logo sizes:**
- `.hero-logo-svg`: `height: 64px; width: auto`
- `.logo-svg` (header): `height: 28px; width: 80px`
- `.logo-svg--sm` (footer): `height: 22px; width: 62px`

### 6.2 Palette Switcher

**Purpose:** Live-swaps CSS custom properties to demonstrate brand customizability.

**Palettes array** (index → name → values):
```js
0 → LUi (default): primary #282743, accent #05ccbb, accentDark #037171
1 → Floresta:       primary #1a3326, accent #34d399, accentDark #047857
2 → Crepúsculo:     primary #2d1b4e, accent #a78bfa, accentDark #6d28d9
3 → Âmbar:          primary #3d2200, accent #fbbf24, accentDark #b45309
4 → Oceano:         primary #0d1f3c, accent #38bdf8, accentDark #0369a1
```

**What `applyPalette(index)` does:**
- Sets `--color-primary`, `--color-ink`, `--color-accent`, `--color-accent-dark` on `:root`
- Updates `fill` attribute on all `.logo-svg tspan` and `.hero-logo-svg tspan` elements
- Toggles `.palette-btn--active` and `aria-pressed` on palette buttons

**To add a palette:** Add an entry to the `PALETTES` array, add a corresponding `.palette-btn` in HTML.

### 6.3 Blob Animator

**Purpose:** Generates organic morphing SVG blobs in the background of multiple sections using Catmull-Rom splines.

**Class:** `BlobAnimator(pathEl, opts)` — animates a single `<path>` element via `requestAnimationFrame`.

**Options:** `points` (vertices), `radius` (base size), `cx/cy` (center), `speed`, `variance` (how organic)

**Initialization:** Reads all `.js-blob` path elements in DOM order and matches them to `BLOB_CONFIGS` array (7 configs in order: hero-main, hero-secondary, about, services, why-main, why-secondary, contact).

**Reduced motion:** If `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, blobs are NOT initialized — they stay as empty paths.

**To add a blob to a new section:**
1. Add `<svg class="blob blob--{name}"><path class="js-blob" fill="rgba(...)"/></svg>` in the section HTML
2. Add a config object to `BLOB_CONFIGS`
3. Style `.blob--{name}` with `position: absolute`, size, and offsets in CSS
4. Add the section to the `position: relative; overflow: hidden` rule group

### 6.4 Mobile Navigation

- `openNav()`: adds `.nav-open` to `<body>`, updates `aria-expanded`, sets focus to first nav link
- `closeNav()`: reverses above, returns focus to hamburger button
- Triggers: hamburger click, mobile nav link click, Escape key
- Focus trap: Tab cycles only within the mobile nav when open

### 6.5 FAQ Accordion

- Collapse-all-then-open pattern: click toggles the clicked item, all others always collapse
- Uses `aria-expanded` on `<button>` + `hidden` attribute on `<dd>`
- The chevron rotates via CSS on `[aria-expanded="true"] .faq-chevron`

### 6.6 Scroll-to-Top

- Shows/hides `#scroll-top` based on `window.scrollY > 400`
- Uses `.visible` class for CSS transition; `hidden` attribute for initial state
- Click: `window.scrollTo({ top: 0, behavior: 'smooth' })`

### 6.7 Privacy Policy Modal

- `openPrivacyModal()` / `closePrivacyModal()`: toggle `.modal-open` class + `aria-hidden` + `body.overflow`
- Triggers: `#privacy-trigger` link (footer), `#privacy-modal-close` (×), `#privacy-modal-close-btn` ("Entendi"), backdrop click
- Focus trap for Tab key; Escape closes

---

## 7. Brand & Logo

### SVG Logo Pattern

The LUi logo is an inline SVG text element used in three places:

```html
<!-- Header (small) -->
<svg class="logo-svg" viewBox="0 0 80 30">
  <text font-family="'Exo 2', sans-serif" font-weight="700" font-size="26"
        fill="#ffffff" letter-spacing="4" x="1" y="22">
    LU<tspan fill="#05ccbb">i</tspan>
  </text>
</svg>

<!-- Hero (large) -->
<svg class="hero-logo-svg" viewBox="0 0 80 30">
  <!-- same text element, different CSS height -->
</svg>

<!-- Footer (extra small) -->
<svg class="logo-svg logo-svg--sm" viewBox="0 0 80 30">
  <!-- same text element -->
</svg>
```

The `viewBox="0 0 80 30"` is the same for all instances — sizing is controlled entirely by CSS `height`.

**The teal `i`:** The `<tspan fill="#05ccbb">i</tspan>` inside the SVG is the logo's accent. When the palette switcher runs, it updates this `fill` attribute via JS to match the current accent color.

### `.accent-i` Class

Used in **running text** (not SVG) whenever writing "LUi":

```html
<span class="brand-name">LU<span class="accent-i">i</span></span>
```

- On light backgrounds: uses `--color-accent-dark` (#037171)
- On dark backgrounds (header, mobile nav, why section, footer): uses `--color-accent` (#05ccbb)
- The dark/light variants are applied via contextual selectors in CSS (`.site-header .accent-i`, `.why .accent-i`, etc.)

---

## 8. SEO & Structured Data

### Meta Tags

In `<head>`: primary SEO (title, description, robots, canonical), geo/local SEO (geo.region, geo.placename), theme-color, Open Graph (og:*), Twitter Card (twitter:*).

### Structured Data (`<script type="application/ld+json">`)

Two JSON-LD blocks:
1. **Organization + LocalBusiness** — includes name, URL, logo, description, areaServed (São Luís + São Paulo), contactPoint, and hasOfferCatalog
2. **FAQPage** — mirrors the 6 FAQ items on the page. **Keep these in sync when editing FAQ content.**

### Sitemap & Robots

`sitemap.xml` lists the homepage. `robots.txt` allows all crawlers. Update `sitemap.xml` lastmod date when making significant content changes.

---

## 9. Deployment

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

**Trigger:** Push to `main` branch, or manual via `workflow_dispatch`.

**Build job:**
1. Checkout code
2. Stage site files into `_site/` (copies `index.html`, favicons, `manifest.json`, `robots.txt`, `sitemap.xml`, and `assets/`)
3. Configure GitHub Pages
4. Upload `_site/` as a Pages artifact

**Deploy job:** Deploys the artifact to GitHub Pages with a **3-attempt retry** (20s wait between attempt 1→2, 30s wait between attempt 2→3) to handle transient Pages API failures.

**Permissions required:** `contents: read`, `pages: write`, `id-token: write`

**Concurrency:** Only one deployment runs at a time (`group: pages`, `cancel-in-progress: false`).

> If you need to add more files to the site, update the `cp` command in the "Stage site files" step.

---

## 10. Accessibility Conventions

Always follow these rules when modifying or adding content:

1. **All interactive elements** must have a visible `:focus-visible` style (teal ring: `box-shadow: 0 0 0 3px rgba(5, 204, 187, 0.4)`). Never use `outline: none` without a custom focus indicator.

2. **Decorative SVGs** use `aria-hidden="true" focusable="false"`. Informational SVGs use `role="img"` and `<title>` or `aria-label`.

3. **Every section** has an `id` and `aria-labelledby` pointing to its `h2` (e.g., `aria-labelledby="services-heading"`).

4. **Buttons** must have explicit `aria-label` if they contain only icons (hamburger, modal close, scroll-top).

5. **Modals/overlays** must manage `aria-hidden` on the dialog, lock body scroll, and implement a focus trap.

6. **`prefers-reduced-motion`:** Blob animations are skipped entirely. Logo cross-fade snaps instead of interpolating. CSS handles the rest via:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
   }
   ```

7. **Minimum touch target:** All interactive elements must be at least `44px × 44px`. Use `min-height: 44px` on buttons and inputs.

8. **Color contrast:** Light bg text must use `--color-accent-dark` (not `--color-accent`). Dark bg text uses `--color-white` or `rgba(255,255,255,0.65+)`.

---

## 11. Common Tasks — Cheatsheet

### Change a color sitewide
Edit the corresponding CSS custom property in `:root` in `style.css`. For brand color changes, also update:
- Inline `fill` in all three SVG logo instances in `index.html`
- The `PALETTES[0]` entry in `main.js`
- `theme-color` meta tag in `<head>`
- `background_color` / `theme_color` in `manifest.json`

### Add a new FAQ item
1. Copy any `.faq-item` block in the `#faq` section
2. Increment the ID: `faq-a7`, update `aria-controls="faq-a7"` on the button and `id="faq-a7"` on the `<dd>`
3. Update the question text in `<button>` and answer in `<p>`
4. Add a matching `{ "@type": "Question", ... }` entry to the FAQPage JSON-LD in `<head>`

### Add a new service card
Copy any `<li class="service-card">` inside `.services-grid`, update the SVG icon, `h3.service-title`, and `p.service-description`. The grid handles layout automatically.

### Add a new process step
Copy any `<li class="process-step">`, update `.process-number` (05, 06…), `.process-title`, `.process-description`. The grid handles layout.

### Update contact information
Occurrences of contact details (search for these strings):
- Email: `luitecnologia@gmail.com` — appears in `<head>` JSON-LD, footer address, contact section, privacy modal
- Phone/WhatsApp: `5598991092411` — appears in `<head>` JSON-LD, contact section, privacy modal, footer

### Add a new palette
1. Add an entry to `PALETTES` in `main.js` (primary, accent, accentDark)
2. Add a `.palette-btn` in the `.palette-switcher` in HTML with `data-palette="N"`, a swatch color, and a name

### Change the hero logo size
Edit `.hero-logo-svg { height: ... }` in `style.css`. The SVG uses `width: auto` so it scales proportionally from `viewBox="0 0 80 30"`.

### Add a new page section with a blob
1. Add the section HTML with `aria-labelledby`
2. Add an `<svg class="blob blob--{name}"><path class="js-blob" fill="rgba(...)"/></svg>` inside it
3. Add the section to the `position: relative; overflow: hidden` CSS rule group
4. Add a `.blob--{name}` CSS rule with position, size, and filter
5. Add a config object to `BLOB_CONFIGS` in `main.js` (must match DOM order of `.js-blob` elements)

### Deploy manually
In the GitHub repo → Actions tab → "Deploy to GitHub Pages" → "Run workflow" → select `main` → Run.

---

## 12. Rules — Always / Never

### Always
- Use CSS custom properties for colors, spacing, and radii — never hardcode values
- Write HTML in Portuguese (pt-BR) for all visible text
- Include `aria-*` attributes on all interactive elements and sections
- Keep the FAQ structured data in `<head>` in sync with the FAQ HTML
- After any significant content change, update `sitemap.xml` lastmod date
- Test at mobile (375px), tablet (768px), and desktop (1280px) widths
- Respect the `prefers-reduced-motion` media query — never add animations without this guard

### Never
- Do not add JavaScript frameworks, npm packages, or a build step — this is intentionally dependency-free
- Do not use `--color-accent` (#05ccbb) as text/icon color on white or light backgrounds (fails contrast)
- Do not remove `opacity: 0` from `.site-logo` — it is the initial state for the scroll animation
- Do not add Google Fonts `<link>` tags — fonts are self-hosted in `assets/fonts/`
- Do not add inline styles except where driven by JavaScript (e.g., opacity in scroll animation)
- Do not break the blob DOM order — `BLOB_CONFIGS` in JS depends on the document order of `.js-blob` elements
- Do not add new files to the repo root without also adding them to the `cp` command in `deploy.yml`
