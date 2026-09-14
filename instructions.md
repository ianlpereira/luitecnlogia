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
- Single HTML file: `index.html` (≈ 740 lines)
- Single CSS file: `assets/css/style.css` (≈ 2 450 lines)
- Single JS file: `assets/js/main.js` (≈ 595 lines)
- Fonts are self-hosted `.woff2` in `assets/fonts/` — no external requests of any kind
- Deployed via GitHub Actions → GitHub Pages
- Supports light **and** dark themes, plus a 5-palette brand switcher — the two compose (see §3)
- No backend. The contact form validates client-side and composes a `mailto:` draft.

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
│   ├── fonts/                  # Self-hosted woff2 (Exo 2 + Montserrat, latin & latin-ext)
│   └── images/
│       ├── logo.svg            # Referenced only from JSON-LD, not rendered
│       └── og-image.png        # 1200×630 Open Graph share image
├── docs/
│   └── LUI_FRONTEND_GUIDELINES.md  # Brand/design system spec
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Actions CI/CD pipeline
```

---

## 3. Design System (CSS Custom Properties)

All design tokens live at the top of `style.css`. **Always use these variables — never hardcode values.**

The tokens are split into **two layers**, and which layer you touch matters:

- **Layer A — brand primitives.** Owned by the palette switcher. Declared as
  `:root[data-palette="0".."4"]` blocks. Only three variables: `--brand-navy`,
  `--brand-accent`, `--brand-accent-dark`.
- **Layer B — semantic tokens.** Owned by the theme. Everything else. Declared once
  for light on `:root`, then remapped for dark under both
  `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` and
  `:root[data-theme="dark"]`.

> **Why the split:** the palette switcher used to write inline custom properties onto
> `document.documentElement`. Inline styles beat any `@media (prefers-color-scheme: dark)`
> rule, so a dark theme would be silently destroyed the moment a visitor touched a swatch.
> Writing `data-palette` instead lets palette and theme compose. **Never go back to
> `root.style.setProperty()` for colors.**

### Colors

| Variable | Light | Dark | Usage |
|---|---|---|---|
| `--brand-navy` | `#282743` | same | Brand primitive. Every surface is derived from it. |
| `--brand-accent` | `#05ccbb` | same | Brand primitive. The single action color. |
| `--brand-accent-dark` | `#037171` | same | Brand primitive. Hover/pressed accent. |
| `--color-accent-ink` | `--brand-accent-dark` | `--brand-accent` | **Accent used as text/icon.** Resolves to the contrast-safe variant automatically. |
| `--color-canvas` | `#f7faff` | navy mixed 74% toward black | Page floor |
| `--color-surface` | `#f7faff` | navy mixed 80% toward black | Default section band |
| `--color-surface-soft` | `#f0f3f8` | navy mixed 88% toward black | Alternate section band (custom, FAQ) |
| `--color-elevated` | `#ffffff` | navy mixed 96% toward white | Cards, dialogs, raised surfaces |
| `--color-band` | `--brand-navy` | `--brand-navy` | Dark editorial bands (header, hero, why, footer) |
| `--color-on-band` | `#ffffff` | `#f7faff` | Text on a band |
| `--color-ink` | `--brand-navy` | `#f7faff` | Default body text |
| `--color-muted` | `#6b7280` | ghost white @ 64% | Secondary text |
| `--color-muted-soft` | `#9ca3af` | ghost white @ 44% | Tertiary / placeholder |
| `--color-hairline` | `#d9dce3` | ghost white @ 14% | Borders on cards and inputs |
| `--color-hairline-soft` | `#e8ebf0` | ghost white @ 8% | Lighter dividers |
| `--color-white` | `#ffffff` | `#ffffff` | Literal white — logo SVGs only, never a surface |
| `--color-error` | `#dc2626` | same | Form error states |
| `--color-success` | `#047857` | same | Success states (5.48:1 AA) |
| `--color-warning` | `#b45309` | same | Warning states (5.02:1 AA) |

Dark values are produced with `color-mix()` from `--brand-navy` and ghost white. **No new
hue is ever introduced** — that is what keeps all five palettes working in both themes.

> **Accessibility rule:** never hand-pick between `--color-accent` and `--color-accent-dark`
> for text or icons. Use **`--color-accent-ink`** and the token system picks the
> contrast-safe one for the current surface. Hardcoding `--color-accent` as ink on a light
> background fails contrast and will be caught in review.

### `.band` — dark surfaces

Any dark editorial surface gets `class="band"`. That class **re-declares the semantic tokens
for its whole subtree** (`--color-ink` becomes `--color-on-band`, `--color-accent-ink` becomes
the bright accent, hairlines become translucent white). Descendants then need no special
casing. This replaced a hardcoded `.site-header .accent-i, .why .accent-i, …` selector list
that broke every time a new dark section was added.

Currently `.band` is on: `.site-header`, `.mobile-nav`, `.hero`, `.why`, `.site-footer`.
There is no longer a `--light` modifier on `.section-tag` or `.section-heading`; delete any
you find and rely on `.band` instead.

### Typography

| Variable | Fonts | Usage |
|---|---|---|
| `--font-display` | `'Exo 2'`, fallback `'Rajdhani'`, sans-serif | Headings, logo wordmark, process numbers |
| `--font-body` | `'Montserrat'`, fallback `'Inter'`, sans-serif | Body text, labels, nav links |

Fonts are self-hosted in `assets/fonts/` as `.woff2` files (latin + latin-ext subsets). `@font-face` rules are at the top of `style.css`. Do not add Google Fonts links back. The two **latin** files are `<link rel="preload">`ed in `<head>` — the latin-ext subsets are correctly gated out for pt-BR by `unicode-range` and must **not** be preloaded.

**Type scale.** Never write a raw font-size. Use the scale:

| Variable | Value | Typical use |
|---|---|---|
| `--text-2xs` | 11px | Uppercase tags, eyebrow, channel kind labels |
| `--text-xs` | 12px | Footnotes, legal, palette names |
| `--text-sm` | 13px | Form labels |
| `--text-base` | 14px | Button labels, nav links, card body |
| `--text-md` | 16px | Default running text |
| `--text-lg` | 18px | Lead paragraphs, card titles |
| `--text-xl` | fluid 20→22px | Service titles, modal title |
| `--text-2xl` | fluid 22→28px | Mobile nav links, featured card title |
| `--text-3xl` | fluid 28→38px | `.section-heading` |
| `--text-4xl` | fluid 32→48px | — |
| `--text-5xl` | fluid 40→68px | `.hero-heading` |

### Spacing Scale

8px grid with a 4px micro-step.

| Variable | Value | Notes |
|---|---|---|
| `--space-xs` | 4px | |
| `--space-sm` | 8px | |
| `--space-md` | 16px | |
| `--space-lg` | 24px | |
| `--space-xl` | 32px | |
| `--space-2xl` | 48px | |
| `--space-3xl` | 64px | |
| `--space-4xl` | 96px | |
| `--space-5xl` | 128px | |
| `--section-pad` | fluid 64→128px | Vertical padding of every `.section` |

### Other Tokens

| Variable | Value | Notes |
|---|---|---|
| `--header-height` | `68px` | Sticky header height. Used in hero min-height, mobile nav offset, `scroll-margin-top`, and read in JS. Do not change without checking JS. |
| `--container-max` | `1280px` | Max width of `.container` |
| `--gutter` | `24px` (16px < 380px, 48px ≥ 1280px) | `.container` side padding |
| `--measure-narrow` | `560px` | `.section-subtext` |
| `--measure-prose` | `680px` | Contact column, modal |
| `--measure-wide` | `760px` | FAQ list |
| `--radius-sm` | `6px` | Buttons, inputs |
| `--radius-md` | `12px` | Small cards, FAQ items |
| `--radius-lg` | `20px` | Large cards, modal |
| `--radius-pill` | `999px` | Tags, chips, swatches only |
| `--shadow-card` / `--shadow-hover` / `--shadow-modal` | theme-aware | The only three elevation tiers. Shadows deepen in dark mode. |
| `--ring` / `--ring-soft` | teal @ 40% / 18% | **The focus ring.** Derived from `--brand-accent`, so it follows the palette. Never hardcode `rgba(5,204,187,0.4)` again. |
| `--dur-fast` / `--dur-base` / `--dur-slow` | 0.15s / 0.2s / 0.35s | The only durations. Nothing exceeds 0.4s. |
| `--ease-out` / `--ease-spring` | cubic-beziers | Standard and overshoot easing |
| `--z-nav` / `--z-header` / `--z-fab` / `--z-modal` | 99 / 100 / 900 / 1000 | Stacking scale — no magic numbers |

---

## 4. Page Sections

The page follows this exact order. Each section uses an `id` that matches the nav `href` anchors.

### 4.1 Header (`<header class="site-header">`)

- `position: sticky; top: 0; z-index: 100`
- Carries `class="band"` (see §3) — it is a dark surface
- Glass background (`color-mix` navy + `backdrop-filter`) behind an `@supports` guard; solid navy fallback
- Gains `.is-scrolled` past 8px of scroll — deepens the hairline and adds a shadow. Height stays 68px on purpose: the hero-logo cross-fade math depends on it.
- Contains: `.site-logo` (SVG wordmark) + `.site-nav` + `.header-actions` (theme toggle + hamburger)
- The `.site-logo` starts at `opacity: 0`, but **scoped to `.js .site-logo`** — the `.js` class is stamped on `<html>` by the head script, so a no-JS visitor still sees the logo. Do not un-scope it and do not delete it.
- Nav links use `href="#section-id"` anchors and get `aria-current="true"` from the active-section observer, which drives an animated underline.
- The "Contato" link uses `.nav-link--cta` (pill outline).
- `.nav-link` is `display: inline-block`, **not** `inline-flex` — a flex container drops the whitespace between the "Por que" text node and the `<span>` wordmark.
- A `.skip-link` sits immediately before the header as the first `<body>` child, targeting `#main`.

### 4.2 Mobile Nav Overlay (`<div class="mobile-nav band">`)

- `position: fixed`, covers viewport below the header (`inset: var(--header-height) 0 0 0`)
- Toggled by adding `nav-open` class to `<body>` via JS
- Hidden on desktop (≥1024px) via `display: none !important`
- Links stagger in via `:nth-child` transition delays
- `.mobile-nav-footer` pins the contact CTA to the bottom
- Has focus trap and Escape key handling in JS

### 4.3 Hero (`<section class="hero band" id="hero">`)

- `min-height: calc(100svh - var(--header-height))`
- Two `.ambient` layers (lattice + grain) — see §5 Ambient Layer
- Children in order: `.hero-logo` (§6.1), `.eyebrow` (pill with pulsing dot), `h1.hero-heading`, `p.hero-subtext`, `.hero-actions`, `ul.hero-trust`
- Staggered entrance animation on load. **`.hero-logo` is deliberately excluded** — CSS animations beat inline styles in the cascade and would freeze the JS-driven cross-fade.
- `.hero-scroll-cue` is absolutely positioned at the bottom, shown ≥640px

### 4.4 About (`<section class="about section" id="about">`)

- Elevated background (`--color-elevated`)
- `.about-inner` is a two-column grid ≥900px: `.about-heading-col` (sticky) + `.about-content`
- Sticky only works because `.section` has **no** `overflow: hidden` — do not add it
- Two `.about-text` paragraphs; the first carries `.about-text--lead`

### 4.5 Services (`<section class="services section" id="services">`)

- Surface background (`--color-surface`)
- `.services-grid`: 1 col mobile → 2 col tablet → **bento `1.4fr 1fr 1fr`** at desktop
- First card is `.service-card--featured` and grows its title via a container query
- Each `.service-card` contains `.service-icon`, `h3.service-title`, `p.service-description`
- Hover: lift + accent border + a pointer-tracking spotlight driven by `--spot-x` / `--spot-y`
- Icons use `--color-accent-ink`, never the raw bright accent

### 4.6 Custom / Palette Switcher (`<section class="custom section" id="custom">`)

- Soft surface background (`--color-surface-soft`)
- `.palette-switcher` contains 5 `.palette-btn` elements (`data-palette="0..4"`); the active one shows a checkmark via `.palette-swatch::after`
- `.palette-preview` is a live preview card that re-tints with the palette
- See §6.2 for how the palette system works

### 4.7 Process (`<section class="process section" id="process">`)

- Surface background
- `<ol class="process-steps">`: 1 col → 2 col → 4 col grid
- Each `.process-step` has `.process-number` (01–04, outlined circle) + `.process-content`
- A timeline rail is drawn by `.process-steps::before` — **vertical** below 640px (aligned to the number centres at `left: 51px`), hidden at 640–1023px, **horizontal** at ≥1024px where it fills on scroll via `animation-timeline: view()` behind an `@supports` guard

### 4.8 Why LUi (`<section class="why section band" id="why">`)

- Dark band — colors come from `.band`, not from per-element overrides
- `.why-grid`: 1 col → 2 col → 3 col
- Each `.why-item` is a bordered card with `.why-icon` + `h3.why-title` + `p.why-description`

### 4.9 FAQ (`<section class="faq section" id="faq">`)

- Soft surface background
- `<dl class="faq-list">` → each `.faq-item` has `<dt>` with `.faq-question` button + `<dd class="faq-answer" hidden>` wrapping a `.faq-answer-inner`
- Accordion JS: one item open at a time, driving `aria-expanded` + the `hidden` attribute
- **The CSS overrides `[hidden]`'s `display: none`** so the panel can animate `grid-template-rows: 0fr → 1fr`, and uses `visibility: hidden` instead to keep it out of the accessibility tree and out of tab order. The `.faq-answer-inner` wrapper is what makes the row collapse work — don't remove it.
- FAQ IDs: `faq-a1` through `faq-a6`
- To add an FAQ: copy any `.faq-item`, increment the ID (`faq-a7`), update `aria-controls`, add matching structured data in `<head>`

### 4.10 Contact (`<section class="contact section" id="contact">`)

- Elevated background
- `.contact-inner` max-width `--measure-prose`
- `.contact-form` is a card: name, email, message fields + submit + `.form-status` live region. Each field has a `.form-error` wired via `aria-describedby`.
- `.contact-alternatives`: two `.contact-channel` cards (e-mail, WhatsApp)
- **There is still no backend.** `action="#"` is kept as a no-op; JS intercepts `submit`, validates, and composes a `mailto:` draft. To wire a real backend, replace the `mailto:` branch in the submit handler (or point `action` at a service like Formspree and drop the handler).
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

**Sections follow DOM order.** In order: Self-hosted Fonts → Tokens Layer A (palettes) →
Tokens Layer B (light) → Tokens (dark) → Reset & Base → Accessibility Utilities → Layout
Utilities (incl. `.band`) → Ambient Layer → Typography → Scroll Reveal → Buttons → Header →
Mobile Nav → Hero → About → Services → Custom/Palette → Process → Why LUi → FAQ → Contact →
Footer → Privacy Modal → Scroll-to-Top → Responsive ≥640 → ≥900 → ≥1024 → ≥1280 → Coarse
Pointers → Reduced Motion.

Keep it **one stylesheet**. `assets/**` is copied wholesale by the deploy workflow so a split
would ship fine, but with no build step each extra file is another render-blocking request.

### Ambient Layer

The old `BlobAnimator` (7 always-on `requestAnimationFrame` loops morphing blurred SVG paths)
is **gone**. Depth now comes from `<div class="ambient">` — a pure-CSS, zero-runtime layer:

- `.ambient::before` paints two aurora radial-gradients, positioned per section with
  `--aurora-x` / `--aurora-y` / `--aurora-size` (and the `-2` variants) set inline on the section.
- `.ambient--lattice` adds a masked 1px grid — dark bands only.
- `.ambient--grain` adds an `feTurbulence` data-URI noise, hero only.

The `.ambient` element clips itself (`overflow: hidden`), which is why `.section` must not.

### Responsive Breakpoints

| Breakpoint | Width | Key changes |
|---|---|---|
| Mobile (default) | < 640px | Single-column layouts, hamburger menu, vertical process rail |
| Tablet | ≥ 640px | 2-col grids, 3-col footer, contact channels side by side, scroll cue |
| — | ≥ 900px | About becomes a two-column split with a sticky heading |
| Desktop | ≥ 1024px | Desktop nav, services bento, 4-col process + horizontal rail |
| Wide | ≥ 1280px | Wider `--gutter` (48px) |

Also: `@media (max-width: 380px)` tightens the gutter to 16px, and `@media (hover: none)`
disables hover lifts and the spotlight on touch devices.

### Class Naming

- BEM-like: block (`service-card`), flat element (`service-title`), modifier (`service-card--featured`)
- State classes: `.nav-open` (on `<body>`), `.modal-open` (on modal), `.visible` (scroll-top), `.is-scrolled` (header), `.is-visible` (reveal), `.is-theming` (root, during a palette swap), `.palette-btn--active`
- Root attributes: `data-theme` (`light`/`dark`), `data-palette` (`0`–`4`), `.js`

### Key Utility Classes

| Class | Purpose |
|---|---|
| `.container` | Centered max-width wrapper (`--container-max`, `--gutter` side padding) |
| `.section` | Standard page band: relative, isolated, `--section-pad` vertical. **No `overflow`.** |
| `.band` | Dark surface. Re-declares the semantic tokens for its subtree (see §3). |
| `.ambient` | Decorative depth layer; add `--lattice` / `--grain` modifiers |
| `.reveal` | Scroll-reveal target. Optional `--reveal-delay` for stagger. Only armed under `.js`. |
| `.visually-hidden` | Screen-reader-only text |
| `.skip-link` | Keyboard skip link, visible on focus |
| `.section-tag` | Small uppercase label above section headings (auto contrast-safe) |
| `.section-heading` | `h2` style for sections |
| `.section-header` | Centered wrapper for tag + heading + subtext |
| `.btn` | Base button — pair with a tone modifier |
| `.btn-primary` | Accent filled button |
| `.btn-secondary` | Outlined button for **light** surfaces |
| `.btn-ghost` | Outlined button for use inside a `.band` |
| `.btn-icon` | 44×44 round icon button (theme toggle, modal close) |
| `.accent-i` | The lowercase `i` in LUi — uses `--color-accent-ink` |
| `.brand-name` | LUi in running text — letter-spacing + `.accent-i` inside |
| `.brand-name--tight` | Compensates trailing letter-spacing before punctuation |

> Removed: `.section-tag--light`, `.section-heading--light` (superseded by `.band`), and every
> `.blob*` class.

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

**CSS dependency:** `.js .site-logo { opacity: 0 }` — the initial state, scoped so no-JS
visitors still see the logo. Do not remove it and do not un-scope it.

**Cascade warning:** the hero entrance animation is applied to
`.hero-inner > *:not(.hero-logo)`. CSS animations beat inline styles, so animating the logo
would freeze it at `opacity: 1` and kill the cross-fade. Keep the exclusion.

**Logo sizes:**
- `.hero-logo-svg`: `height: 64px; width: auto`
- `.logo-svg` (header): `height: 28px; width: 80px`
- `.logo-svg--sm` (footer): `height: 22px; width: 62px`

### 6.2 Theme Controller

**Purpose:** Light/dark with an explicit user override on top of the OS preference.

- Resolution order: `localStorage['lui-theme']` → `prefers-color-scheme`.
- An **inline blocking script in `<head>`** stamps `data-theme`, `data-palette` and the `.js`
  class on `<html>` before first paint. Without it there is a flash of the wrong theme.
  This is the one sanctioned inline script; it is not an inline *style*.
- `#theme-toggle` flips `data-theme`, persists it, and updates `aria-pressed` + `aria-label`.
- `syncThemeMeta()` keeps `<meta name="theme-color">` matching the painted background. The
  surface tokens are `color-mix()` values that serialize as `oklab(...)`, which browsers do
  not accept in that meta — so the colour is normalised by painting one canvas pixel and
  reading the bytes back. Reading `ctx.fillStyle` is **not** enough; it preserves the colour space.
- All storage access is wrapped in `try/catch` (private mode / blocked cookies).

### 6.3 Palette Switcher

**Purpose:** Live-swaps the brand primitives to demonstrate brand customizability.

**Palettes array** (index → name → values):
```js
0 → LUi (default): primary #282743, accent #05ccbb, accentDark #037171
1 → Floresta:       primary #1a3326, accent #34d399, accentDark #047857
2 → Crepúsculo:     primary #2d1b4e, accent #a78bfa, accentDark #6d28d9
3 → Âmbar:          primary #3d2200, accent #fbbf24, accentDark #b45309
4 → Oceano:         primary #0d1f3c, accent #38bdf8, accentDark #0369a1
```

**What `applyPalette(index)` does:**
- Sets **`data-palette` on `<html>`** — never inline custom properties (see §3)
- Adds `.is-theming` to `<html>` for 400ms so brand-driven surfaces cross-fade
- Updates the `fill` attribute on all `.logo-svg tspan` / `.hero-logo-svg tspan`
- Toggles `.palette-btn--active` and `aria-pressed`
- Persists to `localStorage['lui-palette']` and re-syncs the theme-color meta

Because surfaces are derived from `--brand-navy`, all five palettes now recolour the whole
page (previously only 4 of 13 tokens changed, so non-default palettes looked half-applied).

**To add a palette:** add an entry to `PALETTES` in `main.js`, a matching
`:root[data-palette="N"]` block in `style.css`, and a `.palette-btn` in HTML. All three.

### 6.4 Scroll Reveal & Active Nav

- Two `IntersectionObserver`s. The reveal observer adds `.is-visible` to `.reveal` elements
  and unobserves them; stagger comes from an inline `--reveal-delay`.
- Under `prefers-reduced-motion`, or with no `IntersectionObserver`, everything is revealed
  immediately — content must never be stranded at `opacity: 0`.
- The section observer sets `aria-current="true"` on matching nav links, which CSS turns into
  the animated underline.

### 6.5 Mobile Navigation

- `openNav()`: adds `.nav-open` to `<body>`, updates `aria-expanded`, sets focus to first nav link
- `closeNav()`: reverses above, returns focus to hamburger button
- Triggers: hamburger click, mobile nav link click, Escape key
- Focus trap: Tab cycles only within the mobile nav when open

### 6.6 FAQ Accordion

- Collapse-all-then-open pattern: click toggles the clicked item, all others always collapse
- Uses `aria-expanded` on `<button>` + `hidden` attribute on `<dd>`
- The chevron rotates via CSS on `[aria-expanded="true"] .faq-chevron`
- The JS is unchanged from before the refactor; the animation is entirely in CSS (see §4.9)

### 6.7 Card Spotlight

- One delegated `pointermove` listener sets `--spot-x` / `--spot-y` on the hovered `.service-card`
- Skipped entirely on coarse pointers and under `prefers-reduced-motion`

### 6.8 Contact Form

- Intercepts `submit`, validates name / e-mail / message (min 10 chars)
- Errors go into `.form-error` elements wired via `aria-describedby`, with `aria-invalid` on the input; focus moves to the first invalid field
- Fields re-validate on `blur`, and on `input` only once already marked invalid (no nagging mid-typing)
- On success: composes a `mailto:` draft and writes to the `role="status"` live region
- **No backend.** See §4.10 to wire one up.

### 6.9 Unified Scroll Handler

A single rAF-throttled passive `scroll` listener drives all of:

1. `.is-scrolled` on the header
2. The hero→header logo cross-fade (§6.1)
3. `#scroll-top` visibility
4. The read-progress ring (`--progress` on the SVG bar)

`#scroll-top` is shown past `scrollY > 400` via `.visible`, and the `hidden` attribute is
**restored** once it has faded out — otherwise the invisible button stays in the tab order
(`opacity: 0` + `pointer-events: none` does not remove it). Do not drop that.

### 6.10 Privacy Policy Modal

- `openPrivacyModal()` / `closePrivacyModal()`: toggle `.modal-open` class + `aria-hidden` + `body.overflow`
- Triggers: `#privacy-trigger` link (footer), `#privacy-modal-close` (×), `#privacy-modal-close-btn` ("Entendi"), backdrop click
- Focus trap for Tab key; Escape closes
- `html { scrollbar-gutter: stable }` prevents the layout shift when body scroll is locked

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

- `.accent-i` simply uses `--color-accent-ink`, which already resolves to the contrast-safe
  variant: `--brand-accent-dark` on light surfaces, `--brand-accent` inside a `.band` or in
  dark mode.
- The old contextual selector list (`.site-header .accent-i`, `.why .accent-i`, …) is **gone**.
  Put `class="band"` on any new dark surface and it works automatically.

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

1. **All interactive elements** must have a visible `:focus-visible` style: `box-shadow: var(--ring)`. Never use `outline: none` without a custom focus indicator, and never hardcode the ring colour — `--ring` is derived from the active palette.

2. **Decorative SVGs** use `aria-hidden="true" focusable="false"`. Informational SVGs use `role="img"` and `<title>` or `aria-label`.

3. **Every section** has an `id` and `aria-labelledby` pointing to its `h2` (e.g., `aria-labelledby="services-heading"`).

4. **Buttons** must have explicit `aria-label` if they contain only icons (hamburger, modal close, scroll-top).

5. **Modals/overlays** must manage `aria-hidden` on the dialog, lock body scroll, and implement a focus trap.

6. **`prefers-reduced-motion`:** Scroll reveals resolve immediately, the hero entrance and the timeline rail are inert, the card spotlight is disabled, and the logo cross-fade snaps instead of interpolating. CSS handles the rest via a global kill-switch that **also** force-resets `.reveal` / `.hero-inner > *` to `opacity: 1` — the classic scroll-reveal failure is content stranded invisible. Any new reveal animation must be added to that reset.

7. **No-JS:** the page must stay readable with JavaScript disabled. Anything that starts hidden and is revealed by script must be scoped under the `.js` class (as `.site-logo` and `.reveal` are).

8. **Hidden-but-focusable:** an element hidden only with `opacity: 0` / `pointer-events: none` is still a tab stop. Use the `hidden` attribute, `visibility: hidden`, or `inert` (see `#scroll-top` and `.faq-answer`).

9. **Minimum touch target:** All interactive elements must be at least `44px × 44px`. Use `min-height: 44px` on buttons and inputs.

10. **Color contrast:** never hand-pick an accent for text. Use `--color-accent-ink`; on a dark band use `--color-ink` / `--color-muted`, which `.band` has already remapped.

---

## 11. Common Tasks — Cheatsheet

### Change a color sitewide
For a **brand** color, edit the `:root, :root[data-palette="0"]` block in `style.css`, then also update:
- Inline `fill` in all three SVG logo instances in `index.html`
- The `PALETTES[0]` entry in `main.js`
- `theme-color` meta tag in `<head>` (the light-mode default; JS overwrites it at runtime)
- `background_color` / `theme_color` in `manifest.json`

For a **semantic** color (a surface, hairline, muted text), edit the Layer B block — and
remember to edit **both** dark blocks (`@media (prefers-color-scheme: dark)` and
`:root[data-theme="dark"]`), which are intentionally duplicated so the manual toggle can win
in both directions.

### Add a new FAQ item
1. Copy any `.faq-item` block in the `#faq` section
2. Increment the ID: `faq-a7`, update `aria-controls="faq-a7"` on the button and `id="faq-a7"` on the `<dd>`
3. Update the question text in `<button>` and answer in `<p>` — keep the `.faq-answer-inner` wrapper
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
2. Add a matching `:root[data-palette="N"]` block in `style.css` with the three `--brand-*` values
3. Add a `.palette-btn` in the `.palette-switcher` in HTML with `data-palette="N"`, a swatch color, and a name

All three are required — the JS array alone no longer drives the colors.

### Change the hero logo size
Edit `.hero-logo-svg { height: ... }` in `style.css`. The SVG uses `width: auto` so it scales proportionally from `viewBox="0 0 80 30"`.

### Add a new page section
1. Add `<section class="{name} section" id="{name}" aria-labelledby="{name}-heading">` — add `band` too if it is a dark surface
2. Inside it, add `<div class="ambient" aria-hidden="true"></div>` and set the aurora position with inline `--aurora-*` custom properties on the section (this is the one sanctioned use of inline styles, since the values are per-instance layout data)
3. Add `.reveal` to the blocks that should animate in, with an optional `--reveal-delay` for stagger
4. Add a nav link in **both** `.nav-list` and `.mobile-nav-list` — the active-section observer picks it up automatically
5. Style it in `style.css` in DOM order

### Add a scroll-reveal animation
Add `class="reveal"` and, for stagger, `style="--reveal-delay:80ms"`. If you write a *custom*
entrance animation instead, you must add it to the `prefers-reduced-motion` reset block or it
will strand content at `opacity: 0`.

### Deploy manually
In the GitHub repo → Actions tab → "Deploy to GitHub Pages" → "Run workflow" → select `main` → Run.

---

## 12. Rules — Always / Never

### Always
- Use CSS custom properties for colors, spacing, radii, durations and z-index — never hardcode values
- Use the type scale (`--text-*`); never write a raw `font-size`
- Use `--color-accent-ink` for accent text/icons, and `var(--ring)` for focus rings
- Write HTML in Portuguese (pt-BR) for all visible text
- Include `aria-*` attributes on all interactive elements and sections
- Keep the FAQ structured data in `<head>` in sync with the FAQ HTML
- After any significant content change, update `sitemap.xml` lastmod date
- Test at 320, 375, 768, 1024, 1280px — **in both themes**, and across all five palettes
- Respect the `prefers-reduced-motion` media query — never add animations without this guard, and always add new entrance animations to its reset block
- Check the page still works with JavaScript disabled

### Never
- Do not add JavaScript frameworks, npm packages, or a build step — this is intentionally dependency-free
- Do not use the bright accent as text/icon color on a light surface — use `--color-accent-ink`
- Do not write colors via `root.style.setProperty()` — inline custom properties on `<html>` out-specify the dark theme and will silently break it. The palette uses `data-palette`.
- Do not remove or un-scope `.js .site-logo { opacity: 0 }` — it is the initial state for the scroll animation, and the `.js` scope is what keeps the no-JS case working
- Do not animate `.hero-logo` — CSS animations beat the inline opacity the cross-fade sets
- Do not add `overflow: hidden` to `.section` — it breaks the sticky About heading. `.ambient` clips itself.
- Do not add Google Fonts `<link>` tags — fonts are self-hosted in `assets/fonts/`
- Do not add inline styles except per-instance layout data (the `--aurora-*` and `--reveal-delay` custom properties) or values driven by JavaScript
- Do not hide an interactive element with `opacity: 0` alone — it stays in the tab order
- Do not add new files to the repo root without also adding them to the `cp` command in `deploy.yml` (files under `assets/` are copied wholesale and need no change)
