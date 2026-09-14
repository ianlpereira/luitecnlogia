// ============================================================
// LUi Tecnologia — site behaviour
// Single flat script, no imports/exports, no build step.
// Loaded at the end of <body>, so the DOM is already parsed.
// ============================================================

const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================================
// THEME CONTROLLER
// Resolution order: explicit user choice → OS preference.
// The initial attribute is stamped by the inline script in <head>
// so there is no flash of the wrong theme before this runs.
// ============================================================

const THEME_KEY = 'lui-theme';
const themeToggle = document.getElementById('theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const osDark = window.matchMedia('(prefers-color-scheme: dark)');

function resolvedTheme() {
  const explicit = root.getAttribute('data-theme');
  if (explicit === 'dark' || explicit === 'light') return explicit;
  return osDark.matches ? 'dark' : 'light';
}

// Keep the browser chrome colour in step with the painted page.
// The surface tokens are color-mix() values, which browsers serialize as
// `oklab(...)`. A theme-color meta needs a plain sRGB colour, and reading
// back canvas.fillStyle does not normalise it (the colour space is
// preserved), so paint one pixel and read the actual bytes.
let pixelCtx = null;

function toRgb(color) {
  if (!color) return null;
  if (/^#[0-9a-f]{3,8}$/i.test(color) || /^rgba?\(/i.test(color)) return color;

  try {
    if (!pixelCtx) {
      const c = document.createElement('canvas');
      c.width = c.height = 1;
      pixelCtx = c.getContext('2d', { willReadFrequently: true });
    }
    if (!pixelCtx) return null;

    pixelCtx.clearRect(0, 0, 1, 1);
    pixelCtx.fillStyle = '#000';
    pixelCtx.fillStyle = color;
    pixelCtx.fillRect(0, 0, 1, 1);

    const [r, g, b] = pixelCtx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  } catch (e) {
    return null; // canvas blocked (rare privacy settings) — keep the existing meta
  }
}

function syncThemeMeta() {
  if (!themeMeta) return;
  const painted = toRgb(getComputedStyle(document.body).backgroundColor);
  if (painted) themeMeta.setAttribute('content', painted);
}

function syncThemeToggle() {
  if (!themeToggle) return;
  const isDark = resolvedTheme() === 'dark';
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', isDark ? 'Usar tema claro' : 'Usar tema escuro');
}

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    /* storage unavailable (private mode, blocked cookies) — theme still applies for this visit */
  }
  syncThemeToggle();
  syncThemeMeta();
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    applyTheme(resolvedTheme() === 'dark' ? 'light' : 'dark');
  });
}

// Follow the OS while the visitor has not made an explicit choice
osDark.addEventListener('change', () => {
  if (!root.hasAttribute('data-theme')) {
    syncThemeToggle();
    syncThemeMeta();
  }
});

syncThemeToggle();
syncThemeMeta();

// ============================================================
// PALETTE SWITCHER
// Live-swaps the brand primitives to demo customizability.
// Writes a `data-palette` attribute rather than inline custom
// properties — inline styles on <html> would out-specify the
// dark-theme media query and silently break it.
// ============================================================

const PALETTE_KEY = 'lui-palette';

const PALETTES = [
  { primary: '#282743', accent: '#05ccbb', accentDark: '#037171' }, // LUi default
  { primary: '#1a3326', accent: '#34d399', accentDark: '#047857' }, // Floresta
  { primary: '#2d1b4e', accent: '#a78bfa', accentDark: '#6d28d9' }, // Crepúsculo
  { primary: '#3d2200', accent: '#fbbf24', accentDark: '#b45309' }, // Âmbar
  { primary: '#0d1f3c', accent: '#38bdf8', accentDark: '#0369a1' }, // Oceano
];

const paletteBtns = document.querySelectorAll('.palette-btn');
let themingTimer = null;

function applyPalette(index, persist = true) {
  const i = Number.isInteger(index) && PALETTES[index] ? index : 0;
  const p = PALETTES[i];

  root.setAttribute('data-palette', String(i));

  // Smooth the brand-driven surfaces only while the swap is in flight
  root.classList.add('is-theming');
  clearTimeout(themingTimer);
  themingTimer = setTimeout(() => root.classList.remove('is-theming'), 400);

  // The inline SVG wordmarks carry a literal accent fill
  document.querySelectorAll('.logo-svg tspan, .hero-logo-svg tspan').forEach((el) => {
    el.setAttribute('fill', p.accent);
  });

  paletteBtns.forEach((btn, n) => {
    const active = n === i;
    btn.classList.toggle('palette-btn--active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  if (persist) {
    try {
      localStorage.setItem(PALETTE_KEY, String(i));
    } catch (e) {
      /* storage unavailable — palette still applies for this visit */
    }
  }

  syncThemeMeta();
}

paletteBtns.forEach((btn) => {
  btn.addEventListener('click', () => applyPalette(Number(btn.dataset.palette)));
});

// Re-sync the logo fills and button states with whatever the head
// script restored from storage.
if (paletteBtns.length) {
  applyPalette(Number(root.getAttribute('data-palette')) || 0, false);
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
  hamburger.setAttribute('aria-label', 'Fechar menu');
  mobileNav.setAttribute('aria-hidden', 'false');
  const first = mobileNav.querySelector('a');
  if (first) first.focus();
}

function closeNav() {
  document.body.classList.remove('nav-open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Abrir menu');
  mobileNav.setAttribute('aria-hidden', 'true');
  hamburger.focus();
}

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    document.body.classList.contains('nav-open') ? closeNav() : openNav();
  });

  mobileNavLinks.forEach((link) => link.addEventListener('click', closeNav));

  document.addEventListener('keydown', (e) => {
    if (!document.body.classList.contains('nav-open')) return;

    if (e.key === 'Escape') {
      closeNav();
      return;
    }

    // Focus trap inside mobile nav
    if (e.key === 'Tab') {
      const focusable = Array.from(mobileNav.querySelectorAll('a, button, [tabindex="0"]'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

// ============================================================
// FAQ ACCORDION
// Collapse-all-then-open. The `hidden` attribute stays the source
// of truth; CSS animates around it.
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
// SCROLL REVEAL
// ============================================================

const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length) {
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }
}

// ============================================================
// ACTIVE SECTION → NAV INDICATOR
// ============================================================

const navLinks = Array.from(document.querySelectorAll('.nav-link, .mobile-nav-link'));
const linksByHash = new Map();

navLinks.forEach((link) => {
  const hash = link.getAttribute('href');
  if (!hash || !hash.startsWith('#')) return;
  if (!linksByHash.has(hash)) linksByHash.set(hash, []);
  linksByHash.get(hash).push(link);
});

function setActiveSection(id) {
  navLinks.forEach((link) => link.removeAttribute('aria-current'));
  const active = linksByHash.get('#' + id);
  if (active) active.forEach((link) => link.setAttribute('aria-current', 'true'));
}

if ('IntersectionObserver' in window && linksByHash.size) {
  const headerHeight =
    parseInt(getComputedStyle(root).getPropertyValue('--header-height'), 10) || 68;

  const watched = Array.from(linksByHash.keys())
    .map((hash) => document.querySelector(hash))
    .filter(Boolean);

  const visible = new Set();

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });

      if (!visible.size) return;

      // The topmost section still under the header wins
      const current = Array.from(visible).sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
      )[0];

      if (current && current.id) setActiveSection(current.id);
    },
    { rootMargin: `-${headerHeight + 8}px 0px -55% 0px`, threshold: 0 }
  );

  watched.forEach((section) => sectionObserver.observe(section));
}

// ============================================================
// CARD SPOTLIGHT
// One delegated listener; skipped on coarse pointers.
// ============================================================

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion) {
  document.addEventListener(
    'pointermove',
    (e) => {
      const card = e.target.closest('.service-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    },
    { passive: true }
  );
}

// ============================================================
// CONTACT FORM
// No backend: valid submissions compose a mailto: draft.
// ============================================================

const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const formStatus = document.getElementById('form-status');
  const fields = [
    { el: document.getElementById('name'), error: document.getElementById('name-error') },
    { el: document.getElementById('email'), error: document.getElementById('email-error') },
    { el: document.getElementById('message'), error: document.getElementById('message-error') },
  ].filter((f) => f.el && f.error);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateField(field) {
    const value = field.el.value.trim();
    let message = '';

    if (!value) {
      message = 'Este campo é obrigatório.';
    } else if (field.el.type === 'email' && !EMAIL_RE.test(value)) {
      message = 'Informe um e-mail válido.';
    } else if (field.el.id === 'message' && value.length < 10) {
      message = 'Conte um pouco mais — pelo menos 10 caracteres.';
    }

    field.error.textContent = message;
    field.el.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  fields.forEach((field) => {
    // Only nag after the visitor has already left the field once
    field.el.addEventListener('blur', () => validateField(field));
    field.el.addEventListener('input', () => {
      if (field.el.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (formStatus) formStatus.textContent = '';

    const results = fields.map(validateField);
    const firstInvalid = fields[results.indexOf(false)];

    if (firstInvalid) {
      firstInvalid.el.focus();
      return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const subject = `Contato pelo site — ${name}`;
    const body = `Nome: ${name}\nE-mail: ${email}\n\n${message}`;

    window.location.href =
      `mailto:luitecnologia@gmail.com?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    if (formStatus) {
      formStatus.textContent =
        'Abrimos seu aplicativo de e-mail com a mensagem pronta. Se nada acontecer, escreva para luitecnologia@gmail.com.';
    }
  });
}

// ============================================================
// UNIFIED SCROLL HANDLER
// Header state + hero-logo cross-fade + scroll-to-top + progress.
// One rAF-throttled passive listener drives all of them.
// ============================================================

const siteHeader = document.querySelector('.site-header');
const heroLogoEl = document.querySelector('.hero-logo');
const headerLogoEl = document.querySelector('.site-logo');
const scrollTopBtn = document.getElementById('scroll-top');
const progressBar = document.querySelector('.scroll-progress .bar');

const headerHeightPx =
  parseInt(getComputedStyle(root).getPropertyValue('--header-height'), 10) || 68;

// Fade begins when the hero logo's bottom is (headerHeight + 120)px from
// the top, and completes when it reaches the header's bottom edge.
const FADE_START = headerHeightPx + 120;
const FADE_END = headerHeightPx;

if (progressBar) {
  const r = progressBar.r.baseVal.value;
  progressBar.style.setProperty('--circumference', String(2 * Math.PI * r));
}

let hideBtnTimer = null;

function syncLogoOpacity() {
  if (!heroLogoEl || !headerLogoEl) return;

  const bottom = heroLogoEl.getBoundingClientRect().bottom;

  let t; // 0 = hero logo fully visible, 1 = header logo fully visible
  if (bottom >= FADE_START) {
    t = 0;
  } else if (bottom <= FADE_END) {
    t = 1;
  } else {
    t = (FADE_START - bottom) / (FADE_START - FADE_END);
  }

  // Respect reduced-motion: snap instead of interpolate
  if (reducedMotion) t = t >= 0.5 ? 1 : 0;

  heroLogoEl.style.opacity = 1 - t;
  headerLogoEl.style.opacity = t;
  heroLogoEl.style.pointerEvents = t > 0.9 ? 'none' : '';
  headerLogoEl.style.pointerEvents = t < 0.1 ? 'none' : '';
}

function syncScrollTop(y) {
  if (!scrollTopBtn) return;

  if (y > 400) {
    clearTimeout(hideBtnTimer);
    if (scrollTopBtn.hidden) {
      scrollTopBtn.hidden = false;
      // Let the element lay out before transitioning it in
      requestAnimationFrame(() => scrollTopBtn.classList.add('visible'));
    } else {
      scrollTopBtn.classList.add('visible');
    }
  } else if (!scrollTopBtn.hidden) {
    scrollTopBtn.classList.remove('visible');
    // Restore `hidden` once faded out, so the invisible button is not
    // left behind as a tab stop.
    clearTimeout(hideBtnTimer);
    hideBtnTimer = setTimeout(() => {
      if (!scrollTopBtn.classList.contains('visible')) scrollTopBtn.hidden = true;
    }, 260);
  }
}

function syncProgress(y) {
  if (!progressBar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? Math.min(y / max, 1) : 0;
  progressBar.style.setProperty('--progress', String(ratio));
}

function onScroll() {
  const y = window.scrollY;

  if (siteHeader) siteHeader.classList.toggle('is-scrolled', y > 8);
  syncLogoOpacity();
  syncScrollTop(y);
  syncProgress(y);
}

let rafQueued = false;

window.addEventListener(
  'scroll',
  () => {
    if (rafQueued) return;
    rafQueued = true;
    requestAnimationFrame(() => {
      rafQueued = false;
      onScroll();
    });
  },
  { passive: true }
);

window.addEventListener('resize', () => syncProgress(window.scrollY), { passive: true });

// Resolve correct state immediately (handles deep-links / mid-scroll refresh)
onScroll();

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });
}

// ============================================================
// PRIVACY POLICY MODAL
// ============================================================

const privacyModal = document.getElementById('privacy-modal');
const privacyTrigger = document.getElementById('privacy-trigger');
const privacyClose = document.getElementById('privacy-modal-close');
const privacyCloseBtn = document.getElementById('privacy-modal-close-btn');

if (privacyModal && privacyTrigger && privacyClose && privacyCloseBtn) {
  const openPrivacyModal = () => {
    privacyModal.classList.add('modal-open');
    privacyModal.setAttribute('aria-hidden', 'false');
    // scrollbar-gutter on <html> keeps this from shifting the layout
    document.body.style.overflow = 'hidden';
    privacyClose.focus();
  };

  const closePrivacyModal = () => {
    privacyModal.classList.remove('modal-open');
    privacyModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    privacyTrigger.focus();
  };

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
    if (e.key === 'Escape') {
      closePrivacyModal();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = Array.from(
        privacyModal.querySelectorAll('a, button, [tabindex="0"]')
      ).filter((el) => !el.closest('[aria-hidden="true"]'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
