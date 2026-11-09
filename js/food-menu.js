/**
 * CIBUS FOOD MENU CONTROLLER
 * Dynamic filtering, real-time search, region filtering, and cart integration
 */

const FoodMenuController = {
  foodItems: [],
  activeFilter: 'all',
  searchQuery: '',

  async init() {
    await this.loadData();
    this.setupListeners();
    this.render();

    // Dynamically synchronize card button states with cart updates across windows/tabs
    window.addEventListener('cibus:cart:updated', () => {
      this.syncCardButtons();
    });

    window.addEventListener('cibus:auth:changed', () => {
      this.syncCardButtons();
    });
  },

  async loadData() {
    try {
      // First try relative path from /pages/
      const res = await fetch('../data/food-items.json');
      if (res.ok) {
        this.foodItems = await res.json();
      } else {
        throw new Error('Fallback to root data path');
      }
    } catch (e) {
      try {
        const fallbackRes = await fetch('./data/food-items.json');
        if (fallbackRes.ok) {
          this.foodItems = await fallbackRes.json();
        }
      } catch (err) {
        console.error('[Cibus FoodMenu] Failed to load food items dataset:', err);
      }
    }
  },

  setupListeners() {
    const searchInput = document.getElementById('food-search-input');
    if (searchInput) {
      searchInput.addEventListener(
        'input',
        Utils.debounce((e) => {
          this.searchQuery = e.target.value.trim().toLowerCase();
          this.render();
        }, 200)
      );
    }

    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        filterPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeFilter = pill.dataset.filter || 'all';
        this.render();
      });
    });

    // Delegated click handler for "Add to Cart", stepper increment, and decrement
    const grid = document.getElementById('food-menu-grid');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.js-add-cart-btn');
        const incBtn = e.target.closest('.js-cart-increment');
        const decBtn = e.target.closest('.js-cart-decrement');
        const viewBtn = e.target.closest('.js-cart-view');

        // Check auth guard before any cart modification
        const requireAuth = () => {
          if (typeof AuthManager !== 'undefined' && !AuthManager.isAuthenticated()) {
            Utils.showToast({
              title: 'Sign In Required 🔒',
              message: 'Please sign in to your session account to add items to your cart!',
              icon: '👤',
              type: 'warning',
              durationMs: 10000,
              actionLabel: 'Sign In Now',
              actionUrl: './login.html?redirect=food-menu.html'
            });
            setTimeout(() => {
              window.location.href = `./login.html?redirect=${encodeURIComponent(window.location.pathname.split('/').pop())}`;
            }, 1200);
            return false;
          }
          return true;
        };

        if (addBtn) {
          if (!requireAuth()) return;
          const itemId = addBtn.dataset.id;
          const item = this.foodItems.find((f) => f.id === itemId);
          if (item && typeof CartEngine !== 'undefined') {
            CartEngine.addItem(item, 1);

            // Trigger celebration burst & flight pill
            if (typeof CelebrationFx !== 'undefined') {
              CelebrationFx.burstFromElement(addBtn, item.name);
            }

            // Push notification to center
            if (typeof NotificationCenter !== 'undefined') {
              NotificationCenter.add({
                title: 'Celebration! Dish Added 🎉',
                message: `1x ${item.name} from ${item.state} (${Utils.formatCurrency(item.price)}) is now in your cart.`,
                icon: '🍲',
                type: 'cart',
                link: './cart.html'
              });
            }

            // Rich 10-second notification
            Utils.showToast({
              title: 'Added to Cart! 🎉',
              message: `1x ${item.name} (${Utils.formatCurrency(item.price)}) added to order.`,
              icon: '🍲',
              type: 'celebration',
              durationMs: 10000,
              actionLabel: 'View Cart 🛒',
              actionUrl: './cart.html'
            });

            this.syncCardButtons();
          }
        } else if (incBtn) {
          if (!requireAuth()) return;
          const itemId = incBtn.dataset.id;
          const item = this.foodItems.find((f) => f.id === itemId);
          if (item && typeof CartEngine !== 'undefined') {
            const inCart = CartEngine.getItems().find((i) => i.id === itemId);
            const nextQty = (inCart ? inCart.quantity : 0) + 1;
            CartEngine.updateQuantity(itemId, nextQty);

            if (typeof CelebrationFx !== 'undefined') {
              CelebrationFx.burstFromElement(incBtn, item.name);
            }

            Utils.showToast({
              title: 'Quantity Updated 🛒',
              message: `${item.name} quantity increased to ${nextQty}.`,
              icon: '➕',
              type: 'info',
              durationMs: 10000
            });

            this.syncCardButtons();
          }
        } else if (decBtn) {
          if (!requireAuth()) return;
          const itemId = decBtn.dataset.id;
          const item = this.foodItems.find((f) => f.id === itemId);
          if (item && typeof CartEngine !== 'undefined') {
            const inCart = CartEngine.getItems().find((i) => i.id === itemId);
            const currentQty = inCart ? inCart.quantity : 1;
            const nextQty = currentQty - 1;

            if (nextQty <= 0) {
              CartEngine.removeItem(itemId);
              Utils.showToast({
                title: 'Item Removed',
                message: `${item.name} removed from your cart.`,
                icon: '🗑️',
                type: 'info',
                durationMs: 10000
              });
            } else {
              CartEngine.updateQuantity(itemId, nextQty);
              Utils.showToast({
                title: 'Quantity Updated',
                message: `${item.name} quantity decreased to ${nextQty}.`,
                icon: '➖',
                type: 'info',
                durationMs: 10000
              });
            }

            this.syncCardButtons();
          }
        } else if (viewBtn) {
          window.location.href = './cart.html';
        }
      });
    }
  },

  getFilteredItems() {
    return this.foodItems.filter((item) => {
      // Region / Category filter
      const matchesFilter =
        this.activeFilter === 'all' ||
        (item.region && item.region.toLowerCase() === this.activeFilter.toLowerCase()) ||
        (item.diet && item.diet.toLowerCase() === this.activeFilter.toLowerCase());

      // Search query filter
      const matchesSearch =
        !this.searchQuery ||
        item.name.toLowerCase().includes(this.searchQuery) ||
        item.state.toLowerCase().includes(this.searchQuery) ||
        item.category.toLowerCase().includes(this.searchQuery) ||
        item.description.toLowerCase().includes(this.searchQuery);

      return matchesFilter && matchesSearch;
    });
  },

  render() {
    const grid = document.getElementById('food-menu-grid');
    const countDisplay = document.getElementById('food-results-count');
    if (!grid) return;

    const items = this.getFilteredItems();

    if (countDisplay) {
      countDisplay.textContent = `Showing ${items.length} authentic dishes across Indian states`;
    }

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <span class="empty-state-icon">🍲</span>
          <h3>No Dishes Found</h3>
          <p>We couldn't find any regional dishes matching "${Utils.escapeHtml(this.searchQuery)}". Try another search or filter.</p>
          <button class="btn btn-outline" onclick="document.getElementById('food-search-input').value=''; FoodMenuController.searchQuery=''; FoodMenuController.render();">Reset Search</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = items
      .map((item, index) => {
        const dietClass =
          item.diet === 'Vegetarian'
            ? 'diet-veg'
            : item.diet === 'Vegan'
            ? 'diet-vegan'
            : 'diet-nonveg';

        return `
        <article class="card food-card" data-id="${Utils.escapeHtml(item.id)}" style="animation: fadeInUp 0.35s ease ${(index % 12) * 0.03}s both;">
          <div class="card-img-wrap">
            <img src="${Utils.escapeHtml(item.image)}" alt="${Utils.escapeHtml(item.name)}" loading="lazy" decoding="async" onerror="this.src='../public/assets/images/food-photo.webp'; this.onerror=null;">
            <span class="card-tag">${Utils.escapeHtml(item.region || 'India')}</span>
            <span class="card-diet-tag ${dietClass}">${Utils.escapeHtml(item.diet || 'Traditional')}</span>
          </div>
          <div class="card-body">
            <span class="card-state-eyebrow">${Utils.escapeHtml(item.state)}</span>
            <h3 class="card-title">${Utils.escapeHtml(item.name)}</h3>
            <p class="card-desc">${Utils.escapeHtml(item.description)}</p>
            <div class="card-footer">
              <div class="card-price">
                ${Utils.formatCurrency(item.price)}
                <small>• ${Utils.escapeHtml(item.prepTime || '30m')}</small>
              </div>
              <div class="food-card-action">
                <a href="./recipe-detail.html#${Utils.escapeHtml(item.id)}" class="recipe-link-btn" title="View step-by-step recipe">
                  Recipe &rarr;
                </a>
                ${this.renderActionButton(item)}
              </div>
            </div>
          </div>
        </article>
      `;
      })
      .join('');
  },

  /**
   * Seamlessly synchronize card action buttons with current cart state without full grid re-render
   */
  syncCardButtons() {
    const cards = document.querySelectorAll('.food-card[data-id]');
    cards.forEach((card) => {
      const id = card.dataset.id;
      const item = this.foodItems.find((f) => f.id === id);
      if (!item) return;

      const actionWrap = card.querySelector('.food-card-action');
      if (actionWrap) {
        actionWrap.innerHTML = `
          <a href="./recipe-detail.html#${Utils.escapeHtml(item.id)}" class="recipe-link-btn" title="View step-by-step recipe">
            Recipe &rarr;
          </a>
          ${this.renderActionButton(item)}
        `;
      }
    });
  },

  renderActionButton(item) {
    const cartItems = typeof CartEngine !== 'undefined' ? CartEngine.getItems() : [];
    const inCart = cartItems.find((i) => i.id === item.id);

    if (inCart && inCart.quantity > 0) {
      return `
        <div class="card-cart-stepper" data-id="${Utils.escapeHtml(item.id)}">
          <button type="button" class="card-stepper-btn js-cart-decrement" data-id="${Utils.escapeHtml(item.id)}" aria-label="Decrease quantity" title="Decrease quantity">−</button>
          <button type="button" class="card-stepper-label js-cart-view" data-id="${Utils.escapeHtml(item.id)}" title="Click to view in cart">
            <span class="stepper-check">✓</span> In Cart (${inCart.quantity})
          </button>
          <button type="button" class="card-stepper-btn js-cart-increment" data-id="${Utils.escapeHtml(item.id)}" aria-label="Increase quantity" title="Add one more">+</button>
        </div>
      `;
    }

    return `
      <button type="button" class="btn btn-primary btn-sm js-add-cart-btn" data-id="${Utils.escapeHtml(item.id)}">
        Add to Cart
      </button>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('food-menu-grid')) {
    FoodMenuController.init();
  }
});
