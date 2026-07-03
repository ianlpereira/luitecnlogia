# LUi — Frontend Design Guidelines

## Overview

LUi is a technology company whose brand is built on the premise of **"Tecnologia construída por pessoas"** — technology built by people. Every interface must reflect that human-centred commitment: purposeful, clear, and durable. The base canvas is a near-white ice blue (`{colors.surface}` — #f7faff) with deep navy (`{colors.primary}` — #282743) carrying all primary text and structural framing, and a single teal voltage (`{colors.accent}` — #009f93) driving every primary CTA, active indicator, focus ring, and interactive highlight. The darker teal (`{colors.accent-dark}` — #037171) is reserved strictly for hover and pressed states on accent elements — it never appears independently.

Type runs **Exo 2** for all display and heading contexts, and **Montserrat** for all body, UI, and form copy. The split is hard — never blend the two at the same hierarchy tier. Montserrat's semi-bold at 600 carries the majority of UI labels and navigation; Exo 2's weight 700 is reserved for headings and the brand wordmark.

The shape language is **soft but grounded**. Buttons and inputs sit at 6–8px radius. Cards use 12px radius. Fully rounded elements (pills, badges) are reserved for tags and status chips only — the system avoids decorative pill shapes on structural components. There are no hard 0px corners anywhere on interactive surfaces.

**Key Characteristics:**
- Two-color accent system: `{colors.accent}` (#009f93) as the primary action color; `{colors.accent-dark}` (#037171) as the pressed/hover state. Used with restraint — most pages are 90% navy + ghost-white with one teal moment per interactive section.
- Two-typeface system: **Exo 2** (display, headings, wordmark) and **Montserrat** (everything else). No third typeface is permitted under any circumstance.
- 8px base spacing grid. All tokens are multiples of 8, with a 4px micro-step for icon gaps and dense list rows.
- One shadow tier: cards and modals share the same shadow definition — the system never stacks elevation tiers.
- Mobile-first responsive layout. The minimum supported viewport is 320px; content caps at 1280px on desktop.

---

## Colors

### Brand & Accent
- **Teal** (`{colors.accent}` — #009f93): The single action color. Used on primary CTA backgrounds, active nav indicators, focus rings, links, and interactive icon fills. The most recognizable color in every LUi interface.
- **Dark Teal** (`{colors.accent-dark}` — #037171): The hover and pressed variant of the accent. Applied on `{component.button-primary-hover}` and `{component.button-primary-active}`. Never used as a standalone fill or for any purpose other than accent state transitions.
- **Teal Disabled** (`{colors.accent-disabled}` — #009f93 at 40% opacity): Used on disabled primary CTAs to preserve brand color while communicating unavailability.

### Surface
- **Deep Navy** (`{colors.primary}` — #282743): The primary structural color. Used as the app header background, dark section fills, hero overlays, and the default text color on light surfaces.
- **Ghost White** (`{colors.surface}` — #f7faff): The default page and card background — the lightest surface in the system. Used on page floors, card fills, and modal backgrounds.
- **Surface Soft** (`{colors.surface-soft}` — #f0f3f8): A slightly heavier fill for hover backgrounds on nav items, disabled input surfaces, and sub-section bands where a step of contrast is needed without introducing a border.

### Hairlines & Borders
- **Hairline** (`{colors.hairline}` — #d9dce3): The default 1px border tone. Used on card borders, input outlines, table row separators, and dividers between sections.
- **Hairline Soft** (`{colors.hairline-soft}` — #e8ebf0): A lighter divider for editorial body separators and intra-card content rows where `{colors.hairline}` would feel too heavy.

### Text
- **Ink** (`{colors.ink}` — #282743): The dominant text color on light surfaces. Display headings, body paragraphs, primary nav labels, table cell text, and most inline link text. Same hex as `{colors.primary}` — intentionally unified so the brand color reads as text, not just a structural fill.
- **Muted** (`{colors.muted}` — #6b7280): Secondary text for sublabels, metadata rows, placeholder text, and descriptive copy beneath a primary heading.
- **Muted Soft** (`{colors.muted-soft}` — #9ca3af): Disabled label text and de-emphasized captions. Used very sparingly.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on teal CTAs, deep navy headers, and any dark surface fill.
- **On Surface** (`{colors.on-surface}` — #282743): The default text color on `{colors.surface}` — same as Ink, called out separately as a semantic alias for component theming.

### Semantic
- **Success** (`{colors.success}` — #059669): Inline success states, confirmation badges, and positive status chips.
- **Warning** (`{colors.warning}` — #d97706): Warning banners, non-blocking alert text, and attention indicators.
- **Error** (`{colors.error}` — #dc2626): Inline form validation errors and critical alert text. Distinct from the accent teal — never use teal to communicate error.
- **Error Hover** (`{colors.error-hover}` — #b91c1c): Darkens on hover for error-linked actions.
- **Info** (`{colors.info}` — #009f93): Informational callouts reuse the accent teal — only appropriate when the callout is non-critical and brand-tone aligned.

### Scrim
- **Scrim** (`{colors.scrim}` — #282743 at 50% opacity): The modal backdrop tone used behind dialogs, drawers, and full-screen overlays. Stored as the base hex; opacity is applied at render time.

### CSS Custom Properties

```css
:root {
  --color-accent:        #009f93;
  --color-accent-dark:   #037171;
  --color-primary:       #282743;
  --color-surface:       #f7faff;
  --color-surface-soft:  #f0f3f8;
  --color-hairline:      #d9dce3;
  --color-hairline-soft: #e8ebf0;
  --color-ink:           #282743;
  --color-muted:         #6b7280;
  --color-muted-soft:    #9ca3af;
  --color-on-primary:    #ffffff;
  --color-success:       #059669;
  --color-warning:       #d97706;
  --color-error:         #dc2626;
}
```

---

## Typography

### Font Families

**Exo 2** carries all headings, the brand wordmark, and display contexts. **Montserrat** covers every other surface: body copy, UI labels, form fields, navigation, and captions. There is no third typeface. When Exo 2 is unavailable, fall back to `'Rajdhani', sans-serif`; when Montserrat is unavailable, fall back to `'Inter', sans-serif`.

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@600;700&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
```

### Hierarchy

| Token | Family | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|---|
| `{typography.display-xl}` | Exo 2 | 40px | 700 | 1.15 | -0.5px | Hero page titles, landing h1 |
| `{typography.display-lg}` | Exo 2 | 32px | 700 | 1.2 | -0.3px | Section hero headings, modal titles |
| `{typography.display-md}` | Exo 2 | 24px | 700 | 1.25 | 0 | Page-section h2, dashboard module headers |
| `{typography.display-sm}` | Exo 2 | 20px | 600 | 1.3 | 0 | Sub-section h3, card titles, panel headers |
| `{typography.title-md}` | Montserrat | 16px | 600 | 1.4 | 0 | Nav labels, sidebar section heads, list item titles |
| `{typography.title-sm}` | Montserrat | 14px | 600 | 1.43 | 0 | Table column headers, form section labels |
| `{typography.body-lg}` | Montserrat | 18px | 400 | 1.6 | 0 | Long-form editorial body text, onboarding descriptions |
| `{typography.body-md}` | Montserrat | 16px | 400 | 1.6 | 0 | Default running-text inside forms, cards, and dialogs |
| `{typography.body-sm}` | Montserrat | 14px | 400 | 1.5 | 0 | Metadata rows, secondary descriptions, table cell content |
| `{typography.caption}` | Montserrat | 13px | 600 | 1.3 | 0.01em | Form field labels, input group headings, filter labels |
| `{typography.caption-sm}` | Montserrat | 12px | 400 | 1.33 | 0 | Footnotes, legal copy, timestamp metadata |
| `{typography.label}` | Montserrat | 14px | 600 | 1.29 | 0 | Button labels, badge text, tab labels |
| `{typography.label-sm}` | Montserrat | 12px | 600 | 1.25 | 0.02em | Status chip text, micro-labels on data cards |
| `{typography.uppercase-tag}` | Montserrat | 10px | 700 | 1.2 | 0.08em (uppercase) | Section identifiers rendered in uppercase, category tags |
| `{typography.wordmark}` | Exo 2 | — | 700 | 1.0 | -0.5px | Brand wordmark — never scaled below 18px rendered height |

### Principles

Display type (Exo 2) handles visual hierarchy at the page and section level. UI type (Montserrat) handles everything the user reads or interacts with. The split is non-negotiable — using Montserrat for a heading or Exo 2 for body copy is a brand violation.

Line heights are deliberately generous in body contexts (1.6) to support readability in data-dense enterprise interfaces. Heading line heights are tight (1.15–1.3) so multi-line display titles don't balloon.

The only all-caps usage permitted is `{typography.uppercase-tag}` with its tracking value of `0.08em` — never apply `text-transform: uppercase` to any other token.

---

## Layout

### Spacing System

- **Base unit:** 8px (with 4px micro-step).
- **Tokens:** `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.2xl}` 48px · `{spacing.3xl}` 64px.
- **Section padding (vertical):** `{spacing.3xl}` (64px) for major page bands. Tighter than typical SaaS marketing because LUi's interfaces lean application-dense — content competes with whitespace for priority.
- **Card internal padding:** `{spacing.lg}` (24px) for `{component.data-card}` and `{component.modal}`; `{spacing.md}` (16px) for compact list cards and sidebar panels; `{spacing.sm}` (8px) for caption rows and icon-label pairs inside dense lists.
- **Gutters:** `{spacing.md}` (16px) between cards in grid layouts; `{spacing.lg}` (24px) for two-column dashboard splits; `{spacing.xs}` (4px) for icon-to-label spacing and tight tag clusters.

### Grid & Container

- **Max content width:** 1280px centered on all main application pages. Narrow content (forms, onboarding, confirmation screens) caps at 640px to prevent line lengths from becoming unreadable.
- **Application layout:** Two-column at desktop — a fixed left sidebar (240px) and a fluid content area filling the remainder. The sidebar uses `{colors.primary}` (#282743) as its background; the content area uses `{colors.surface}` (#f7faff).
- **Dashboard grids:** 12-column base grid. Standard widget widths: full-width (12 cols), two-thirds (8 cols), half (6 cols), one-third (4 cols), one-quarter (3 cols).
- **Footer:** Three-column link layout at desktop, collapsing to single-column on mobile.

### Whitespace Philosophy

Structural framing (headers, sidebars, footers) is tight and confident — 16–24px padding. Data surfaces (tables, card grids, form stacks) breathe at 24–32px between rows. Hero and landing sections use 64px of vertical rhythm to establish visual pace before content begins. The contrast between tight data density and generous hero spacing is intentional — it signals that LUi builds interfaces people work inside, not just marketing pages they pass through.

---

## Elevation

The system has **one shadow tier** plus the flat baseline.

- **Flat (no shadow):** Body canvas, sidebar, navigation, all structural bands, and table rows — the vast majority of surfaces.
- **Card resting:** `box-shadow: 0 1px 3px rgba(40, 39, 67, 0.06), 0 1px 2px rgba(40, 39, 67, 0.04)` — the default state for `{component.data-card}`, `{component.form-card}`, and `{component.stat-card}`.
- **Card hover / Dropdown float:** `box-shadow: 0 4px 12px rgba(40, 39, 67, 0.10), 0 2px 4px rgba(40, 39, 67, 0.06)` — applied on pointer hover for interactive cards and on all dropdown and popover surfaces.
- **Modal / Drawer:** `box-shadow: 0 20px 48px rgba(40, 39, 67, 0.18), 0 8px 16px rgba(40, 39, 67, 0.10)` — the only time strong elevation is used. Reserved exclusively for dialogs and slide-in drawers over the scrim.
- **Scrim:** `{colors.scrim}` (#282743 at 50% opacity) behind all modal and drawer surfaces.

There are no progressive tiers between card hover and modal — the system either rests, floats, or dialogs. Depth beyond the modal tier is always wrong.

---

## Components

### Buttons

**`button-primary`** — Teal fill (`#009f93`), white text, 6px radius, `12px 24px` padding, 44px min-height, Montserrat 700 at 14px. The default action in every form, dialog, and primary flow: "Salvar", "Confirmar", "Continuar".

**`button-primary-hover`** — Background flips to `{colors.accent-dark}` (#037171). No transform, no shadow change. Transition: `background-color 0.2s ease`.

**`button-primary-active`** — `{colors.accent-dark}` with `filter: brightness(0.9)`. Communicates that the tap/click registered.

**`button-primary-disabled`** — `{colors.accent}` at 40% opacity, white text, `cursor: not-allowed`. Opacity approach keeps the teal hue recognizable while clearly blocking interaction.

**`button-secondary`** — Transparent fill, `{colors.accent}` text, 2px solid `{colors.accent}` border, 6px radius. Used for secondary actions alongside a primary: "Cancelar", "Voltar", "Ver mais".

**`button-secondary-hover`** — Fill flips to `{colors.accent}`, text flips to white. Border remains.

**`button-ghost`** — No fill, no border. `{colors.ink}` text with underline on hover. Used for tertiary inline actions and "Show more" expansion links.

**`button-danger`** — Error red fill (`{colors.error}`), white text. Reserved for destructive confirmation actions only: "Excluir", "Remover". Must never appear as the sole CTA in a form.

### Cards

**`data-card`** — `{colors.surface}` (#f7faff) fill, 1px `{colors.hairline}` border, 12px radius, 24px padding, resting shadow tier. The standard container for dashboard widgets, data summaries, and content modules.

**`data-card-interactive`** — Same as `data-card` with a hover state: border color transitions to `{colors.accent}`, shadow upgrades to the hover tier, `cursor: pointer`. Used on clickable card entries in lists and grids.

**`stat-card`** — A compact variant of `data-card` (16px padding) holding a single metric: a large number in `{typography.display-md}` ink, a label in `{typography.caption}` muted, and an optional trend indicator.

**`form-card`** — Full-width card containing a form section. 24px padding, 12px radius, resting shadow. Each distinct form section (personal data, address, billing) gets its own `form-card` to visually segment the flow.

### Inputs & Forms

**`text-input`** — `{colors.surface}` fill, 1px `{colors.hairline}` outline, 6px radius, 44px height, `12px 14px` padding. Stacked `{typography.caption}` label above (`{colors.muted}`), placeholder in `{typography.body-md}` muted-soft. On focus: border transitions to 2px `{colors.accent}`, `box-shadow: 0 0 0 3px rgba(0, 159, 147, 0.15)`. On error: border and label turn `{colors.error}`, an error message in `{typography.caption}` error appears below the input.

**`select-input`** — Same sizing and style as `text-input`. Custom chevron icon in `{colors.muted}` replaces native arrow.

**`textarea`** — Same horizontal style as `text-input`, min-height 96px, `resize: vertical` only.

**`checkbox`** and **`radio`** — 18×18px control. Unchecked: 1px `{colors.hairline}` border, transparent fill. Checked: `{colors.accent}` fill, white check/dot, no border. Focus: `box-shadow: 0 0 0 3px rgba(0, 159, 147, 0.2)`.

**`toggle`** — 40×22px pill. Off: `{colors.hairline}` track, white knob. On: `{colors.accent}` track, white knob. Transition: `0.2s ease`.

### Navigation / Sidebar

**`app-sidebar`** — Fixed left rail, 240px wide, `{colors.primary}` (#282743) background, full viewport height. The LUi wordmark sits at the top in Exo 2 700 in white. Nav items in `{typography.title-md}` with white text at 60% opacity (inactive) and 100% opacity (active). Active item carries a 3px left-border accent in `{colors.accent}` and a `{colors.surface-soft}` at 10% opacity background fill.

**`top-bar`** — Full-width header above the content area (not the sidebar). 64px height, `{colors.surface}` fill, 1px `{colors.hairline}` bottom border. Holds page title in `{typography.display-sm}` on the left and contextual actions (breadcrumbs, action buttons) on the right.

**`nav-item-active`** — 3px left border in `{colors.accent}`, semi-transparent teal fill on the row, full-opacity white label.

**`nav-item-inactive`** — No border, no fill, 60% opacity white label. Pointer hover: 80% opacity label, subtle fill.

### Tables

**`data-table`** — Full-width, no outer border. Column headers in `{typography.title-sm}` ink, 1px `{colors.hairline}` bottom border under the header row, 12px 16px cell padding. Body rows alternate between `{colors.surface}` and `{colors.surface-soft}` fills. Row hover: 1px `{colors.accent}` left border, `{colors.surface-soft}` background.

**`table-action-cell`** — Icon buttons in the rightmost column. 32×32px icon button, `{colors.muted}` at rest, `{colors.accent}` on hover, `{component.button-ghost}` style.

### Badges & Status Chips

**`badge-success`** — `{colors.success}` at 12% opacity fill, `{colors.success}` text, 9999px radius, `4px 10px` padding, `{typography.label-sm}`.

**`badge-warning`** — Same pattern with `{colors.warning}`.

**`badge-error`** — Same pattern with `{colors.error}`.

**`badge-neutral`** — `{colors.hairline}` fill, `{colors.muted}` text.

**`badge-accent`** — `{colors.accent}` at 12% opacity fill, `{colors.accent}` text. Used for "new" features and active-state labels.

### Modals & Dialogs

**`modal`** — Centered overlay over scrim. White fill, 12px radius, modal shadow tier, 24px padding, max-width 560px (standard) or 760px (wide/form). Always contains a title in `{typography.display-sm}`, body content, and a footer row with a primary and optionally a secondary button.

**`drawer`** — Slides in from the right, full viewport height, 480px width, white fill, modal shadow tier, 24px padding. Used for detail panels and multi-step side-flows.

### Iconography

- Use icons from **Lucide Icons** as the primary library — clean, consistent 24px stroke-based icons that match the brand's modern tone.
- Default icon size: 20px for inline UI; 24px for standalone and nav contexts.
- Icon color defaults to `currentColor` (inherits text color). Use `{colors.accent}` for interactive icons in a standalone context.
- Minimum touch target for interactive icons: **44×44px** (wrap in a button element with padding).
- Always pair icons with visible labels when the action is primary. Icon-only controls are permitted only in dense table rows and toolbars, and must carry a `title` or `aria-label`.

---

## Motion & Transitions

- Use **subtle, purposeful transitions** only. Never animate for decoration.
- `0.15s ease` — micro-interactions: button color, icon color, input border.
- `0.2s ease` — standard state transitions: focus rings, hover fills, toggle switches.
- `0.3s ease-out` — layout shifts: dropdown opening, accordion expand, tab panel transition.
- `0.35s ease` — modal and drawer entry. Exit always uses `0.2s ease-in` (closing feels faster than opening).
- No animation should exceed `0.4s` for UI interactions.
- Entrance animation for modals: `translateY(8px) → translateY(0)` + `opacity 0 → 1`.
- Entrance animation for drawers: `translateX(24px) → translateX(0)` + `opacity 0 → 1`.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility

- **Color contrast:** minimum **4.5:1** for normal text, **3:1** for large text (WCAG AA). `{colors.ink}` (#282743) on `{colors.surface}` (#f7faff) passes AAA. `{colors.accent}` (#009f93) on white is insufficient for body text — use only at Bold/large text sizes, or pair with an additional visual indicator (icon, underline).
- All interactive elements must be keyboard-navigable in logical DOM order.
- Focus ring: `box-shadow: 0 0 0 3px rgba(0, 159, 147, 0.4)` — visible on all focusable elements. Do not suppress outlines without providing this replacement.
- All images and icons must have meaningful `alt` or `aria-label` attributes. Decorative images use `alt=""`.
- Form inputs must have associated `<label>` elements (not just `placeholder` text). Error messages must be linked via `aria-describedby`.
- Modals must trap focus and return focus to the trigger element on close. Use `role="dialog"` and `aria-modal="true"`.
- Status chips and badges must not rely on color alone — always include a text label.

---

## Responsive Behavior

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Sidebar collapses to a bottom tab bar (max 5 items) or a full-screen drawer triggered by a hamburger; top-bar drops breadcrumbs and shows only page title + menu icon; cards stack single-column; tables switch to card-list view; modals go full-screen; form cards lose side padding. |
| Tablet | 640–1024px | Sidebar collapses to icon-only rail (64px wide) with tooltips on hover; content area fills the remainder; two-column card grids; tables retain all columns; modals maintain centered overlay at 90% viewport width. |
| Desktop | 1024–1280px | Full 240px sidebar; standard two-column content layout; 3–4 column card grids; full top-bar with breadcrumbs. |
| Wide | > 1280px | Content width caps at 1280px; sidebar remains 240px; gutters absorb extra space. Do not stretch grids beyond 4 columns for standard data cards. |

### Touch Targets
- All primary CTAs: minimum **44×44px** (WCAG AA).
- Icon buttons in toolbars and tables: 32×32px element with 6px padding, achieving a 44px tap zone.
- Toggle switches: 40×22px element with 11px vertical padding for the tap zone.
- Nav items in the mobile tab bar: minimum 48px height.

### Collapsing Strategy
- Sidebar collapses in two steps: full (240px) → icon rail (64px) → hidden (drawer).
- Tables below 640px reflow into stacked key-value card rows — never truncate columns or introduce horizontal scroll on primary data tables.
- Two-column dashboard layouts collapse to single-column below 640px. Three-column and four-column grids collapse to two-column at tablet and single-column at mobile.
- Modals below 640px expand to full-screen sheets anchored to the bottom, using the same shadow and scrim.

---

## Known Gaps

- **Skeleton loading states:** The pattern for loading placeholders (shimmer animation using `{colors.hairline}` and `{colors.hairline-soft}`) is defined in spirit but individual component skeleton variants are not yet fully specified per page template.
- **Data visualization / Charts:** Color palette for chart series (lines, bars, pie slices) has not been formally tokenized. Until documented, use `{colors.accent}`, `{colors.accent-dark}`, `{colors.muted}`, and `{colors.primary}` in that priority order.
- **Rich text / Markdown rendering:** Typography styles for user-generated content blocks (headings, lists, blockquotes inside CMS or comment contexts) are not yet captured.
- **Email templates:** Brand guidelines for transactional email layouts are separate from this document and not yet produced.
- **Right-to-left (RTL) support:** Not in scope for the current version. Logical CSS properties (`padding-inline-start` etc.) should be preferred over directional ones to ease a future RTL pass.

---

## Quick-Reference Checklist

Before shipping any screen, verify:

- [ ] Only LUi brand colors used (`#282743`, `#d9dce3`, `#f7faff`, `#037171`, `#009f93`)
- [ ] Headings and wordmark use **Exo 2**; all other text uses **Montserrat**
- [ ] Font weights: 400 (regular), 600 (semi-bold), 700 (bold) only
- [ ] Spacing follows the 8px grid — no arbitrary pixel values
- [ ] Primary CTA uses `{colors.accent}` (#009f93); hover/active uses `{colors.accent-dark}` (#037171)
- [ ] One shadow tier only — card resting, card hover, or modal. No custom shadows
- [ ] Color contrast meets WCAG AA minimum (4.5:1 for body text)
- [ ] Focus rings visible with teal ring on all focusable elements
- [ ] `prefers-reduced-motion` respected
- [ ] All images have `alt` text; all icon-only buttons have `aria-label`
- [ ] Form inputs have associated `<label>` elements and `aria-describedby` on error messages
- [ ] Modals trap focus and return it on close
- [ ] Mobile layout tested at 320px minimum viewport width
- [ ] Touch targets meet 44×44px minimum
