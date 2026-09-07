/* ============================================================
   main.js — navigation, menu, animations, live clock
   ============================================================ */

(function () {
  'use strict';

  /* ── DOM refs ── */
  const menuToggle  = document.getElementById('menu-toggle');
  const navOverlay  = document.getElementById('nav-overlay');
  const navClose    = document.getElementById('nav-close');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navLinks    = document.querySelectorAll('.nav-link');
  const sectionLinks= document.querySelectorAll('[data-section]');

  /* ════════════════════════════════════════
     MENU
  ════════════════════════════════════════ */
  function openMenu() {
    navOverlay.classList.add('is-open');
    navOverlay.setAttribute('aria-hidden', 'false');
    navBackdrop.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    navClose.focus();
  }

  function closeMenu() {
    navOverlay.classList.remove('is-open');
    navOverlay.setAttribute('aria-hidden', 'true');
    navBackdrop.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuToggle.focus();
  }

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  navClose?.addEventListener('click', closeMenu);
  navBackdrop?.addEventListener('click', closeMenu);

  /* Trap focus inside nav */
  navOverlay?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── Nav link clicks — smooth scroll + close ── */
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const sectionId = link.getAttribute('data-section');
      const target    = document.getElementById(sectionId);
      if (target) {
        e.preventDefault();
        closeMenu();
        /* Small delay so the menu animation finishes before scroll */
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 320);
      }
    });
  });

  /* ── In-page CTA buttons (data-section) ── */
  sectionLinks.forEach((link) => {
    if (link.classList.contains('nav-link')) return;
    link.addEventListener('click', (e) => {
      const sectionId = link.getAttribute('data-section');
      const target    = document.getElementById(sectionId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('.section[id]');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((l) => {
            l.classList.toggle('is-active', l.getAttribute('data-section') === id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((s) => io.observe(s));

  /* ════════════════════════════════════════
     LIVE CLOCK
  ════════════════════════════════════════ */
  const liveClock = document.getElementById('live-time');
  function updateClock() {
    if (!liveClock) return;
    const now = new Date();
    const h   = String(now.getHours()).padStart(2, '0');
    const m   = String(now.getMinutes()).padStart(2, '0');
    const s   = String(now.getSeconds()).padStart(2, '0');
    liveClock.textContent = `${h}:${m}:${s}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ════════════════════════════════════════
     YEAR
  ════════════════════════════════════════ */
  const yearEl = document.getElementById('cy');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ════════════════════════════════════════
     SCROLL-REVEAL (intersection observer)
  ════════════════════════════════════════ */
  const revealTargets = document.querySelectorAll(
    '.project-card, .timeline-item, .skill-cat, .contact-link, .about-bio, .about-education, .about-interests'
  );

  const revealIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealIO.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -80px 0px', threshold: 0.05 }
  );

  /* Add initial hidden state via inline style so CSS isn't needed */
  revealTargets.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = `opacity 0.55s ease ${i * 0.04}s, transform 0.55s ease ${i * 0.04}s`;
    revealIO.observe(el);
  });

  document.addEventListener('revealed-add', () => {});

  /* ── Revealed state ── */
  const style = document.createElement('style');
  style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);

  /* ════════════════════════════════════════
     HUD SCAN BAR flicker reset
  ════════════════════════════════════════ */
  /* already handled by pure CSS animation */

  /* ════════════════════════════════════════
     MODAL close button (extra safety in case
     projects.js attaches before DOM is ready)
  ════════════════════════════════════════ */
  document.getElementById('modal-close')?.addEventListener('click', () => {
    const modal = document.getElementById('modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });

  document.getElementById('modal-bg')?.addEventListener('click', () => {
    const modal = document.getElementById('modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('modal');
      if (modal?.classList.contains('is-open')) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }
  });

})();
