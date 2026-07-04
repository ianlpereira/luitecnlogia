// ============================================================
// BLOB ANIMATOR
// Generates organic morphing SVG blobs using Catmull-Rom
// splines converted to cubic Bezier curves.
// ============================================================

class BlobAnimator {
  constructor(pathEl, opts = {}) {
    this.path    = pathEl;
    this.cx      = opts.cx       ?? 100;
    this.cy      = opts.cy       ?? 100;
    this.radius  = opts.radius   ?? 75;
    this.points  = opts.points   ?? 6;
    this.speed   = opts.speed    ?? 0.0005;
    this.variance = opts.variance ?? 0.28;
    // Random per-point phase offsets so blobs don't pulse in sync
    this.seeds = Array.from({ length: this.points }, () => Math.random() * Math.PI * 2);
    this.rafId = null;
    this._tick = this._tick.bind(this);
  }

  // Compute one point's displaced radius at time t
  _pointAt(i, t) {
    const angle = ((Math.PI * 2) / this.points) * i - Math.PI / 2;
    const r = this.radius * (1 + Math.sin(t + this.seeds[i]) * this.variance);
    return [
      this.cx + Math.cos(angle) * r,
      this.cy + Math.sin(angle) * r,
    ];
  }

  // Catmull-Rom → cubic Bezier conversion for a closed polyline
  _buildPath(t) {
    const n = this.points;
    const pts = Array.from({ length: n }, (_, i) => this._pointAt(i, t));

    let d = `M${fmt(pts[0][0])},${fmt(pts[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % n];
      const p3 = pts[(i + 2) % n];
      // Control points
      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${fmt(cp1x)},${fmt(cp1y)} ${fmt(cp2x)},${fmt(cp2y)} ${fmt(p2[0])},${fmt(p2[1])}`;
    }
    return d + 'Z';
  }

  _tick(ts) {
    this.path.setAttribute('d', this._buildPath(ts * this.speed));
    this.rafId = requestAnimationFrame(this._tick);
  }

  start() {
    this.rafId = requestAnimationFrame(this._tick);
    return this;
  }

  stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}

// Round floats to 2 decimal places for shorter SVG strings
function fmt(n) {
  return Math.round(n * 100) / 100;
}

// ============================================================
// BLOB INITIALIZATION
// ============================================================

// Each config matches a .js-blob path in DOM order
const BLOB_CONFIGS = [
  // Hero — main (large, slow, gentle)
  { points: 7, radius: 78, cx: 100, cy: 100, speed: 0.00035, variance: 0.22 },
  // Hero — secondary (smaller, faster, more organic)
  { points: 6, radius: 74, cx: 100, cy: 100, speed: 0.00055, variance: 0.32 },
  // About
  { points: 8, radius: 76, cx: 100, cy: 100, speed: 0.00028, variance: 0.18 },
  // Services
  { points: 6, radius: 75, cx: 100, cy: 100, speed: 0.00042, variance: 0.26 },
  // Why — main
  { points: 7, radius: 77, cx: 100, cy: 100, speed: 0.00031, variance: 0.24 },
  // Why — secondary
  { points: 5, radius: 73, cx: 100, cy: 100, speed: 0.00048, variance: 0.30 },
  // Contact
  { points: 6, radius: 75, cx: 100, cy: 100, speed: 0.00038, variance: 0.20 },
];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
  document.querySelectorAll('.js-blob').forEach((pathEl, i) => {
    const cfg = BLOB_CONFIGS[i] ?? BLOB_CONFIGS[0];
    new BlobAnimator(pathEl, cfg).start();
  });
}

// ============================================================
// PALETTE SWITCHER
// Live-swaps CSS custom properties to demo brand customizability
// ============================================================

const PALETTES = [
  { primary: '#282743', accent: '#05ccbb', accentDark: '#037171' }, // LUi default
  { primary: '#1a3326', accent: '#34d399', accentDark: '#047857' }, // Floresta
  { primary: '#2d1b4e', accent: '#a78bfa', accentDark: '#6d28d9' }, // Crepúsculo
  { primary: '#3d2200', accent: '#fbbf24', accentDark: '#b45309' }, // Âmbar
  { primary: '#0d1f3c', accent: '#38bdf8', accentDark: '#0369a1' }, // Oceano
];

function applyPalette(index) {
  const p = PALETTES[index];
  const root = document.documentElement;

  root.style.setProperty('--color-primary', p.primary);
  root.style.setProperty('--color-ink',     p.primary);
  root.style.setProperty('--color-accent',      p.accent);
  root.style.setProperty('--color-accent-dark', p.accentDark);

  // Update inline SVG logo accent tspans
  document.querySelectorAll('.logo-svg tspan').forEach(el => {
    el.setAttribute('fill', p.accent);
  });

  // Update palette button active states
  document.querySelectorAll('.palette-btn').forEach((btn, i) => {
    const active = i === index;
    btn.classList.toggle('palette-btn--active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

document.querySelectorAll('.palette-btn').forEach(btn => {
  btn.addEventListener('click', () => applyPalette(Number(btn.dataset.palette)));
});

// ============================================================
// MOBILE NAVIGATION TOGGLE
// ============================================================

const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

function openNav() {
  document.body.classList.add('nav-open');
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.setAttribute('aria-label', 'Fechar menu');
  mobileNav.setAttribute('aria-hidden', 'false');
  mobileNav.querySelector('a').focus();
}

function closeNav() {
  document.body.classList.remove('nav-open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Abrir menu');
  mobileNav.setAttribute('aria-hidden', 'true');
  hamburger.focus();
}

hamburger.addEventListener('click', () => {
  document.body.classList.contains('nav-open') ? closeNav() : openNav();
});

mobileNavLinks.forEach((link) => link.addEventListener('click', closeNav));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
    closeNav();
    return;
  }

  // Focus trap inside mobile nav
  if (e.key === 'Tab' && document.body.classList.contains('nav-open')) {
    const focusable = Array.from(mobileNav.querySelectorAll('a, button, [tabindex="0"]'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
});

// ============================================================
// FAQ ACCORDION
// ============================================================

document.querySelectorAll('.faq-question').forEach((btn) => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';

    // Collapse all items
    document.querySelectorAll('.faq-question').forEach((other) => {
      other.setAttribute('aria-expanded', 'false');
      const ans = document.getElementById(other.getAttribute('aria-controls'));
      if (ans) ans.setAttribute('hidden', '');
    });

    // If it wasn't open, open it now
    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      const answer = document.getElementById(btn.getAttribute('aria-controls'));
      if (answer) answer.removeAttribute('hidden');
    }
  });
});

// ============================================================
// SCROLL TO TOP
// ============================================================

const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.hidden = false;
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// PRIVACY POLICY MODAL
// ============================================================

const privacyModal    = document.getElementById('privacy-modal');
const privacyTrigger  = document.getElementById('privacy-trigger');
const privacyClose    = document.getElementById('privacy-modal-close');
const privacyCloseBtn = document.getElementById('privacy-modal-close-btn');

function openPrivacyModal() {
  privacyModal.classList.add('modal-open');
  privacyModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  privacyClose.focus();
}

function closePrivacyModal() {
  privacyModal.classList.remove('modal-open');
  privacyModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  privacyTrigger.focus();
}

privacyTrigger.addEventListener('click', (e) => {
  e.preventDefault();
  openPrivacyModal();
});

privacyClose.addEventListener('click', closePrivacyModal);
privacyCloseBtn.addEventListener('click', closePrivacyModal);

// Close on backdrop click
privacyModal.addEventListener('click', (e) => {
  if (e.target === privacyModal) closePrivacyModal();
});

// Keyboard: Escape + focus trap
privacyModal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closePrivacyModal(); return; }

  if (e.key === 'Tab') {
    const focusable = Array.from(
      privacyModal.querySelectorAll('a, button, [tabindex="0"]')
    ).filter(el => !el.closest('[aria-hidden="true"]'));
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
});
