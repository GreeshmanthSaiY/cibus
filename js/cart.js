/**
 * CIBUS CART ENGINE
 * State manager for traditional food orders and favorites
 */

let _Storage = typeof StorageManager !== 'undefined' ? StorageManager : null;
if (!_Storage && typeof require !== 'undefined') {
  try {
    _Storage = require('./storage.js').StorageManager;
  } catch (e) {}
}

const CartEngine = {
  _cartKey: 'cibus_cart_v2',

  _getStorage() {
    if (typeof StorageManager !== 'undefined') return StorageManager;
    if (_Storage) return _Storage;
    throw new Error('StorageManager is not available');
  },

  /**
   * Get all validated items in cart
   * @returns {Array}
   */
  getItems() {
    const storage = this._getStorage();
    const raw = storage.get(this._cartKey, []);
    return storage.validateCartSchema(raw);
  },

  /**
   * Save items to storage and dispatch event
   * @param {Array} items
   */
  _saveItems(items) {
    const storage = this._getStorage();
    const sanitized = storage.validateCartSchema(items);
    storage.set(this._cartKey, sanitized);
    this._dispatchUpdate();
  },

  /**
   * Dispatch custom event for cross-component synchronisation
   */
  _dispatchUpdate() {
    const event = new CustomEvent('cibus:cart:updated', {
      detail: {
        count: this.getTotalCount(),
        subtotal: this.getSubtotal(),
        total: this.getGrandTotal()
      }
    });
    window.dispatchEvent(event);
  },

  /**
   * Add item to cart or increment its quantity if existing
   * @param {Object} item
   * @param {number} quantity
   * @returns {boolean}
   */
  addItem(item, quantity = 1) {
    if (!item || !item.id || !item.name) return false;
    const items = this.getItems();
    const existingIndex = items.findIndex((i) => i.id === item.id);

    const validQty = Math.max(1, Math.min(99, Math.floor(quantity)));
    const priceNum = Number(item.price) || 150;

    if (existingIndex > -1) {
      items[existingIndex].quantity = Math.min(99, items[existingIndex].quantity + validQty);
    } else {
      items.push({
        id: String(item.id),
        name: String(item.name),
        state: item.state || 'India',
        price: priceNum,
        quantity: validQty,
        image: item.image || ''
      });
    }

    this._saveItems(items);
    if (typeof Utils !== 'undefined') {
      Utils.showToast(`Added "${item.name}" to your cart!`, 'success');
    }
    return true;
  },

  /**
   * Remove item completely from cart
   * @param {string} itemId
   */
  removeItem(itemId) {
    const items = this.getItems().filter((i) => i.id !== itemId);
    this._saveItems(items);
    if (typeof Utils !== 'undefined') {
      Utils.showToast('Item removed from cart.', 'info');
    }
  },

  /**
   * Update quantity of an item
   * @param {string} itemId
   * @param {number} newQuantity
   */
  updateQuantity(itemId, newQuantity) {
    const qty = Math.floor(Number(newQuantity));
    if (qty <= 0) {
      this.removeItem(itemId);
      return;
    }
    const clampedQty = Math.min(99, qty);
    const items = this.getItems();
    const target = items.find((i) => i.id === itemId);
    if (target) {
      target.quantity = clampedQty;
      this._saveItems(items);
    }
  },

  /**
   * Clear all items
   */
  clearCart() {
    this._saveItems([]);
  },

  /**
   * Get total quantity of all items in cart
   * @returns {number}
   */
  getTotalCount() {
    return this.getItems().reduce((total, item) => total + item.quantity, 0);
  },

  /**
   * Calculate subtotal
   * @returns {number}
   */
  getSubtotal() {
    return this.getItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  /**
   * Calculate 5% GST
   * @returns {number}
   */
  getTax(taxRate = 0.05) {
    return Math.round(this.getSubtotal() * taxRate * 100) / 100;
  },

  /**
   * Calculate grand total
   * @returns {number}
   */
  getGrandTotal(taxRate = 0.05) {
    return Math.round((this.getSubtotal() + this.getTax(taxRate)) * 100) / 100;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CartEngine };
}
