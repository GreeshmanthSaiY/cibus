/**
 * CIBUS RECIPES CONTROLLER
 * Signature Cascading Fanned Recipe Card Decks & Arched Culinary Display
 */

const RecipesController = {
  recipes: [],
  foodMap: new Map(),
  searchQuery: '',
  currentView: 'deck', // 'deck' (default signature fanned cards) or 'grid'

  // Authentic Image Dictionary matching Cibus heritage collection
  recipeImages: {
    pulihora: '../public/assets/images/dishes/pulihora.webp',
    bamboo: '../public/assets/images/dishes/bamboo.webp',
    duck: '../public/assets/images/dishes/duck.webp',
    litti: '../public/assets/images/dishes/litti.webp',
    muthia: '../public/assets/images/dishes/muthia.webp',
    fish: '../public/assets/images/dishes/fish.webp',
    dhokla: '../public/assets/images/dishes/dhokla.webp',
    bajre: '../public/assets/images/dishes/bajre.webp',
    dham: '../public/assets/images/dishes/dham.webp',
    dhooska: '../public/assets/images/dishes/dhooska.webp',
    bisi: '../public/assets/images/dishes/bisi.webp',
    appam: '../public/assets/images/dishes/appam.webp',
    bhutte: '../public/assets/images/dishes/bhutte.webp',
    misal: '../public/assets/images/dishes/misal.webp',
    kangshoi: '../public/assets/images/dishes/kangshoi.webp',
    jadoh: '../public/assets/images/dishes/jadoh.webp',
    misa: '../public/assets/images/dishes/misa.webp',
    pork: '../public/assets/images/dishes/pork.webp',
    chenna: '../public/assets/images/dishes/chenna.webp',
    makki: '../public/assets/images/dishes/makki.webp',
    dal: '../public/assets/images/dishes/dal.webp',
    momo: '../public/assets/images/dishes/momo.webp',
    pongal: '../public/assets/images/dishes/pongal.webp',
    biriyani: '../public/assets/images/dishes/biriyani.webp',
    chakhwi: '../public/assets/images/dishes/chakhwi.webp',
    tunde: '../public/assets/images/dishes/tunde.webp',
    kafuli: '../public/assets/images/dishes/kafuli.webp',
    kosha: '../public/assets/images/dishes/kosha.webp'
  },

  async initCards() {
    await this.loadRecipes();
    this.setupCardListeners();
    this.renderCards();
    this.setupCartDelegation();

    window.addEventListener('cibus:cart:updated', () => {
      this.syncCartButtons();
    });

    window.addEventListener('cibus:auth:changed', () => {
      this.syncCartButtons();
    });
  },

  async initDetail() {
    await this.loadRecipes();
    this.setupDetailSidebar();
    this.setupChecklistHandlers();
    this.injectDetailOrderButtons();
    this.setupCartDelegation();
    this.highlightActiveHash();

    window.addEventListener('hashchange', () => {
      this.highlightActiveHash();
    });

    window.addEventListener('cibus:cart:updated', () => {
      this.injectDetailOrderButtons();
    });

    window.addEventListener('cibus:auth:changed', () => {
      this.injectDetailOrderButtons();
    });
  },

  async loadRecipes() {
    try {
      const [recRes, foodRes] = await Promise.all([
        fetch('../data/recipes.json').catch(() => fetch('./data/recipes.json')),
        fetch('../data/food-items.json').catch(() => fetch('./data/food-items.json'))
      ]);
      if (recRes && recRes.ok) {
        this.recipes = await recRes.json();
      }
      if (foodRes && foodRes.ok) {
        const foods = await foodRes.json();
        this.foodMap = new Map();
        foods.forEach((f) => this.foodMap.set(f.id, f));
      }
    } catch (e) {
      console.error('[Cibus Recipes] Failed to load data:', e);
    }
  },

  getRecipeImage(r) {
    if (r && r.image) return r.image;
    const id = typeof r === 'string' ? r : (r ? r.id : '');
    if (this.recipeImages[id]) {
      return this.recipeImages[id];
    }
    return '../public/assets/images/dishes/biriyani.webp';
  },

  getCleanDishName(name) {
    if (!name) return '';
    // Formats into punchy uppercase dish title matching original Cibus deck (e.g. "PULIHORA", "DHOKLA", "LITTI CHOKHA")
    return name
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/^(Assamese|Chhattisgarhi|Haryanvi|Himachali|Jharkhandi|Karnataka|Kerala|Kolhapuri|Manipuri|Khasi|Mizo|Naga|Sikkimese|Tamil|Bengali|Lucknowi|Tripuri|Bihari)\s+/i, '')
      .trim();
  },

  setupCardListeners() {
    const searchInput = document.getElementById('recipe-search-input');
    if (searchInput) {
      searchInput.addEventListener(
        'input',
        Utils.debounce((e) => {
          this.searchQuery = e.target.value.trim().toLowerCase();
          this.renderCards();
        }, 150)
      );
    }

    // View toggle buttons (Cascading Deck vs Grid)
    document.querySelectorAll('.view-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const targetView = e.currentTarget.getAttribute('data-view');
        if (targetView && targetView !== this.currentView) {
          this.currentView = targetView;
          document.querySelectorAll('.view-toggle-btn').forEach((b) => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          this.renderCards();
        }
      });
    });
  },

  renderCardMarkup(r) {
    const img = this.getRecipeImage(r);
    const cleanName = this.getCleanDishName(r.name);
    const food = this.foodMap ? this.foodMap.get(r.id) : null;
    const price = (food && food.price) || 220;
    const cartItems = typeof CartEngine !== 'undefined' ? CartEngine.getItems() : [];
    const inCart = cartItems.find((i) => i.id === r.id);

    return `
      <div class="recipe-fanned-card" data-id="${Utils.escapeHtml(r.id)}">
        <a href="./recipe-detail.html#${Utils.escapeHtml(r.id)}" class="card-link-overlay" aria-label="${Utils.escapeHtml(r.name)} from ${Utils.escapeHtml(r.state)}"></a>
        <div class="card-img" style="background-image: url('${img}');">
          <div class="card-img-overlay"></div>
        </div>
        <div class="card-description">
          <h2 class="card-title">${Utils.escapeHtml(cleanName)}</h2>
          <p class="card-state">${Utils.escapeHtml(r.state)}</p>
        </div>
        <div class="card-action-bar">
          <span class="card-price-tag">₹${price}</span>
          ${
            inCart && inCart.quantity > 0
              ? `
            <div class="card-cart-stepper card-cart-stepper-dark" data-id="${Utils.escapeHtml(r.id)}">
              <button type="button" class="card-stepper-btn js-deck-cart-dec" data-id="${Utils.escapeHtml(r.id)}" title="Decrease quantity">−</button>
              <button type="button" class="card-stepper-label js-cart-view" data-id="${Utils.escapeHtml(r.id)}" title="View in cart">
                <span class="stepper-check">✓</span> In Cart (${inCart.quantity})
              </button>
              <button type="button" class="card-stepper-btn js-deck-cart-inc" data-id="${Utils.escapeHtml(r.id)}" title="Add one more">+</button>
            </div>
          `
              : `
            <button type="button" class="btn-card-add-cart js-deck-add-cart" data-id="${Utils.escapeHtml(r.id)}" aria-label="Add ${Utils.escapeHtml(r.name)} to cart">
              🛒 Add
            </button>
          `
          }
        </div>
        <span class="card-btn">
          View Recipe &rarr;
        </span>
      </div>
    `;
  },

  injectDetailOrderButtons() {
    document.querySelectorAll('.recipe-article').forEach((article) => {
      const id = article.id;
      const header = article.querySelector('.recipe-article-header');
      if (!header) return;

      let orderBar = header.querySelector('.recipe-order-bar');
      if (!orderBar) {
        orderBar = document.createElement('div');
        orderBar.className = 'recipe-order-bar';
        header.appendChild(orderBar);
      }

      const food = this.foodMap ? this.foodMap.get(id) : null;
      const price = (food && food.price) || 220;
      const cartItems = typeof CartEngine !== 'undefined' ? CartEngine.getItems() : [];
      const inCart = cartItems.find((i) => i.id === id);

      orderBar.innerHTML = `
        <span class="recipe-price-tag">₹${price}</span>
        ${
          inCart && inCart.quantity > 0
            ? `
          <div class="card-cart-stepper" data-id="${Utils.escapeHtml(id)}">
            <button type="button" class="card-stepper-btn js-recipe-cart-dec" data-id="${Utils.escapeHtml(id)}" title="Decrease quantity">−</button>
            <button type="button" class="card-stepper-label js-cart-view" data-id="${Utils.escapeHtml(id)}" title="View in cart">
              <span class="stepper-check">✓</span> In Cart (${inCart.quantity})
            </button>
            <button type="button" class="card-stepper-btn js-recipe-cart-inc" data-id="${Utils.escapeHtml(id)}" title="Add one more">+</button>
          </div>
        `
            : `
          <button type="button" class="btn btn-primary btn-sm js-recipe-add-cart" data-id="${Utils.escapeHtml(id)}">
            🛒 Add Dish to Cart
          </button>
        `
        }
      `;
    });
  },

  syncCartButtons() {
    // Sync all fanned cards on recipe-cards.html
    document.querySelectorAll('.recipe-fanned-card[data-id]').forEach((card) => {
      const id = card.dataset.id;
      const r = this.recipes.find((rec) => rec.id === id);
      if (!r) return;
      const food = this.foodMap ? this.foodMap.get(id) : null;
      const price = (food && food.price) || 220;
      const cartItems = typeof CartEngine !== 'undefined' ? CartEngine.getItems() : [];
      const inCart = cartItems.find((i) => i.id === id);

      const bar = card.querySelector('.card-action-bar');
      if (bar) {
        bar.innerHTML = `
          <span class="card-price-tag">₹${price}</span>
          ${
            inCart && inCart.quantity > 0
              ? `
            <div class="card-cart-stepper card-cart-stepper-dark" data-id="${Utils.escapeHtml(id)}">
              <button type="button" class="card-stepper-btn js-deck-cart-dec" data-id="${Utils.escapeHtml(id)}" title="Decrease quantity">−</button>
              <button type="button" class="card-stepper-label js-cart-view" data-id="${Utils.escapeHtml(id)}" title="View in cart">
                <span class="stepper-check">✓</span> In Cart (${inCart.quantity})
              </button>
              <button type="button" class="card-stepper-btn js-deck-cart-inc" data-id="${Utils.escapeHtml(id)}" title="Add one more">+</button>
            </div>
          `
              : `
            <button type="button" class="btn-card-add-cart js-deck-add-cart" data-id="${Utils.escapeHtml(id)}" aria-label="Add ${Utils.escapeHtml(r.name)} to cart">
              🛒 Add
            </button>
          `
          }
        `;
      }
    });

    // Also sync detail order bars if on detail page
    this.injectDetailOrderButtons();
  },

  setupCartDelegation() {
    const requireAuth = () => {
      if (!window.AuthManager || !AuthManager.isAuthenticated()) {
        Utils.showToast({
          title: 'Sign In Required 🔒',
          message: 'Please sign in to your session account to add items to your cart!',
          icon: '👤',
          type: 'warning',
          durationMs: 10000,
          actionLabel: 'Sign In Now',
          actionUrl: './login.html?redirect=recipe-cards.html'
        });
        const curPage = window.location.pathname.split('/').pop() || 'recipe-cards.html';
        const redirectUrl = curPage + (window.location.hash || '');
        setTimeout(() => {
          window.location.href = `./login.html?redirect=${encodeURIComponent(redirectUrl)}`;
        }, 1200);
        return false;
      }
      return true;
    };

    const handleAdd = (dishId, targetEl) => {
      if (!requireAuth()) return;

      const food = this.foodMap ? this.foodMap.get(dishId) : null;
      const recipe = this.recipes.find((r) => r.id === dishId);
      const name = (food && food.name) || (recipe && recipe.name) || dishId;
      const price = (food && food.price) || 220;
      const state = (recipe && recipe.state) || (food && food.state) || 'Traditional';
      const image = (food && food.image) || (recipe && recipe.image) || this.getRecipeImage(dishId);

      CartEngine.addItem({
        id: dishId,
        name: name,
        price: price,
        image: image,
        state: state
      });

      if (typeof CelebrationFx !== 'undefined' && targetEl) {
        CelebrationFx.burstFromElement(targetEl, name);
      }

      if (typeof NotificationCenter !== 'undefined') {
        NotificationCenter.add({
          title: 'Celebration! Dish Added 🎉',
          message: `1x ${name} (${state}) added to your culinary order.`,
          icon: '🍲',
          type: 'cart',
          link: './cart.html'
        });
      }

      Utils.showToast({
        title: 'Added to Cart! 🎉',
        message: `1x ${name} (${Utils.formatCurrency(price)}) added to order.`,
        icon: '🍲',
        type: 'celebration',
        durationMs: 10000,
        actionLabel: 'View Cart 🛒',
        actionUrl: './cart.html'
      });

      this.syncCartButtons();
    };

    const handleUpdate = (dishId, delta, targetEl) => {
      if (!requireAuth()) return;
      const inCart = CartEngine.getItems().find((i) => i.id === dishId);
      if (!inCart) return;
      const nextQty = inCart.quantity + delta;

      if (nextQty <= 0) {
        CartEngine.removeItem(dishId);
        Utils.showToast({
          title: 'Item Removed',
          message: `${inCart.name} removed from your cart.`,
          icon: '🗑️',
          type: 'info',
          durationMs: 10000
        });
      } else {
        CartEngine.updateQuantity(dishId, nextQty);
        if (delta > 0 && typeof CelebrationFx !== 'undefined' && targetEl) {
          CelebrationFx.burstFromElement(targetEl, inCart.name);
        }
        Utils.showToast({
          title: 'Quantity Updated 🛒',
          message: `${inCart.name} quantity updated to ${nextQty}.`,
          icon: delta > 0 ? '➕' : '➖',
          type: 'info',
          durationMs: 10000
        });
      }

      this.syncCartButtons();
    };

    document.addEventListener('click', (e) => {
      const deckBtn = e.target.closest('.js-deck-add-cart');
      const recipeBtn = e.target.closest('.js-recipe-add-cart');
      const deckInc = e.target.closest('.js-deck-cart-inc');
      const deckDec = e.target.closest('.js-deck-cart-dec');
      const recInc = e.target.closest('.js-recipe-cart-inc');
      const recDec = e.target.closest('.js-recipe-cart-dec');
      const viewBtn = e.target.closest('.js-cart-view');

      if (deckBtn) {
        e.preventDefault();
        e.stopPropagation();
        handleAdd(deckBtn.dataset.id, deckBtn);
      } else if (recipeBtn) {
        e.preventDefault();
        e.stopPropagation();
        handleAdd(recipeBtn.dataset.id, recipeBtn);
      } else if (deckInc) {
        e.preventDefault();
        e.stopPropagation();
        handleUpdate(deckInc.dataset.id, 1, deckInc);
      } else if (deckDec) {
        e.preventDefault();
        e.stopPropagation();
        handleUpdate(deckDec.dataset.id, -1, deckDec);
      } else if (recInc) {
        e.preventDefault();
        e.stopPropagation();
        handleUpdate(recInc.dataset.id, 1, recInc);
      } else if (recDec) {
        e.preventDefault();
        e.stopPropagation();
        handleUpdate(recDec.dataset.id, -1, recDec);
      } else if (viewBtn) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = './cart.html';
      }
    });
  },

  renderCards() {
    const container = document.getElementById('recipes-card-container');
    if (!container) return;

    const filtered = this.recipes.filter((r) => {
      if (!this.searchQuery) return true;
      return (
        r.name.toLowerCase().includes(this.searchQuery) ||
        r.state.toLowerCase().includes(this.searchQuery) ||
        r.difficulty.toLowerCase().includes(this.searchQuery)
      );
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="background: rgba(0,0,0,0.5); color: #fff; padding: 40px; border-radius: 16px; margin: 40px 0;">
          <span class="empty-state-icon" style="font-size: 3rem;">📖</span>
          <h3 style="color: #fff; margin-top: 10px;">No Recipes Found</h3>
          <p style="color: rgba(255,255,255,0.7);">No regional recipes matched "${Utils.escapeHtml(this.searchQuery)}".</p>
          <button class="btn btn-outline" style="color: #fff; border-color: #fff; margin-top: 16px;" onclick="document.getElementById('recipe-search-input').value=''; RecipesController.searchQuery=''; RecipesController.renderCards();">Clear Search</button>
        </div>
      `;
      return;
    }

    if (this.currentView === 'grid') {
      // Standard responsive grid layout
      container.innerHTML = `
        <div class="recipes-grid-layout">
          ${filtered.map((r) => this.renderCardMarkup(r)).join('')}
        </div>
      `;
      return;
    }

    // Default: Signature Cascading Fanned Card Decks (exactly like Image 2)
    if (this.searchQuery) {
      // Single focused deck for filtered search results
      container.innerHTML = `
        <div class="deck-row-header">
          <span>Search Results (${filtered.length} Dishes Found)</span>
        </div>
        <div class="recipe-deck-row">
          ${filtered.map((r) => this.renderCardMarkup(r)).join('')}
        </div>
      `;
      return;
    }

    // Divide full 28 dishes into 4 curated regional decks of 7 cards
    const deckGroups = [
      { name: 'Deck 1: Heritage Flavors of Southern & Eastern States', items: filtered.slice(0, 7) },
      { name: 'Deck 2: Traditional Recipes of Northern & Central India', items: filtered.slice(7, 14) },
      { name: 'Deck 3: Coastal, Mountain & Northeastern Specialties', items: filtered.slice(14, 21) },
      { name: 'Deck 4: Royal Banquets, Breads & Classic Curries', items: filtered.slice(21, 28) }
    ];

    container.innerHTML = deckGroups
      .map(
        (group) => `
        <div class="deck-row-header">
          <span>${Utils.escapeHtml(group.name)}</span>
        </div>
        <div class="recipe-deck-row">
          ${group.items.map((r) => this.renderCardMarkup(r)).join('')}
        </div>
      `
      )
      .join('');
  },

  setupDetailSidebar() {
    const sidebar = document.querySelector('.recipe-sidebar');
    const sidebarList = document.getElementById('recipe-nav-list');
    if (!sidebarList) return;

    // Add search filter input if not present
    if (sidebar && !sidebar.querySelector('.recipe-sidebar-search-wrap')) {
      const searchWrap = document.createElement('div');
      searchWrap.className = 'recipe-sidebar-search-wrap';
      searchWrap.innerHTML = `
        <input type="text" class="recipe-sidebar-search" placeholder="Search dish or state..." aria-label="Filter dishes">
      `;
      const title = sidebar.querySelector('h3');
      if (title && title.nextSibling) {
        sidebar.insertBefore(searchWrap, title.nextSibling);
      } else {
        sidebar.prepend(searchWrap);
      }

      const searchInput = searchWrap.querySelector('.recipe-sidebar-search');
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const items = sidebarList.querySelectorAll('.recipe-nav-item');
        items.forEach((item) => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(query) ? '' : 'none';
        });
      });
    }

    sidebarList.innerHTML = this.recipes
      .map(
        (r) => `
        <li class="recipe-nav-item" id="nav-${Utils.escapeHtml(r.id)}">
          <a href="#${Utils.escapeHtml(r.id)}">
            ${Utils.escapeHtml(r.name)} <small style="display:block; color: var(--color-primary);">${Utils.escapeHtml(r.state)}</small>
          </a>
        </li>
      `
      )
      .join('');

    this.setupScrollSpy();
    this.setupBackToTop();
  },

  setupScrollSpy() {
    const articles = document.querySelectorAll('.recipe-article');
    if (!articles.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            document.querySelectorAll('.recipe-nav-item').forEach((item) => {
              item.classList.toggle('active', item.id === `nav-${id}`);
            });
            const activeItem = document.getElementById(`nav-${id}`);
            if (activeItem && activeItem.scrollIntoView) {
              activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    );

    articles.forEach((a) => observer.observe(a));
  },

  setupBackToTop() {
    let btn = document.getElementById('back-to-top-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'back-to-top-btn';
      btn.className = 'back-to-top-btn';
      btn.setAttribute('aria-label', 'Back to top of recipes');
      btn.innerHTML = '&uarr;';
      document.body.appendChild(btn);

      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      window.addEventListener(
        'scroll',
        () => {
          if (window.scrollY > 400) {
            btn.classList.add('is-visible');
          } else {
            btn.classList.remove('is-visible');
          }
        },
        { passive: true }
      );
    }
  },

  updateIngredientProgress(box) {
    if (!box) return;
    const checkboxes = box.querySelectorAll('.ingredient-checkbox');
    const total = checkboxes.length;
    if (total === 0) return;
    const checked = box.querySelectorAll('.ingredient-checkbox:checked').length;
    const pct = Math.round((checked / total) * 100);

    let progressWrap = box.querySelector('.ingredient-progress-wrapper');
    if (!progressWrap) {
      progressWrap = document.createElement('div');
      progressWrap.className = 'ingredient-progress-wrapper';
      const title = box.querySelector('h3');
      if (title && title.nextSibling) {
        box.insertBefore(progressWrap, title.nextSibling);
      } else {
        box.prepend(progressWrap);
      }
    }

    progressWrap.innerHTML = `
      <div class="ingredient-progress-info">
        <span>Ingredients Ready</span>
        <span class="ingredient-progress-text">${checked} of ${total} (${pct}%)</span>
      </div>
      <div class="ingredient-progress-bar">
        <div class="ingredient-progress-fill" style="width: ${pct}%;"></div>
      </div>
    `;
  },

  highlightActiveHash() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;

    document.querySelectorAll('.recipe-nav-item').forEach((item) => {
      item.classList.remove('active');
    });

    const activeNav = document.getElementById(`nav-${hash}`);
    if (activeNav) {
      activeNav.classList.add('active');
    }

    const targetArticle = document.getElementById(hash);
    if (targetArticle) {
      targetArticle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  setupChecklistHandlers() {
    // Initial calculation for all recipe boxes
    document.querySelectorAll('.ingredients-box').forEach((box) => {
      this.updateIngredientProgress(box);
    });

    document.addEventListener('change', (e) => {
      if (e.target.matches('.ingredient-checkbox')) {
        const item = e.target.closest('.ingredient-item');
        if (item) {
          item.style.textDecoration = e.target.checked ? 'line-through' : 'none';
          item.style.opacity = e.target.checked ? '0.6' : '1';
        }
        const box = e.target.closest('.ingredients-box');
        if (box) {
          this.updateIngredientProgress(box);
        }
      }
    });
  }
};
