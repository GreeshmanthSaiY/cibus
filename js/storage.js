/**
 * CIBUS STORAGE MANAGER
 * Safe abstraction around browser LocalStorage with schema validation and error fallback
 */

const StorageManager = {
  /**
   * Determine if LocalStorage is available
   * @returns {boolean}
   */
  isAvailable() {
    try {
      const testKey = '__cibus_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Read and parse JSON from localStorage
   * @param {string} key
   * @param {*} defaultValue
   * @returns {*}
   */
  get(key, defaultValue = null) {
    if (!this.isAvailable()) return defaultValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch (err) {
      console.warn(`[Cibus Storage] Corrupted data under key "${key}". Resetting to default.`, err);
      this.remove(key);
      return defaultValue;
    }
  },

  /**
   * Serialize and write data to localStorage
   * @param {string} key
   * @param {*} value
   * @returns {boolean}
   */
  set(key, value) {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[Cibus Storage] Failed to write key "${key}". Quota exceeded or restricted.`, err);
      return false;
    }
  },

  /**
   * Remove item from storage
   * @param {string} key
   */
  remove(key) {
    if (!this.isAvailable()) return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      // Ignored
    }
  },

  /**
   * Validate and sanitize cart items from untrusted storage
   * @param {Array} rawCart
   * @returns {Array}
   */
  validateCartSchema(rawCart) {
    if (!Array.isArray(rawCart)) return [];
    return rawCart.filter((item) => {
      return (
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        item.id.length > 0 &&
        typeof item.name === 'string' &&
        item.name.length > 0 &&
        typeof item.price === 'number' &&
        !isNaN(item.price) &&
        item.price >= 0 &&
        typeof item.quantity === 'number' &&
        !isNaN(item.quantity) &&
        item.quantity >= 1
      );
    }).map((item) => ({
      id: String(item.id).slice(0, 50),
      name: String(item.name).slice(0, 100),
      state: typeof item.state === 'string' ? item.state.slice(0, 50) : 'India',
      price: Math.max(10, Math.min(10000, Number(item.price))),
      quantity: Math.max(1, Math.min(99, Math.floor(Number(item.quantity)))),
      image: typeof item.image === 'string' ? item.image : ''
    }));
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StorageManager };
}
