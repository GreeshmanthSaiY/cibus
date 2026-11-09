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

  updateBadge() {
    const isAuth = typeof AuthManager !== 'undefined' ? AuthManager.isAuthenticated() : true;
    const count = isAuth ? this.getUnreadCount() : 0;
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
  },

  renderList() {
    const list = document.getElementById('notif-list');
    if (!list) return;

    const isAuth = typeof AuthManager !== 'undefined' ? AuthManager.isAuthenticated() : true;
    const all = isAuth ? this.getAll() : [];
    if (all.length === 0) {
      list.innerHTML = `
        <div class="notif-empty-state">
          <span class="notif-empty-icon">🔕</span>
          <h4>No Notifications</h4>
          <p>${isAuth ? "You're all caught up! Real-time culinary alerts will appear here." : 'Please sign in to view your real-time culinary alerts and notifications.'}</p>
        </div>
      `;
      return;
    }

    list.innerHTML = all
      .map(
        (n) => `
      <div class="notif-item ${n.read ? 'notif-read' : 'notif-unread'}" data-id="${Utils.escapeHtml(n.id)}">
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
  },

  bindUI() {
    const bellBtn = document.getElementById('notif-bell-btn');
    const panel = document.getElementById('notif-panel');
    const markReadBtn = document.getElementById('notif-mark-read-btn');
    const clearBtn = document.getElementById('notif-clear-btn');

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
  }
};

document.addEventListener('DOMContentLoaded', () => {
  NotificationCenter.init();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NotificationCenter };
}

