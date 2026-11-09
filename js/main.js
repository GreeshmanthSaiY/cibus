/**
 * CIBUS MAIN APPLICATION CONTROLLER
 * Global initialization, cart page rendering, and shared UI controllers
 */

const App = {
  init() {
    this.initCartPage();
    this.initHeroDishStage();
    this.initHomeShowcase();
  },

  /**
   * If on cart.html, render the full cart table, totals, and quantity handlers
   */
  initCartPage() {
    const cartContainer = document.getElementById('cart-items-container');
    if (!cartContainer) return;

    const renderCartUI = () => {
      // If user is not authenticated, cart is strictly cleared and empty
      const isAuth = typeof AuthManager !== 'undefined' ? AuthManager.isAuthenticated() : true;
      if (!isAuth && typeof CartEngine !== 'undefined') {
        CartEngine.clearCart();
      }

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
        if (emptyState) {
          emptyState.style.display = 'block';
          if (!isAuth) {
            emptyState.innerHTML = `
              <span class="empty-state-icon">🔒</span>
              <h3>You are Currently Signed Out</h3>
              <p>Your session cart is empty. Please sign in or create an account to start adding authentic heritage dishes.</p>
              <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 16px;">
                <a href="./login.html?redirect=cart.html" class="btn btn-primary">Sign In &rarr;</a>
                <a href="./register.html?redirect=cart.html" class="btn btn-outline">Create Free Account</a>
                <a href="./food-menu.html" class="btn btn-outline">Browse Food Menu</a>
              </div>
            `;
          } else {
            emptyState.innerHTML = `
              <span class="empty-state-icon">🛒</span>
              <h3>Your Cart is Currently Empty</h3>
              <p>You haven't selected any traditional dishes yet. Browse our regional state food menus to discover authentic specialties!</p>
              <div style="margin-top: 16px;">
                <a href="./food-menu.html" class="btn btn-primary">Browse Food Menu &rarr;</a>
              </div>
            `;
          }
        }
        if (summarySubtotal) summarySubtotal.textContent = '₹0.00';
        if (summaryTax) summaryTax.textContent = '₹0.00';
        if (summaryTotal) summaryTotal.textContent = '₹0.00';
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
    window.addEventListener('cibus:auth:changed', renderCartUI);

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
   * Interactive Hero Showcase dish switcher with smooth cross-fade
   */
  initHeroDishStage() {
    const card = document.getElementById('hero-dish-card');
    const pills = document.querySelectorAll('.hero-dish-pill-btn');
    if (!card || pills.length === 0) return;

    const dishes = [
      {
        name: 'Hyderabadi Dum Biryani',
        state: 'Telangana · South India',
        diet: 'Authentic Heritage',
        desc: 'Aromatic long-grain basmati layered with royal spices, saffron milk, and slow-cooked in a sealed dough vessel.',
        price: '₹340',
        time: '⏱️ 50 Mins · Slow Dum Technique',
        tag: '🔥 Trending Regional Dish',
        dishId: 'biriyani',
        image: '../public/assets/images/dishes/biriyani.webp'
      },
      {
        name: 'Pulihora (Tamarind Rice)',
        state: 'Andhra Pradesh · South India',
        diet: 'Pure Vegetarian',
        desc: 'Tangy tamarind-infused rice tempered with roasted peanuts, mustard seeds, curry leaves, and green chilies.',
        price: '₹160',
        time: '⏱️ 25 Mins · Temple Heritage',
        tag: '🌿 Ancient Temple Recipe',
        dishId: 'pulihora',
        image: '../public/assets/images/dishes/pulihora.webp'
      },
      {
        name: 'Makki di Roti & Sarson da Saag',
        state: 'Punjab · North India',
        diet: 'Pure Vegetarian',
        desc: 'Slow-simmered mustard greens with tender bathua leaves served with golden corn flatbread and fresh white butter.',
        price: '₹220',
        time: '⏱️ 40 Mins · Winter Classic',
        tag: '🌾 Winter Harvest Classic',
        dishId: 'makki',
        image: '../public/assets/images/dishes/makki.webp'
      },
      {
        name: 'Goan Fish Curry',
        state: 'Goa · West India',
        diet: 'Coastal Non-Veg',
        desc: 'Coastal catch simmered in spiced fresh coconut milk, dried red Kashmiri chillies, and tangy dried kokum petals.',
        price: '₹360',
        time: '⏱️ 35 Mins · Coastal Coconut',
        tag: '🌊 Coastal Coconut Stew',
        dishId: 'fish',
        image: '../public/assets/images/dishes/fish.webp'
      }
    ];

    let currentIndex = 0;
    let autoRotateTimer = null;

    const updateDish = (index) => {
      currentIndex = index;
      const d = dishes[index];
      if (!d) return;

      pills.forEach((p, idx) => p.classList.toggle('active', idx === index));

      const img = document.getElementById('hero-dish-img');
      const title = document.getElementById('hero-dish-title');
      const state = document.getElementById('hero-dish-state');
      const diet = document.getElementById('hero-dish-diet');
      const desc = document.getElementById('hero-dish-desc');
      const price = document.getElementById('hero-dish-price');
      const tag = document.getElementById('hero-dish-badge-tag');
      const time = document.getElementById('hero-dish-badge-time');
      const link = document.getElementById('hero-dish-link');

      if (img) {
        img.style.opacity = '0.35';
        img.style.transform = 'scale(0.97)';
      }

      setTimeout(() => {
        if (img) {
          img.src = d.image;
          img.alt = d.name;
          img.style.opacity = '1';
          img.style.transform = 'scale(1)';
        }
        if (title) title.textContent = d.name;
        if (state) state.textContent = d.state;
        if (diet) diet.textContent = d.diet;
        if (desc) desc.textContent = d.desc;
        if (price) price.textContent = d.price;
        if (tag) tag.textContent = d.tag;
        if (time) time.textContent = d.time;
        if (link) link.href = `./recipe-detail.html#${d.dishId}`;
      }, 160);
    };

    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        clearInterval(autoRotateTimer);
        const idx = parseInt(pill.dataset.index, 10);
        updateDish(isNaN(idx) ? 0 : idx);
        startTimer();
      });
    });

    const startTimer = () => {
      autoRotateTimer = setInterval(() => {
        const next = (currentIndex + 1) % dishes.length;
        updateDish(next);
      }, 6500);
    };

    startTimer();
  },

  /**
   * Populate state cards with photography, ratings, tags, and interactive regional filter
   */
  async initHomeShowcase() {
    const statesContainer = document.getElementById('home-states-preview');
    if (!statesContainer) return;

    let foodItems = [];
    let stateList = [];

    try {
      const [statesRes, foodsRes] = await Promise.all([
        fetch('../data/states.json').catch(() => fetch('./data/states.json')),
        fetch('../data/food-items.json').catch(() => fetch('./data/food-items.json'))
      ]);

      if (statesRes && statesRes.ok) {
        stateList = await statesRes.json();
      }
      if (foodsRes && foodsRes.ok) {
        foodItems = await foodsRes.json();
      }

      const foodMap = new Map();
      foodItems.forEach((f) => foodMap.set(f.id, f));

      const combined = stateList.map((s) => {
        const food = foodMap.get(s.dishId) || {};
        return {
          id: s.id,
          name: s.name,
          region: s.region,
          dish: s.dish,
          dishId: s.dishId,
          image: food.image || '../public/assets/images/dishes/' + s.dishId + '.webp',
          diet: food.diet || 'Vegetarian',
          rating: food.rating || 4.8,
          description: food.description || `Authentic regional heritage dish celebrated across ${s.name}.`,
          price: food.price || 220
        };
      });

      const renderGrid = (filterRegion = 'all') => {
        let filtered = combined;
        if (filterRegion === 'Vegetarian') {
          filtered = combined.filter((item) => item.diet === 'Vegetarian' || item.diet === 'Vegan');
        } else if (filterRegion !== 'all') {
          filtered = combined.filter((item) => item.region.toLowerCase() === filterRegion.toLowerCase());
        }

        const toDisplay = filtered.slice(0, 8);

        statesContainer.innerHTML = toDisplay
          .map(
            (item, index) => `
          <div class="state-preview-card" style="animation: fadeInUp 0.4s ease ${index * 0.05}s both;">
            <div class="state-card-img-wrap">
              <img src="${Utils.escapeHtml(item.image)}" alt="${Utils.escapeHtml(item.name + ' ' + item.dish)}" loading="lazy" decoding="async" onerror="this.src='../public/assets/images/dishes/${Utils.escapeHtml(item.dishId)}.webp';">
              <div class="state-card-badges">
                <span class="state-region-tag">${Utils.escapeHtml(item.region)} India</span>
                <span class="state-diet-tag" style="color: ${item.diet === 'Non-Vegetarian' ? '#B91C1C' : '#15803D'};">
                  ${item.diet === 'Non-Vegetarian' ? '🔴 Non-Veg' : '🟢 Veg'}
                </span>
              </div>
            </div>
            <div class="state-card-body">
              <span class="state-name">${Utils.escapeHtml(item.name)}</span>
              <h3 class="state-dish-highlight">${Utils.escapeHtml(item.dish)}</h3>
              <p class="state-dish-desc">${Utils.escapeHtml(item.description)}</p>
              <div class="state-card-footer">
                <span class="state-rating-wrap">⭐ ${item.rating}</span>
                <a href="./recipe-detail.html#${Utils.escapeHtml(item.dishId)}" class="btn btn-outline btn-sm">
                  View Recipe &rarr;
                </a>
              </div>
            </div>
          </div>
        `
          )
          .join('');
      };

      // Initial render
      renderGrid('all');

      // Setup filter buttons
      const filterPills = document.querySelectorAll('.home-filter-pill');
      filterPills.forEach((pill) => {
        pill.addEventListener('click', () => {
          filterPills.forEach((p) => p.classList.remove('active'));
          pill.classList.add('active');
          const reg = pill.dataset.region || 'all';
          renderGrid(reg);
        });
      });
    } catch (err) {
      console.warn('[Cibus Home] Could not load state dishes:', err);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
