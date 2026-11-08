/**
 * CIBUS NAVIGATION & UI CONTROLLER
 * Manages responsive navigation drawer, active link state, and live cart counter badges
 */

const NavigationManager = {
  init() {
    this.setupMobileDrawer();
    this.highlightActiveRoute();
    this.syncCartBadges();
    this.setupBackToTop();

    // Listen to cart update events
    window.addEventListener('cibus:cart:updated', (e) => {
      this.updateCartBadgeCount(e.detail.count);
    });
  },

  setupBackToTop() {
    let btn = document.getElementById('back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'back-to-top';
      btn.className = 'back-to-top-btn';
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-label', 'Back to top of page');
      btn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l-7 7h4v9h6v-9h4z"/></svg>`;
      document.body.appendChild(btn);
    }

    const checkScroll = () => {
      if (window.scrollY > 250) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  setupMobileDrawer() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      toggleBtn.classList.toggle('open', !isOpen);
      drawer.classList.toggle('open', !isOpen);
      toggleBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close drawer when any mobile link is clicked
    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('open');
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  },

  highlightActiveRoute() {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const cleanHref = href.replace(/^\.\//, '').toLowerCase();

      if (
        (currentPath.endsWith(cleanHref) && cleanHref !== '') ||
        (currentPath.endsWith('/') && cleanHref === 'home.html') ||
        (currentPath.endsWith('index.html') && cleanHref === 'home.html')
      ) {
        link.classList.add('active');
      }
    });
  },

  syncCartBadges() {
    if (typeof CartEngine !== 'undefined') {
      const count = CartEngine.getTotalCount();
      this.updateCartBadgeCount(count);
    }
  },

  updateCartBadgeCount(count) {
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach((badge) => {
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = count > 0 ? 'flex' : 'none';
      badge.classList.remove('bump');
      void badge.offsetWidth; // Trigger reflow for animation restart
      badge.classList.add('bump');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  NavigationManager.init();
});
