/**
 * CIBUS NAVIGATION & UI CONTROLLER
 * Manages responsive navigation drawer, active link state, live cart counter badges,
 * and dynamic user authentication state in the header/mobile navigation.
 */

const NavigationManager = {
  init() {
    this.setupMobileDrawer();
    this.highlightActiveRoute();
    this.syncCartBadges();
    this.syncAuthState();
    this.setupBackToTop();
    this.setupScrollReveal();

    // Listen to live cart updates
    window.addEventListener('cibus:cart:updated', (e) => {
      this.updateCartBadgeCount(e.detail.count);
    });

    // Listen to dynamic auth state updates
    window.addEventListener('cibus:auth:changed', () => {
      this.syncAuthState();
    });

    // Close user dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const menu = document.getElementById('user-profile-menu');
      if (menu && !menu.contains(e.target)) {
        const panel = document.getElementById('user-dropdown-panel');
        const btn = document.getElementById('user-profile-btn');
        if (panel) panel.classList.remove('show');
        if (btn) btn.classList.remove('active');
      }
    });
  },

  /**
   * Synchronize Desktop and Mobile Header Auth UI based on current session
   */
  syncAuthState() {
    const user = typeof AuthManager !== 'undefined' ? AuthManager.getCurrentUser() : null;
    const navActions = document.querySelector('.site-nav .nav-actions');
    const mobileDrawer = document.querySelector('.mobile-drawer');

    // 1. Sync Desktop Header Actions
    if (navActions) {
      // Find or create container for auth buttons / profile pill
      let authContainer = document.getElementById('nav-auth-container');
      if (!authContainer) {
        authContainer = document.createElement('div');
        authContainer.id = 'nav-auth-container';
        authContainer.style.display = 'inline-flex';
        authContainer.style.alignItems = 'center';
        // Insert right before the mobile toggle button
        const mobileToggle = navActions.querySelector('.mobile-nav-toggle');
        if (mobileToggle) {
          navActions.insertBefore(authContainer, mobileToggle);
        } else {
          navActions.appendChild(authContainer);
        }
      }

      // Remove any static Sign In / Sign Up buttons that might exist in navActions
      navActions.querySelectorAll(':scope > .btn').forEach((btn) => btn.remove());

      if (user && user.name) {
        // Authenticated: Render Profile Pill & Dropdown
        const nameParts = user.name.trim().split(/\s+/);
        const firstName = nameParts[0] || 'User';
        const initials = nameParts.length > 1
          ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
          : firstName.slice(0, 2).toUpperCase();

        authContainer.innerHTML = `
          <div class="user-profile-menu" id="user-profile-menu">
            <button type="button" class="user-profile-pill" id="user-profile-btn" aria-expanded="false" aria-haspopup="true">
              <span class="user-avatar-initials">${Utils.escapeHtml(initials)}</span>
              <span class="user-display-name">${Utils.escapeHtml(firstName)}</span>
              <svg class="chevron-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </button>
            <div class="user-dropdown-panel" id="user-dropdown-panel" role="menu">
              <div class="dropdown-user-header">
                <span class="dropdown-user-badge">🟢 Active Session</span>
                <h4 class="dropdown-user-name">${Utils.escapeHtml(user.name)}</h4>
                <p class="dropdown-user-email">${Utils.escapeHtml(user.email)}</p>
              </div>
              <div class="dropdown-session-notice">
                <span>🔒</span>
                <small>Session active until browser exit. Data persists on hard refresh (Ctrl+F5).</small>
              </div>
              <div class="dropdown-divider"></div>
              <button type="button" class="dropdown-item-btn" id="profile-reset-pass-btn">
                <span>🔑</span>
                <span>Reset Password</span>
              </button>
              <a href="./cart.html" class="dropdown-item-btn">
                <span>🛒</span>
                <span>My Cart &amp; Orders</span>
              </a>
              <div class="dropdown-divider"></div>
              <button type="button" class="dropdown-item-btn text-danger" id="profile-logout-btn">
                <span>🚪</span>
                <span>Sign Out / Logout</span>
              </button>
            </div>
          </div>
        `;

        // Wire dropdown toggle
        const profileBtn = document.getElementById('user-profile-btn');
        const panel = document.getElementById('user-dropdown-panel');
        if (profileBtn && panel) {
          profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = panel.classList.contains('show');
            panel.classList.toggle('show', !isOpen);
            profileBtn.classList.toggle('active', !isOpen);
            profileBtn.setAttribute('aria-expanded', String(!isOpen));
          });
        }

        // Wire Logout
        const logoutBtn = document.getElementById('profile-logout-btn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', () => {
            if (panel) panel.classList.remove('show');
            if (profileBtn) profileBtn.classList.remove('active');

            if (typeof CartEngine !== 'undefined' && CartEngine) {
              CartEngine.clearCart();
            }

            if (typeof NotificationCenter !== 'undefined' && NotificationCenter) {
              NotificationCenter.clearAll(true);
            }

            AuthManager.logout();
            this.updateCartBadgeCount(0);
          });
        }

        // Wire Reset Password
        const resetBtn = document.getElementById('profile-reset-pass-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            if (panel) panel.classList.remove('show');
            this.openResetPasswordModal(user.email);
          });
        }
      } else {
        // Not authenticated: Render Sign In and Sign Up buttons
        const isLanding = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || !window.location.pathname.includes('/pages/');
        const loginUrl = isLanding ? 'pages/login.html' : './login.html';
        const registerUrl = isLanding ? 'pages/register.html' : './register.html';

        authContainer.innerHTML = `
          <a href="${loginUrl}" class="btn btn-outline btn-sm" style="margin-right: 6px; border-radius: 9999px;">Sign In</a>
          <a href="${registerUrl}" class="btn btn-primary btn-sm" style="border-radius: 9999px;">Sign Up</a>
        `;
      }
    }

    // 2. Sync Mobile Drawer
    if (mobileDrawer) {
      let drawerAuthSection = document.getElementById('mobile-drawer-auth');
      if (!drawerAuthSection) {
        drawerAuthSection = document.createElement('div');
        drawerAuthSection.id = 'mobile-drawer-auth';
        drawerAuthSection.className = 'drawer-account-section';
        const body = mobileDrawer.querySelector('.mobile-drawer-body') || mobileDrawer;
        body.appendChild(drawerAuthSection);
      }

      // Remove old hardcoded mobile login/register buttons if present
      mobileDrawer.querySelectorAll(':scope > .btn-outline, :scope > .btn-primary, :scope > hr').forEach((b) => b.remove());

      const isLanding = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || !window.location.pathname.includes('/pages/');
      const loginUrl = isLanding ? 'pages/login.html' : './login.html';
      const registerUrl = isLanding ? 'pages/register.html' : './register.html';

      if (user && user.name) {
        drawerAuthSection.innerHTML = `
          <div class="drawer-account-card logged-in">
            <div class="drawer-account-header">
              <div class="drawer-account-avatar active">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div class="drawer-account-info">
                <div class="drawer-status-pill">
                  <span class="status-indicator-dot"></span>
                  <span>ACTIVE CIBUS MEMBER</span>
                </div>
                <div class="drawer-user-name">${Utils.escapeHtml(user.name)}</div>
                <div class="drawer-user-email">${Utils.escapeHtml(user.email)}</div>
              </div>
            </div>
            <div class="drawer-account-actions session-actions">
              <button type="button" class="btn-drawer-secondary btn-sm" id="mobile-reset-pass-btn">
                <span>🔑 Reset Password</span>
              </button>
              <button type="button" class="btn-drawer-danger btn-sm" id="mobile-logout-btn">
                <span>🚪 Sign Out</span>
              </button>
            </div>
          </div>
        `;

        const mobileLogout = document.getElementById('mobile-logout-btn');
        if (mobileLogout) {
          mobileLogout.addEventListener('click', () => {
            if (typeof CartEngine !== 'undefined' && CartEngine) {
              CartEngine.clearCart();
            }

            if (typeof NotificationCenter !== 'undefined' && NotificationCenter) {
              NotificationCenter.clearAll(true);
            }

            AuthManager.logout();
            this.updateCartBadgeCount(0);
          });
        }

        const mobileReset = document.getElementById('mobile-reset-pass-btn');
        if (mobileReset) {
          mobileReset.addEventListener('click', () => {
            this.openResetPasswordModal(user.email);
          });
        }
      } else {
        drawerAuthSection.innerHTML = `
          <div class="drawer-account-card">
            <div class="drawer-account-header">
              <div class="drawer-account-avatar">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div class="drawer-account-info">
                <span class="drawer-account-eyebrow">CULINARY MEMBERSHIP</span>
                <span class="drawer-account-title">Personal Spice Box &amp; Favorites</span>
              </div>
            </div>
            <div class="drawer-account-actions">
              <a href="${registerUrl}" class="btn-drawer-primary">
                <span>Create Free Account</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
              <a href="${loginUrl}" class="btn-drawer-secondary">
                <span>Sign In to Account</span>
              </a>
            </div>
          </div>
        `;
      }
    }
  },

  /**
   * Modal dialog to reset account password while logged in or from profile
   * @param {string} prefillEmail
   */
  openResetPasswordModal(prefillEmail = '') {
    // Remove existing modal if any
    const existing = document.getElementById('cibus-reset-modal');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'cibus-reset-modal';
    backdrop.className = 'cibus-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');

    backdrop.innerHTML = `
      <div class="cibus-modal-card">
        <div class="cibus-modal-header">
          <h3>🔑 Reset Password</h3>
          <button type="button" class="cibus-modal-close-btn" id="modal-close-btn" aria-label="Close dialog">&times;</button>
        </div>
        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: var(--space-md);">
          Update your account password for this browser session. Data persists until you close the browser.
        </p>
        <form id="modal-reset-form" novalidate>
          <div class="form-group">
            <label for="modal-reset-email" class="form-label">Account Email</label>
            <input type="email" id="modal-reset-email" class="form-control" value="${Utils.escapeHtml(prefillEmail)}" ${prefillEmail ? 'readonly style="background: #F5EBE1;"' : 'required'}>
          </div>
          <div class="form-group">
            <label for="modal-new-pass" class="form-label">New Password</label>
            <input type="password" id="modal-new-pass" class="form-control" placeholder="Min 8 chars, 1 uppercase, 1 digit" required>
          </div>
          <div class="form-group">
            <label for="modal-confirm-pass" class="form-label">Confirm New Password</label>
            <input type="password" id="modal-confirm-pass" class="form-control" placeholder="Re-type new password" required>
          </div>
          <div style="display: flex; gap: 10px; margin-top: var(--space-lg);">
            <button type="submit" class="btn btn-primary btn-block" style="flex: 2;">Save Password &rarr;</button>
            <button type="button" id="modal-cancel-btn" class="btn btn-outline" style="flex: 1;">Cancel</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(backdrop);

    const close = () => backdrop.remove();
    document.getElementById('modal-close-btn').addEventListener('click', close);
    document.getElementById('modal-cancel-btn').addEventListener('click', close);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });

    const form = document.getElementById('modal-reset-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('modal-reset-email').value.trim();
      const p1 = document.getElementById('modal-new-pass');
      const p2 = document.getElementById('modal-confirm-pass');

      const check = FormValidator.validatePassword(p1.value);
      if (!check.isValid) {
        FormValidator.showError(p1, check.message);
        return;
      }
      FormValidator.clearError(p1);

      if (p1.value !== p2.value) {
        FormValidator.showError(p2, 'Passwords do not match.');
        return;
      }
      FormValidator.clearError(p2);

      const res = AuthManager.resetPassword(email, p1.value);
      if (!res.success) {
        Utils.showToast(res.message, 'error');
        return;
      }

      Utils.showToast(res.message, 'success', 5000);
      close();
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
      btn.setAttribute('aria-hidden', 'true');
      btn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22" fill="currentColor"><path d="M12 4l-7 7h4v9h6v-9h4z"/></svg>`;
      document.body.appendChild(btn);
    }

    const setVisibility = (visible) => {
      btn.classList.toggle('visible', visible);
      btn.classList.toggle('is-visible', visible);
      btn.setAttribute('aria-hidden', String(!visible));
    };

    // Hero boundary detection via IntersectionObserver
    const heroSelectors = [
      '.hero-showcase',
      '.landing-header',
      '.landing-inner-header',
      '.food-menu-header',
      '.section-title-wrap',
      '.cart-header-section',
      '.contact-header',
      '.auth-card',
      'main > .container > section:first-child'
    ];
    const hero = document.querySelector(heroSelectors.join(', '));

    if ('IntersectionObserver' in window && hero) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // When hero is past the viewport in the scroll direction, show button
            const pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
            setVisibility(pastHero);
          });
        },
        { threshold: 0, rootMargin: '0px 0px 0px 0px' }
      );
      observer.observe(hero);
    } else {
      const checkScroll = () => {
        const threshold = hero ? Math.max(180, hero.offsetTop + hero.offsetHeight * 0.6) : 250;
        setVisibility(window.scrollY > threshold);
      };
      window.addEventListener('scroll', checkScroll, { passive: true });
    }

    // Smooth scroll to top on click with reduced-motion awareness
    btn.addEventListener('click', () => {
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? 'auto' : 'smooth'
      });
      // Move keyboard focus back to top of document for screen readers
      const focusTarget = document.querySelector('header a, .brand-logo, .landing-nav-brand, h1');
      if (focusTarget && typeof focusTarget.focus === 'function') {
        focusTarget.focus({ preventScroll: true });
      }
    });
  },

  setupMobileDrawer() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle, .landing-nav-toggle');
    const drawer = document.querySelector('.mobile-drawer, .landing-mobile-drawer');
    if (!toggleBtn || !drawer) return;

    const closeBtn = drawer.querySelector('.drawer-close-btn');
    const backdrop = drawer.querySelector('.mobile-drawer-backdrop');

    const closeDrawer = () => {
      toggleBtn.classList.remove('open');
      drawer.classList.remove('open');
      drawer.classList.remove('instant-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      toggleBtn.focus();
    };

    const openDrawer = (instant = false) => {
      if (instant) {
        drawer.classList.add('instant-open');
      }

      toggleBtn.classList.add('open');
      drawer.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const firstFocusable = drawer.querySelector('.drawer-close-btn, a, button');
      if (firstFocusable && !instant) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    };

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDrawer();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDrawer();
      });
    }

    // Close drawer when clicking any link inside
    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeDrawer();
      }
    });

    // Close drawer on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Auto-close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('openMenu') === 'true') {
        openDrawer(true);
      }
    } catch (_) {}
  },

  highlightActiveRoute() {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link, .drawer-nav-item');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const cleanHref = href.replace(/^\.\//, '').toLowerCase();

      const isMatch = (currentPath.endsWith(cleanHref) && cleanHref !== '') ||
        (cleanHref.includes('home') && (currentPath.endsWith('/') || currentPath.endsWith('home.html') || currentPath.endsWith('index.html'))) ||
        (cleanHref.includes('food-menu') && currentPath.includes('food-menu')) ||
        (cleanHref.includes('recipe-cards') && (currentPath.includes('recipe-cards') || currentPath.includes('recipe-detail'))) ||
        (cleanHref.includes('cart') && currentPath.includes('cart')) ||
        (cleanHref.includes('contact') && currentPath.includes('contact')) ||
        (cleanHref.includes('login') && currentPath.includes('login')) ||
        (cleanHref.includes('register') && currentPath.includes('register'));

      if (isMatch) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
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
  },

  setupScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }
};

document.addEventListener('DOMContentLoaded', () => {
  NavigationManager.init();
});
