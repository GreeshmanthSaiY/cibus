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

      const cartLayout = document.querySelector('.cart-layout');

      const recommendationsHTML = `
        <div class="cart-recommendations-section">
          <div class="cart-rec-header">
            <span class="section-eyebrow">Culinary Inspiration</span>
            <h3 class="cart-rec-title">Popular Regional Delicacies to Try</h3>
            <p class="cart-rec-desc">Handcrafted traditional favorites celebrated across the 28 Indian States.</p>
          </div>
          <div class="cart-rec-grid">
            <a href="./food-menu.html?region=south#biryani" class="cart-rec-card">
              <img src="../public/assets/images/dishes/biriyani.webp" alt="Hyderabadi Dum Biryani" class="cart-rec-img" onerror="this.src='../public/assets/images/food-photo.jpeg';">
              <div class="cart-rec-body">
                <span class="cart-rec-state">Telangana &bull; South</span>
                <h4 class="cart-rec-name">Hyderabadi Dum Biryani</h4>
                <div class="cart-rec-footer">
                  <span class="cart-rec-price">₹320</span>
                  <span class="cart-rec-action">Explore &rarr;</span>
                </div>
              </div>
            </a>
            <a href="./food-menu.html?region=north#makki" class="cart-rec-card">
              <img src="../public/assets/images/dishes/makki.webp" alt="Makki di Roti" class="cart-rec-img" onerror="this.src='../public/assets/images/food-photo.jpeg';">
              <div class="cart-rec-body">
                <span class="cart-rec-state">Punjab &bull; North</span>
                <h4 class="cart-rec-name">Makki di Roti &amp; Saag</h4>
                <div class="cart-rec-footer">
                  <span class="cart-rec-price">₹240</span>
                  <span class="cart-rec-action">Explore &rarr;</span>
                </div>
              </div>
            </a>
            <a href="./food-menu.html?region=east#litti" class="cart-rec-card">
              <img src="../public/assets/images/dishes/litti.webp" alt="Bihari Litti Chokha" class="cart-rec-img" onerror="this.src='../public/assets/images/food-photo.jpeg';">
              <div class="cart-rec-body">
                <span class="cart-rec-state">Bihar &bull; East</span>
                <h4 class="cart-rec-name">Bihari Litti Chokha</h4>
                <div class="cart-rec-footer">
                  <span class="cart-rec-price">₹220</span>
                  <span class="cart-rec-action">Explore &rarr;</span>
                </div>
              </div>
            </a>
            <a href="./food-menu.html?region=west#dhokla" class="cart-rec-card">
              <img src="../public/assets/images/dishes/dhokla.webp" alt="Khaman Dhokla" class="cart-rec-img" onerror="this.src='../public/assets/images/food-photo.jpeg';">
              <div class="cart-rec-body">
                <span class="cart-rec-state">Gujarat &bull; West</span>
                <h4 class="cart-rec-name">Khaman Dhokla</h4>
                <div class="cart-rec-footer">
                  <span class="cart-rec-price">₹140</span>
                  <span class="cart-rec-action">Explore &rarr;</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      `;

      if (items.length === 0) {
        if (cartTableWrapper) cartTableWrapper.style.display = 'none';
        if (summaryPanel) summaryPanel.style.display = 'none';
        if (cartLayout) cartLayout.classList.add('is-empty');
        if (emptyState) {
          emptyState.style.display = 'block';
          if (!isAuth) {
            emptyState.innerHTML = `
              <div class="cart-signed-out-card">
                <div class="cart-pill-tag">
                  <span class="pill-dot"></span>
                  Session-Guarded Culinary Commerce
                </div>
                <div class="cart-icon-wrapper">
                  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" class="cart-premium-icon" aria-hidden="true">
                    <circle cx="34" cy="34" r="32" fill="#E85A19" fill-opacity="0.1" stroke="#E85A19" stroke-width="1.5"/>
                    <rect x="22" y="30" width="24" height="20" rx="5" fill="#E85A19" stroke="#C74B16" stroke-width="2"/>
                    <path d="M26 30V24C26 19.5817 29.5817 16 34 16C38.4183 16 42 19.5817 42 24V30" stroke="#E85A19" stroke-width="3" stroke-linecap="round"/>
                    <circle cx="34" cy="39" r="2.5" fill="#FFFFFF"/>
                    <path d="M34 41.5V45" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <h2 class="cart-empty-title">Sign In to Access Your CIBUS Cart</h2>
                <p class="cart-empty-desc">
                  Your regional culinary choices, personalized favorites, and custom serving portions are private and securely tied to your active CIBUS account. Sign in to view your bag or create a free account to begin your journey across 28 Indian States.
                </p>
                <div class="cart-benefits-row">
                  <div class="cart-benefit-item">
                    <span class="benefit-icon">🌿</span>
                    <span>28 State Master Dishes</span>
                  </div>
                  <div class="cart-benefit-item">
                    <span class="benefit-icon">⚖️</span>
                    <span>Real-Time GST &amp; Portions</span>
                  </div>
                  <div class="cart-benefit-item">
                    <span class="benefit-icon">🛡️</span>
                    <span>Account-Scoped Privacy</span>
                  </div>
                </div>
                <div class="cart-cta-group">
                  <a href="./login.html?redirect=cart.html" class="btn btn-primary btn-lg">
                    Sign In to Your Account &rarr;
                  </a>
                  <a href="./register.html?redirect=cart.html" class="btn btn-secondary btn-lg">
                    Create Free Account
                  </a>
                  <a href="./food-menu.html" class="btn btn-outline btn-lg">
                    Browse Food Menu
                  </a>
                </div>
              </div>
              ${recommendationsHTML}
            `;
          } else {
            emptyState.innerHTML = `
              <div class="cart-empty-card">
                <div class="cart-pill-tag">
                  <span class="pill-dot"></span>
                  Personal Culinary Bag
                </div>
                <div class="cart-icon-wrapper">
                  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" class="cart-premium-icon" aria-hidden="true">
                    <circle cx="34" cy="34" r="32" fill="#E85A19" fill-opacity="0.1" stroke="#E85A19" stroke-width="1.5"/>
                    <path d="M18 42C18 33.163 25.163 26 34 26C42.837 26 50 33.163 50 42H18Z" fill="#E85A19" fill-opacity="0.2" stroke="#E85A19" stroke-width="2"/>
                    <path d="M14 46C14 44.8954 14.8954 44 16 44H52C53.1046 44 54 44.8954 54 46V47C54 47.5523 53.5523 48 53 48H15C14.4477 48 14 47.5523 14 47V46Z" fill="#E85A19" stroke="#C74B16" stroke-width="1.5"/>
                    <circle cx="34" cy="22" r="3" fill="#D4A373" stroke="#E85A19" stroke-width="2"/>
                  </svg>
                </div>
                <h2 class="cart-empty-title">Your Cart is Currently Empty</h2>
                <p class="cart-empty-desc">
                  You haven't selected any traditional dishes yet. Explore our regional menus to discover authentic specialties, adjust portion servings, and curate your personalized feast.
                </p>
                <div class="cart-cta-group">
                  <a href="./food-menu.html" class="btn btn-primary btn-lg">
                    Browse Food Menu &rarr;
                  </a>
                  <a href="./recipe-cards.html" class="btn btn-outline btn-lg">
                    Cook Master Recipes
                  </a>
                </div>
              </div>
              ${recommendationsHTML}
            `;
          }
        }
        if (summarySubtotal) summarySubtotal.textContent = '₹0.00';
        if (summaryTax) summaryTax.textContent = '₹0.00';
        if (summaryTotal) summaryTotal.textContent = '₹0.00';
        return;
      }

      if (cartLayout) cartLayout.classList.remove('is-empty');
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

      // Update summary numbers with subtle pulse
      if (summarySubtotal) summarySubtotal.textContent = Utils.formatCurrency(CartEngine.getSubtotal());
      if (summaryTax) summaryTax.textContent = Utils.formatCurrency(CartEngine.getTax());
      if (summaryTotal) {
        summaryTotal.textContent = Utils.formatCurrency(CartEngine.getGrandTotal());
        summaryTotal.classList.remove('price-pulse');
        void summaryTotal.offsetWidth;
        summaryTotal.classList.add('price-pulse');
      }
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
        const row = remBtn.closest('.cart-item-row');
        if (row) {
          row.classList.add('is-removing');
          setTimeout(() => {
            CartEngine.removeItem(id);
          }, 280);
        } else {
          CartEngine.removeItem(id);
        }
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

    let activeRegion = 'all';

    // Fallback data if JSON fetch fails or runs from local filesystem
    const fallbackDishes = [
      {
        id: 'pulihora',
        name: 'Andhra Pradesh',
        region: 'South',
        dish: 'Pulihora (Tamarind Rice)',
        dishId: 'pulihora',
        image: '../public/assets/images/dishes/pulihora.webp',
        diet: 'Vegetarian',
        rating: 4.8,
        description: 'Tangy tamarind-infused rice tempered with roasted peanuts, mustard seeds, curry leaves, and green chilies.',
        price: 160
      },
      {
        id: 'makki',
        name: 'Punjab',
        region: 'North',
        dish: 'Makki di Roti & Sarson da Saag',
        dishId: 'makki',
        image: '../public/assets/images/dishes/makki.webp',
        diet: 'Vegetarian',
        rating: 4.9,
        description: 'Slow-simmered mustard greens with tender bathua leaves served with golden corn flatbread and fresh white butter.',
        price: 220
      },
      {
        id: 'biriyani',
        name: 'Telangana',
        region: 'South',
        dish: 'Hyderabadi Dum Biryani',
        dishId: 'biriyani',
        image: '../public/assets/images/dishes/biriyani.webp',
        diet: 'Non-Vegetarian',
        rating: 4.9,
        description: 'Royal long-grain basmati infused with saffron milk, whole garam masala, and fragrant herbs in slow sealed dum.',
        price: 340
      },
      {
        id: 'fish',
        name: 'Goa',
        region: 'West',
        dish: 'Goan Fish Curry',
        dishId: 'fish',
        image: '../public/assets/images/dishes/fish.webp',
        diet: 'Non-Vegetarian',
        rating: 4.9,
        description: 'Coastal catch simmered in spiced fresh coconut milk, dried red Kashmiri chillies, and tangy dried kokum petals.',
        price: 360
      },
      {
        id: 'litti',
        name: 'Bihar',
        region: 'East',
        dish: 'Bihari Litti Chokha',
        dishId: 'litti',
        image: '../public/assets/images/dishes/litti.webp',
        diet: 'Vegetarian',
        rating: 4.8,
        description: 'Roasted whole wheat globes stuffed with spiced sattu, served with charred eggplant and tomato mash in pure desi ghee.',
        price: 200
      },
      {
        id: 'pork',
        name: 'Nagaland',
        region: 'Northeast',
        dish: 'Naga Smoked Pork with Bamboo Shoot',
        dishId: 'pork',
        image: '../public/assets/images/dishes/pork.webp',
        diet: 'Non-Vegetarian',
        rating: 4.9,
        description: 'Wood-smoked pork pieces slow-braised with fermented bamboo shoots, fiery Raja Mircha, and native mountain herbs.',
        price: 380
      }
    ];

    let combined = fallbackDishes;

    const renderGrid = (filterRegion = 'all') => {
      activeRegion = filterRegion;
      let filtered = combined;
      if (filterRegion === 'Vegetarian') {
        filtered = combined.filter((item) => item.diet === 'Vegetarian' || item.diet === 'Vegan');
      } else if (filterRegion !== 'all') {
        filtered = combined.filter((item) => item.region.toLowerCase() === filterRegion.toLowerCase());
      }

      const toDisplay = filtered.slice(0, 8);

      if (toDisplay.length === 0) {
        statesContainer.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--color-text-muted);">
            <p>No regional delicacies currently matching this selection. Try selecting <strong>All States</strong>.</p>
          </div>
        `;
        return;
      }

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

    // Setup filter buttons immediately
    const filterPills = document.querySelectorAll('.home-filter-pill');
    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        filterPills.forEach((p) => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');
        const reg = pill.dataset.region || 'all';
        renderGrid(reg);
      });
    });

    // Initial render with fallback immediately available
    renderGrid('all');

    // Asynchronously fetch full datasets
    try {
      const [statesRes, foodsRes] = await Promise.all([
        fetch('../data/states.json').catch(() => fetch('./data/states.json')),
        fetch('../data/food-items.json').catch(() => fetch('./data/food-items.json'))
      ]);

      if (statesRes && statesRes.ok && foodsRes && foodsRes.ok) {
        const stateList = await statesRes.json();
        const foodItems = await foodsRes.json();

        const foodMap = new Map();
        foodItems.forEach((f) => foodMap.set(f.id, f));

        combined = stateList.map((s) => {
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

        renderGrid(activeRegion);
      }
    } catch (err) {
      console.warn('[Cibus Home] Dataset load note:', err.message);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
