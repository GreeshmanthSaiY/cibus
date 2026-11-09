/**
 * CIBUS UTILITIES & DOM HELPERS
 * Defensive sanitization, formatting, and notification bus
 */

const Utils = {
  /**
   * Escape raw HTML special characters to prevent DOM-based XSS
   * @param {string} str
   * @returns {string}
   */
  escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, (m) => map[m]);
  },

  /**
   * Format numbers into INR currency format
   * @param {number} amount
   * @returns {string}
   */
  formatCurrency(amount) {
    const num = Number(amount);
    if (isNaN(num)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(num);
  },

  /**
   * Truncate string to specified limit
   * @param {string} str
   * @param {number} max
   * @returns {string}
   */
  truncate(str, max = 80) {
    if (!str || typeof str !== 'string') return '';
    return str.length > max ? str.slice(0, max) + '...' : str;
  },

  /**
   * Display accessible toast message with 10-second lifetime, countdown progress bar, and pause-on-hover
   * @param {string|object} options Message string or config object
   * @param {'success'|'error'|'info'|'celebration'|'warning'} type
   * @param {number} durationMs Default 10000ms (10 seconds)
   */
  showToast(options, type = 'success', durationMs = 10000) {
    let message = '';
    let title = '';
    let icon = '';
    let actionLabel = '';
    let actionUrl = '';

    if (typeof options === 'object' && options !== null) {
      message = options.message || '';
      title = options.title || '';
      icon = options.icon || '';
      type = options.type || type;
      durationMs = options.durationMs ? Math.max(10000, options.durationMs) : durationMs;
      actionLabel = options.actionLabel || '';
      actionUrl = options.actionUrl || '';
    } else {
      message = String(options || '');
    }

    // Enforce 10-second standard toast duration per user requirement
    durationMs = Math.max(10000, durationMs || 10000);

    let container = document.getElementById('cibus-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'cibus-toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');

    const defaultIcons = {
      success: '✓',
      celebration: '🎉',
      error: '✕',
      warning: '⚠️',
      info: 'ℹ'
    };

    const displayIcon = icon || defaultIcons[type] || '🍲';

    toast.innerHTML = `
      <div class="toast-icon-wrap" aria-hidden="true">${displayIcon}</div>
      <div class="toast-body">
        ${title ? `<div class="toast-title">${this.escapeHtml(title)}</div>` : ''}
        <div class="toast-msg">${this.escapeHtml(message)}</div>
        ${actionLabel && actionUrl ? `<a href="${this.escapeHtml(actionUrl)}" class="toast-action-btn">${this.escapeHtml(actionLabel)} &rarr;</a>` : ''}
      </div>
      <button type="button" class="toast-close-btn" aria-label="Dismiss notification">&times;</button>
      <div class="toast-progress-bar" style="animation-duration: ${durationMs}ms;"></div>
    `;

    container.appendChild(toast);

    let remainingMs = durationMs;
    let timerId = null;
    let startTime = Date.now();

    const startTimer = () => {
      startTime = Date.now();
      timerId = setTimeout(dismissToast, remainingMs);
    };

    const pauseTimer = () => {
      clearTimeout(timerId);
      remainingMs -= Date.now() - startTime;
      const bar = toast.querySelector('.toast-progress-bar');
      if (bar) bar.style.animationPlayState = 'paused';
    };

    const resumeTimer = () => {
      const bar = toast.querySelector('.toast-progress-bar');
      if (bar) bar.style.animationPlayState = 'running';
      startTimer();
    };

    function dismissToast() {
      clearTimeout(timerId);
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px) scale(0.96)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 280);
    }

    toast.addEventListener('mouseenter', pauseTimer);
    toast.addEventListener('mouseleave', resumeTimer);

    const closeBtn = toast.querySelector('.toast-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissToast();
      });
    }

    startTimer();
  },

  /**
   * Debounce helper for search inputs
   * @param {Function} fn
   * @param {number} delay
   * @returns {Function}
   */
  debounce(fn, delay = 250) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Utils };
}
