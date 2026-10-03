/**
 * VERDICT — Precision Smooth Scroll & Gliding Momentum Interaction
 * Based on the Nothing.gripe smooth scroll architecture with Lenis
 */

(function () {
  var root = document.documentElement;
  var HEADER_OFFSET = 64;

  // Smooth scroll helper for application code
  window.smoothScrollTo = function (target, opts) {
    var center = opts && opts.block === 'center';
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (window.lenis) {
      var offset = -HEADER_OFFSET;
      if (el && center) {
        offset = -(window.innerHeight - el.getBoundingClientRect().height) / 2;
      }
      window.lenis.scrollTo(el || target, { offset: el ? offset : 0 });
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: center ? 'center' : 'start' });
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  };

  if (typeof Lenis === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Initialize Lenis with Nothing.gripe's signature inertial easing curve
  var lenis = new Lenis({
    lerp: false,
    duration: 1.15,
    easing: function (t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    },
    smoothWheel: true,
    syncTouch: false,
    anchors: { offset: -HEADER_OFFSET },
    prevent: function (node) {
      return !!(node.closest && node.closest('.modal-dialog, #source-modal, [data-lenis-prevent]'));
    }
  });
  window.lenis = lenis;

  // Freeze smooth scrolling when a modal or drawer is active
  var modalEl = document.getElementById('source-modal');
  if (modalEl) {
    new MutationObserver(function () {
      modalEl.classList.contains('open') ? lenis.stop() : lenis.start();
    }).observe(modalEl, { attributes: true, attributeFilter: ['class'] });
  }

  // Animation frame loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Intercept in-page anchor clicks for gliding smooth scroll
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    try {
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      window.smoothScrollTo(target);
      if (history.pushState) history.pushState(null, null, href);
    } catch (_) {}
  });

  // Dynamic Reading Progress Bar
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-line';
  progressBar.innerHTML = '<span class="scroll-progress-fill"></span>';
  document.body.appendChild(progressBar);
  var fillEl = progressBar.querySelector('.scroll-progress-fill');

  // Sticky Header state & scroll progress updater
  var header = document.querySelector('.top-utility');
  lenis.on('scroll', function (e) {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var progress = max > 0 ? Math.min(1, Math.max(0, e.scroll / max)) : 0;
    if (fillEl) fillEl.style.width = (progress * 100) + '%';
    if (header) header.classList.toggle('is-scrolled', e.scroll > 20);
  });

  // Reveal On Scroll (IntersectionObserver)
  window.initScrollReveals = function () {
    var revealEls = document.querySelectorAll('[data-reveal]');
    if (!revealEls.length) return;
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -2% 0px' });

    revealEls.forEach(function (el) {
      if (!el.classList.contains('is-visible')) {
        io.observe(el);
      }
    });

    // Staggered children setup
    document.querySelectorAll('[data-reveal="stagger"]').forEach(function (parent) {
      Array.from(parent.children).forEach(function (child, i) {
        child.style.setProperty('--i', i);
      });
    });
  };

  document.addEventListener('DOMContentLoaded', window.initScrollReveals);
})();

