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
// MOBILE NAVIGATION TOGGLE
// ============================================================

const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

function openNav() {
  document.body.classList.add('nav-open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileNav.setAttribute('aria-hidden', 'false');
  mobileNav.querySelector('a').focus();
}

function closeNav() {
  document.body.classList.remove('nav-open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');
  hamburger.focus();
}

hamburger.addEventListener('click', () => {
  document.body.classList.contains('nav-open') ? closeNav() : openNav();
});

mobileNavLinks.forEach((link) => link.addEventListener('click', closeNav));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('nav-open')) closeNav();
});
