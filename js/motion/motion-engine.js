/**
 * CIBUS MOTION ENGINE
 * High-performance, centralized motion coordinator.
 * Handles scroll-triggered reveals, page transitions, tactile micro-interactions,
 * and WCAG-compliant reduced-motion enforcement.
 */

(function () {
  'use strict';

  const MotionEngine = {
    isReducedMotion: false,
    observer: null,

    init() {
      // 1. Accessibility Check: prefers-reduced-motion
      this.checkReducedMotion();

      // 2. Mark HTML as JavaScript-ready for safe CSS staging
      document.documentElement.classList.add('js-ready');

      // 3. If user requested reduced motion, reveal everything immediately and skip motion hooks
      if (this.isReducedMotion) {
        this.revealAllImmediately();
        return;
      }

      // 4. Initialize Core Motion Subsystems
      this.initScrollReveals();
      this.initPageTransitions();
      this.initMicroInteractions();
      this.initRecipeInteractivity();
    },

    /**
     * Inspects system accessibility settings for motion reduction
     */
    checkReducedMotion() {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.isReducedMotion = !!(mediaQuery && mediaQuery.matches);

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', (e) => {
          this.isReducedMotion = e.matches;
          if (this.isReducedMotion) {
            this.revealAllImmediately();
          }
        });
      }
    },

    /**
     * Fallback and accessibility handler: instantly displays all elements
     */
    revealAllImmediately() {
      const targets = document.querySelectorAll(
        '[data-motion], .reveal, .quote-banner, .spice-trail-section, .philosophy-section, .site-footer'
      );
      targets.forEach((el) => {
        el.setAttribute('data-motion-revealed', 'true');
        el.classList.add('revealed');
      });
    },

    /**
     * Viewport-triggered scroll reveals via IntersectionObserver
     */
    initScrollReveals() {
      if (!('IntersectionObserver' in window)) {
        this.revealAllImmediately();
        return;
      }

      const observerOptions = {
        threshold: 0,
        rootMargin: '120px 0px 120px 0px'
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            target.setAttribute('data-motion-revealed', 'true');
            target.classList.add('revealed');

            // Once revealed, unobserve by default to prevent jarring resets on minor scroll
            this.observer.unobserve(target);
          }
        });
      }, observerOptions);

      // Collect discrete motion targets (never hide large layout wrappers)
      const selector = [
        '[data-motion]',
        '.reveal',
        '.quote-banner',
        '.spice-trail-section',
        '.philosophy-section',
        '.site-footer',
        '.auth-card'
      ].join(', ');

      const elements = document.querySelectorAll(selector);

      // Immediately reveal any target matching the active hash or already in/near the initial viewport
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const hash = window.location.hash ? window.location.hash.slice(1) : null;
      if (hash) {
        const hashEl = document.getElementById(hash);
        if (hashEl) {
          let node = hashEl;
          while (node && node !== document.body) {
            node.setAttribute('data-motion-revealed', 'true');
            node.classList.add('revealed');
            node = node.parentElement;
          }
        }
      }

      elements.forEach((el) => {
        // Automatically inject --stagger-idx variables onto direct card/item children
        this.applyChildStaggerMetrics(el);

        const rect = el.getBoundingClientRect();
        if (rect.top <= vh + 120 && rect.bottom >= -120) {
          el.setAttribute('data-motion-revealed', 'true');
          el.classList.add('revealed');
        } else {
          this.observer.observe(el);
        }
      });
    },

    /**
     * Sets --stagger-idx on child items for hardware-accelerated CSS staggers
     */
    applyChildStaggerMetrics(container) {
      const childSelectors = [
        '.food-card',
        '.recipe-card',
        '.state-preview-card',
        '.spice-card',
        '.feature-box',
        '.footer-col',
        '.instruction-step',
        '.ingredient-item',
        '.contact-card'
      ];
      
      const children = container.querySelectorAll(childSelectors.join(', '));
      if (children.length > 0) {
        children.forEach((child, idx) => {
          child.style.setProperty('--stagger-idx', idx);
          child.setAttribute('data-motion-child', 'true');
        });
      }
    },

    /**
     * Seamless Page Navigation Transitions
     * Respects multi-page architecture, standard browser history, and bfcache.
     */
    initPageTransitions() {
      document.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (!link) return;

        // Skip non-standard clicks (new tab, middle click, modified keys)
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        const href = link.getAttribute('href');
        if (!href) return;

        // Skip anchors, mailto, tel, javascript, or external links
        if (
          href.startsWith('#') ||
          href.startsWith('mailto:') ||
          href.startsWith('tel:') ||
          href.startsWith('javascript:') ||
          link.getAttribute('target') === '_blank' ||
          link.hasAttribute('download')
        ) {
          return;
        }

        // Check if internal link
        const targetUrl = new URL(link.href, window.location.href);
        if (targetUrl.origin !== window.location.origin) {
          return; // External site
        }

        // Same page anchor jump check
        if (
          targetUrl.pathname === window.location.pathname &&
          targetUrl.search === window.location.search &&
          targetUrl.hash
        ) {
          return;
        }

        // Apply subtle leaving state without blocking native browser navigation
        document.body.classList.add('page-is-leaving');
      });

      // bfcache handler: ensures back/forward browser navigation never gets stuck in leaving state
      window.addEventListener('pageshow', (event) => {
        document.body.classList.remove('page-is-leaving');
      });
    },

    /**
     * Micro-Interactions across UI controls
     */
    initMicroInteractions() {
      // Tactile button presses
      document.addEventListener('pointerdown', (e) => {
        const btn = e.target.closest('.btn, .stepper-btn, .cart-stepper-btn, .filter-pill, .home-filter-pill');
        if (btn) {
          btn.style.transform = 'scale(0.96)';
        }
      });

      document.addEventListener('pointerup', (e) => {
        const btn = e.target.closest('.btn, .stepper-btn, .cart-stepper-btn, .filter-pill, .home-filter-pill');
        if (btn) {
          btn.style.transform = '';
        }
      });

      // Favorite heart micro-interaction
      document.addEventListener('click', (e) => {
        const heartBtn = e.target.closest('.heart-btn, .btn-favorite');
        if (heartBtn) {
          heartBtn.classList.remove('favorite-pop');
          void heartBtn.offsetWidth; // Reflow for restart
          heartBtn.classList.add('favorite-pop');
        }
      });

      // Notification bell greeting wiggle (after 1.2s on initial page arrival)
      const bell = document.getElementById('notif-bell-btn');
      if (bell) {
        setTimeout(() => {
          bell.classList.add('bell-ring-active');
          setTimeout(() => bell.classList.remove('bell-ring-active'), 900);
        }, 1200);
      }
    },

    /**
     * Interactive Recipe Kitchen Guide (recipe-detail.html)
     * Checkboxes trigger sound/visual celebration and update progress bar fluidly.
     */
    initRecipeInteractivity() {
      const recipeContainer = document.querySelector('.recipe-detail-container, .recipe-content-grid');
      if (!recipeContainer) return;

      const updateProgress = () => {
        const total = document.querySelectorAll('.ingredient-checkbox').length;
        const checked = document.querySelectorAll('.ingredient-checkbox:checked').length;
        const progressBar = document.querySelector('.recipe-progress-fill');
        const progressText = document.querySelector('.recipe-progress-text');

        if (total > 0 && progressBar) {
          const pct = Math.round((checked / total) * 100);
          progressBar.style.width = `${pct}%`;
          if (progressText) {
            progressText.textContent = `${checked} of ${total} ingredients checked (${pct}%)`;
          }
        }
      };

      document.addEventListener('change', (e) => {
        if (e.target.classList.contains('ingredient-checkbox')) {
          const item = e.target.closest('.ingredient-item');
          if (item) {
            if (e.target.checked) {
              item.classList.add('is-completed');
            } else {
              item.classList.remove('is-completed');
            }
          }
          updateProgress();
        }
      });

      // Initial progress calculation
      updateProgress();
    }
  };

  // Expose globally and auto-init on DOMContentLoaded
  window.MotionEngine = MotionEngine;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MotionEngine.init());
  } else {
    MotionEngine.init();
  }
})();

