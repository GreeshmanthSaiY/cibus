/**
 * CIBUS MAIN APPLICATION CONTROLLER
 * Global initialization, cart page rendering, and shared UI controllers
 */

const App = {
  init() {
    this.initCartPage();
    this.initHomeShowcase();
  },

  /**
   * If on cart.html, render the full cart table, totals, and quantity handlers
   */
  initCartPage() {
    const cartContainer = document.getElementById('cart-items-container');
    if (!cartContainer) return;

    const renderCartUI = () => {
      const items = CartEngine.getItems();
      const summarySubtotal = document.getElementById('cart-subtotal');
      const summaryTax = document.getElementById('cart-tax');
      const summaryTotal = document.getElementById('cart-grand-total');
      const emptyState = document.getElementById('cart-empty-state');
      const cartTableWrapper = document.getElementById('cart-table-wrapper');
      const summaryPanel = document.getElementById('order-summary-panel');

      if (items.length === 0) {
        if (cartTableWrapper) cartTableWrapper.style.display = 'none';
        if (summaryPanel) summaryPanel.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
      }

      if (cartTableWrapper) cartTableWrapper.style.display = 'block';
      if (summaryPanel) summaryPanel.style.display = 'block';
      if (emptyState) emptyState.style.display = 'none';

      // Render items
      cartContainer.innerHTML = items
        .map(
          (item) => `
        <div class="cart-item-row" data-id="${Utils.escapeHtml(item.id)}">
          <div class="cart-item-info">
            <img class="cart-item-thumb" src="${Utils.escapeHtml(item.image || '../public/assets/images/food-photo.jpeg')}" alt="${Utils.escapeHtml(item.name)}" onerror="this.src='../public/assets/images/food-photo.jpeg';">
            <div class="cart-item-details">
              <h4>${Utils.escapeHtml(item.name)}</h4>
              <small>${Utils.escapeHtml(item.state || 'Traditional')}</small>
            </div>
          </div>
          <div class="cart-item-price">${Utils.formatCurrency(item.price)}</div>
          <div>
            <div class="qty-control">
              <button type="button" class="qty-btn js-qty-decrease" aria-label="Decrease quantity" data-id="${Utils.escapeHtml(item.id)}">-</button>
              <input type="number" class="qty-input js-qty-field" value="${item.quantity}" min="1" max="99" data-id="${Utils.escapeHtml(item.id)}" aria-label="Item quantity">
              <button type="button" class="qty-btn js-qty-increase" aria-label="Increase quantity" data-id="${Utils.escapeHtml(item.id)}">+</button>
            </div>
          </div>
          <div class="cart-item-subtotal">${Utils.formatCurrency(item.price * item.quantity)}</div>
          <button type="button" class="cart-item-remove js-item-remove" data-id="${Utils.escapeHtml(item.id)}" title="Remove item" aria-label="Remove item">
            &times;
          </button>
        </div>
      `
        )
        .join('');

      // Update summary numbers
      if (summarySubtotal) summarySubtotal.textContent = Utils.formatCurrency(CartEngine.getSubtotal());
      if (summaryTax) summaryTax.textContent = Utils.formatCurrency(CartEngine.getTax());
      if (summaryTotal) summaryTotal.textContent = Utils.formatCurrency(CartEngine.getGrandTotal());
    };

    // Initial render
    renderCartUI();

    // Listen to updates
    window.addEventListener('cibus:cart:updated', renderCartUI);

    // Event delegation for cart actions
    cartContainer.addEventListener('click', (e) => {
      const decBtn = e.target.closest('.js-qty-decrease');
      const incBtn = e.target.closest('.js-qty-increase');
      const remBtn = e.target.closest('.js-item-remove');

      if (decBtn) {
        const id = decBtn.dataset.id;
        const currentItem = CartEngine.getItems().find((i) => i.id === id);
        if (currentItem) {
          CartEngine.updateQuantity(id, currentItem.quantity - 1);
        }
      } else if (incBtn) {
        const id = incBtn.dataset.id;
        const currentItem = CartEngine.getItems().find((i) => i.id === id);
        if (currentItem) {
          CartEngine.updateQuantity(id, currentItem.quantity + 1);
        }
      } else if (remBtn) {
        const id = remBtn.dataset.id;
        CartEngine.removeItem(id);
      }
    });

    // Handle manual input change
    cartContainer.addEventListener('change', (e) => {
      if (e.target.matches('.js-qty-field')) {
        const id = e.target.dataset.id;
        const val = parseInt(e.target.value, 10);
        CartEngine.updateQuantity(id, isNaN(val) ? 1 : val);
      }
    });

    // Clear cart button
    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your cart?')) {
          CartEngine.clearCart();
          Utils.showToast('Your cart has been cleared.', 'info');
        }
      });
    }

    // Checkout demo button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        Utils.showToast('Demo Checkout: Thank you! In this demo preview, orders are simulated.', 'success', 5000);
      });
    }
  },

  /**
   * Populate state cards on home page if present
   */
  async initHomeShowcase() {
    const statesContainer = document.getElementById('home-states-preview');
    if (!statesContainer) return;

    try {
      const res = await fetch('../data/states.json').catch(() => fetch('./data/states.json'));
      if (res && res.ok) {
        const states = await res.json();
        statesContainer.innerHTML = states
          .slice(0, 8)
          .map(
            (s) => `
          <div class="state-preview-card">
            <div class="state-preview-header">
              <span class="state-region-tag">${Utils.escapeHtml(s.region)} India</span>
            </div>
            <h3 class="state-name">${Utils.escapeHtml(s.name)}</h3>
            <p class="state-dish-highlight">Signature: ${Utils.escapeHtml(s.dish)}</p>
            <div style="margin-top: var(--space-md);">
              <a href="./recipe-detail.html#${Utils.escapeHtml(s.dishId)}" class="btn btn-outline btn-sm btn-block">
                View ${Utils.escapeHtml(s.dish)} Recipe &rarr;
              </a>
            </div>
          </div>
        `
          )
          .join('');
      }
    } catch (err) {
      console.warn('[Cibus Home] Could not load states preview:', err);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
