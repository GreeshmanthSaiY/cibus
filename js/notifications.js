/**
 * CIBUS NOTIFICATION CENTER CONTROLLER
 * Session-scoped culinary activity feed, real-time alerts, and interactive bell drawer
 */

const NotificationCenter = {
  STORAGE_KEYS: {
    NOTIFICATIONS: 'cibus_session_notifications',
    UNREAD_COUNT: 'cibus_unread_notif_count'
  },

  defaultSeedNotifications: [
    {
      id: 'notif_welcome',
      title: 'Welcome to Cibus! 🎉',
      message: 'Explore authentic heritage recipes and culinary traditions across all 28 Indian States.',
      icon: '🍲',
      type: 'info',
      time: 'Just now',
      read: false,
      link: './food-menu.html'
    },
    {
      id: 'notif_winter',
      title: 'Winter Harvest Trending',
      message: 'Makki di Roti & Sarson da Saag is trending! Discover grandmother slow-simmer ratios.',
      icon: '🌾',
      type: 'recipe',
      time: '10m ago',
      read: false,
      link: './recipe-detail.html#makki'
    },
    {
      id: 'notif_spices',
      title: '6 Indigenous Botanicals',
      message: 'Learn about Kashmiri Mongra Saffron, Guntur Chillies, and Malabar Black Pepper.',
      icon: '🌶️',
      type: 'spice',
      time: '1h ago',
      read: true,
      link: './home.html#spices-heading'
    }
  ],

  init() {
    const isAuth = typeof AuthManager !== 'undefined' ? AuthManager.isAuthenticated() : true;
    if (isAuth) {
      this.ensureSeed();
    } else {
      this.save([]);
      this.setUnreadCount(0);
    }

    this.bindUI();
    this.updateBadge();
    this.renderList();

    // Listen to external auth or cart events to add automatic notifications
    window.addEventListener('cibus:auth:changed', (e) => {
      const user = e.detail?.user;
      if (user) {
        this.ensureSeed();
        this.updateBadge();
        this.renderList();
      } else {
        // User logged out: clear all notifications and badges immediately
        this.clearAll(true);
        const panel = document.getElementById('notif-panel');
        if (panel) {
          panel.style.display = 'none';
          panel.classList.remove('panel-active');
        }
        const bellBtn = document.getElementById('notif-bell-btn');
        if (bellBtn) {
          bellBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  },

  ensureSeed() {
    // Only seed notifications if user is currently authenticated
    const isAuth = typeof AuthManager !== 'undefined' ? AuthManager.isAuthenticated() : true;
    if (!isAuth) return;

    const existing = this.getAll();
    if (!existing || existing.length === 0) {
      this.save(this.defaultSeedNotifications);
      sessionStorage.setItem(this.STORAGE_KEYS.UNREAD_COUNT, '2');
    }
  },

  getAll() {
    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  },

  save(items) {
    try {
      sessionStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(items));
    } catch (_) {}
  },

  getUnreadCount() {
    const raw = sessionStorage.getItem(this.STORAGE_KEYS.UNREAD_COUNT);
    if (raw !== null) {
      return parseInt(raw, 10) || 0;
    }
    const all = this.getAll();
    return all.filter((n) => !n.read).length;
  },

  setUnreadCount(count) {
    const safeCount = Math.max(0, count);
    sessionStorage.setItem(this.STORAGE_KEYS.UNREAD_COUNT, String(safeCount));
    this.updateBadge();
  },

  /**
   * Add a new live culinary notification (only when authenticated)
   */
  add({ title, message, icon = '🍲', type = 'info', link = '' }) {
    const isAuth = typeof AuthManager !== 'undefined' ? AuthManager.isAuthenticated() : true;
    if (!isAuth) return;

    const all = this.getAll();
    const newNotif = {
      id: 'notif_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      title: String(title || 'Culinary Update'),
      message: String(message || ''),
      icon: String(icon || '🍲'),
      type: String(type || 'info'),
      time: 'Just now',
      read: false,
      link: link || ''
    };

    all.unshift(newNotif);
    // Keep maximum 30 notifications in session history
    if (all.length > 30) all.pop();
    this.save(all);

    this.setUnreadCount(this.getUnreadCount() + 1);
    this.renderList();

    // Subtle vibration on supported mobile devices
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([25, 40, 25]);
      } catch (_) {}
    }

    // Bounce bell icon
    const bellBtn = document.getElementById('notif-bell-btn');
    if (bellBtn) {
      bellBtn.classList.remove('bell-ring-active');
      void bellBtn.offsetWidth;
      bellBtn.classList.add('bell-ring-active');
      setTimeout(() => bellBtn.classList.remove('bell-ring-active'), 800);
    }
  },

  markAllAsRead(silent = false) {
    const all = this.getAll();
    all.forEach((n) => (n.read = true));
    this.save(all);
    this.setUnreadCount(0);
    this.renderList();
    if (!silent && typeof Utils !== 'undefined') {
      Utils.showToast('All notifications marked as read', 'info', 4000);
    }
  },

  clearAll(silent = false) {
    this.save([]);
    this.setUnreadCount(0);
    this.renderList();
    if (!silent && typeof Utils !== 'undefined') {
      Utils.showToast('Notification center cleared', 'info', 4000);
    }
  },

  markSingleAsRead(id) {
    const all = this.getAll();
    const item = all.find((n) => n.id === id);
    if (item && !item.read) {
      item.read = true;
      this.save(all);
      this.setUnreadCount(this.getUnreadCount() - 1);
      this.renderList();
    }
  },

  currentFilter: 'all',

  updateBadge() {
    const isAuth = typeof AuthManager !== 'undefined' ? AuthManager.isAuthenticated() : true;
    const count = isAuth ? this.getUnreadCount() : 0;
    const all = isAuth ? this.getAll() : [];
    const totalCount = all.length;
    const badges = document.querySelectorAll('.notification-badge, #notif-badge');
    const pill = document.getElementById('notif-count-pill');

    badges.forEach((b) => {
      if (count > 0 && isAuth) {
        b.textContent = count > 99 ? '99+' : count;
        b.style.display = 'inline-flex';
      } else {
        b.style.display = 'none';
      }
    });

    if (pill) {
      pill.textContent = count > 0 && isAuth ? `${count} New` : 'All Caught Up';
    }

    const allCounter = document.getElementById('notif-all-count');
    const unreadCounter = document.getElementById('notif-unread-count');
    if (allCounter) allCounter.textContent = isAuth ? totalCount : 0;
    if (unreadCounter) unreadCounter.textContent = isAuth ? count : 0;
  },

  renderList() {
    const list = document.getElementById('notif-list');
    if (!list) return;

    const isAuth = typeof AuthManager !== 'undefined' ? AuthManager.isAuthenticated() : true;
    const all = isAuth ? this.getAll() : [];

    if (!isAuth) {
      list.innerHTML = `
        <div class="notif-empty-state">
          <span class="notif-empty-icon">🔒</span>
          <h4>Sign In for Updates</h4>
          <p>Your regional recipe alerts, trending seasonal ingredients, and culinary updates are linked to your session account.</p>
          <a href="./login.html" class="btn btn-primary btn-sm" style="margin-top: 10px; display: inline-block;">Sign In &rarr;</a>
        </div>
      `;
      this.updateBadge();
      return;
    }

    if (all.length === 0) {
      list.innerHTML = `
        <div class="notif-empty-state">
          <span class="notif-empty-icon">✨</span>
          <h4>All Caught Up!</h4>
          <p>No new culinary updates at this moment. Explore our 28 State dishes or recipes to trigger alerts.</p>
        </div>
      `;
      this.updateBadge();
      return;
    }

    let itemsToDisplay = all;
    if (this.currentFilter === 'unread') {
      itemsToDisplay = all.filter((n) => !n.read);
    }

    if (itemsToDisplay.length === 0 && this.currentFilter === 'unread') {
      list.innerHTML = `
        <div class="notif-empty-state">
          <span class="notif-empty-icon">✓</span>
          <h4>No Unread Alerts</h4>
          <p>You have read all notifications. Switch to "All" to review previous updates.</p>
        </div>
      `;
      this.updateBadge();
      return;
    }

    list.innerHTML = itemsToDisplay
      .map(
        (n) => `
      <div class="notif-item ${n.read ? 'notif-read' : 'notif-unread'}" data-id="${Utils.escapeHtml(n.id)}" style="cursor: pointer;">
        <div class="notif-icon-col">
          <span class="notif-icon-pill">${Utils.escapeHtml(n.icon)}</span>
        </div>
        <div class="notif-content-col">
          <div class="notif-title-row">
            <h4 class="notif-title">${Utils.escapeHtml(n.title)}</h4>
            <span class="notif-time">${Utils.escapeHtml(n.time)}</span>
          </div>
          <p class="notif-msg">${Utils.escapeHtml(n.message)}</p>
          ${
            n.link
              ? `<a href="${Utils.escapeHtml(n.link)}" class="notif-link-action">View &rarr;</a>`
              : ''
          }
        </div>
      </div>
    `
      )
      .join('');

    this.updateBadge();
  },

  bindUI() {
    const bellBtn = document.getElementById('notif-bell-btn');
    const panel = document.getElementById('notif-panel');
    const markReadBtn = document.getElementById('notif-mark-read-btn');
    const clearBtn = document.getElementById('notif-clear-btn');

    if (panel) {
      // Inject filter bar if not present
      let filterBar = panel.querySelector('.notif-filter-bar');
      if (!filterBar) {
        filterBar = document.createElement('div');
        filterBar.className = 'notif-filter-bar';
        filterBar.innerHTML = `
          <button type="button" class="notif-filter-btn active" data-filter="all">All (<span id="notif-all-count">0</span>)</button>
          <button type="button" class="notif-filter-btn" data-filter="unread">Unread (<span id="notif-unread-count">0</span>)</button>
        `;
        const header = panel.querySelector('.notif-panel-header');
        if (header && header.nextSibling) {
          panel.insertBefore(filterBar, header.nextSibling);
        } else {
          panel.prepend(filterBar);
        }

        filterBar.addEventListener('click', (e) => {
          const btn = e.target.closest('.notif-filter-btn');
          if (!btn) return;
          const filter = btn.dataset.filter || 'all';
          this.currentFilter = filter;
          filterBar.querySelectorAll('.notif-filter-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          this.renderList();
        });
      }

      // Allow clicking individual items to mark read
      const list = panel.querySelector('.notif-list');
      if (list) {
        list.addEventListener('click', (e) => {
          const item = e.target.closest('.notif-item');
          if (item && !e.target.closest('a')) {
            const id = item.dataset.id;
            if (id) this.markSingleAsRead(id);
          }
        });
      }
    }

    if (bellBtn && panel) {
      bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = panel.style.display === 'none' || !panel.style.display;
        if (isHidden) {
          panel.style.display = 'flex';
          bellBtn.setAttribute('aria-expanded', 'true');
          panel.classList.add('panel-active');
        } else {
          panel.style.display = 'none';
          bellBtn.setAttribute('aria-expanded', 'false');
          panel.classList.remove('panel-active');
        }
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !bellBtn.contains(e.target)) {
          panel.style.display = 'none';
          bellBtn.setAttribute('aria-expanded', 'false');
          panel.classList.remove('panel-active');
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.style.display !== 'none') {
          panel.style.display = 'none';
          bellBtn.setAttribute('aria-expanded', 'false');
          panel.classList.remove('panel-active');
        }
      });
    }

    if (markReadBtn) {
      markReadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.markAllAsRead();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.clearAll();
      });
    }

    // Auto-open notification panel if ?openNotif=true in URL
    if (new URLSearchParams(window.location.search).get('openNotif') === 'true') {
      if (panel) {
        panel.style.display = 'flex';
        panel.classList.add('panel-active');
        if (bellBtn) bellBtn.setAttribute('aria-expanded', 'true');
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  NotificationCenter.init();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NotificationCenter };
}

