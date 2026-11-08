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
   * Display accessible toast message
   * @param {string} message
   * @param {'success'|'error'|'info'} type
   * @param {number} durationMs
   */
  showToast(message, type = 'success', durationMs = 3500) {
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

    const iconMap = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };

    const iconSpan = document.createElement('span');
    iconSpan.style.fontWeight = 'bold';
    iconSpan.textContent = iconMap[type] || '•';

    const textSpan = document.createElement('span');
    textSpan.textContent = message;

    toast.appendChild(iconSpan);
    toast.appendChild(textSpan);
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, durationMs);
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
