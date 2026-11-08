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

    // Delegated click handler for "Add to Cart"
    const grid = document.getElementById('food-menu-grid');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.js-add-cart-btn');
        if (addBtn) {
          const itemId = addBtn.dataset.id;
          const item = this.foodItems.find((f) => f.id === itemId);
          if (item && typeof CartEngine !== 'undefined') {
            CartEngine.addItem(item, 1);
          }
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
      .map((item) => {
        const dietClass =
          item.diet === 'Vegetarian'
            ? 'diet-veg'
            : item.diet === 'Vegan'
            ? 'diet-vegan'
            : 'diet-nonveg';

        return `
        <article class="card food-card" data-id="${Utils.escapeHtml(item.id)}">
          <div class="card-img-wrap">
            <img src="${Utils.escapeHtml(item.image)}" alt="${Utils.escapeHtml(item.name)}" loading="lazy" onerror="this.src='../public/assets/images/food-photo.jpeg'; this.onerror=null;">
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
                <button type="button" class="btn btn-primary btn-sm js-add-cart-btn" data-id="${Utils.escapeHtml(item.id)}">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
      })
      .join('');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('food-menu-grid')) {
    FoodMenuController.init();
  }
});
