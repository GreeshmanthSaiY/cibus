/**
 * CIBUS RECIPES CONTROLLER
 * Signature Cascading Fanned Recipe Card Decks & Arched Culinary Display
 */

const RecipesController = {
  recipes: [],
  searchQuery: '',
  currentView: 'deck', // 'deck' (default signature fanned cards) or 'grid'

  // Authentic Image Dictionary matching Cibus heritage collection
  recipeImages: {
    pulihora: 'https://vismaifood.com/storage/app/uploads/public/be1/3f7/bc1/thumb__700_0_0_0_auto.jpg',
    bamboo: 'https://www.archanaskitchen.com/images/archanaskitchen/1-Author/divya_shivaraman/Bamboo_Shoot_Stir_Fry.jpg',
    duck: 'https://assets.sentinelassam.com/h-upload/2021/01/16/189530-httpsprodstatic9netaumedia201606290939green-duck-curry.webp?w=400&dpr=2.6',
    litti: 'https://www.secondrecipe.com/wp-content/uploads/2019/11/litti-chokha-1.jpg',
    muthia: 'https://www.spiceupthecurry.com/wp-content/uploads/2020/11/methi-muthia-recipe-1.jpg',
    fish: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    dhokla: 'https://www.mygingergarlickitchen.com/wp-content/rich-markup-images/1x1/1x1-khaman-dhokla-recipe-how-to-make-instant-soft-and-spongy-dhokla-video-recipe.jpg',
    bajre: 'https://images1.livehindustan.com/uploadimage/library/2018/09/29/16_9/16_9_1/bajra_khichdi_1538206303.jpg',
    dham: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    dhooska: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    bisi: 'https://www.indianveggiedelight.com/wp-content/uploads/2020/06/bisibelebath_1-768x1024.webp',
    appam: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    bhutte: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    misal: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    kangshoi: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=600&auto=format&fit=crop&q=80',
    jadoh: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=600&auto=format&fit=crop&q=80',
    misa: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    pork: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=600&auto=format&fit=crop&q=80',
    chenna: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80',
    makki: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    dal: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    momo: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
    pongal: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    biriyani: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    chakhwi: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    tunde: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    kafuli: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    kosha: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=600&auto=format&fit=crop&q=80'
  },

  async initCards() {
    await this.loadRecipes();
    this.setupCardListeners();
    this.renderCards();
  },

  async initDetail() {
    await this.loadRecipes();
    this.setupDetailSidebar();
    this.setupChecklistHandlers();
    this.highlightActiveHash();

    window.addEventListener('hashchange', () => {
      this.highlightActiveHash();
    });
  },

  async loadRecipes() {
    try {
      const res = await fetch('../data/recipes.json');
      if (res.ok) {
        this.recipes = await res.json();
      } else {
        throw new Error('Relative fetch failed, try fallback');
      }
    } catch (e) {
      try {
        const fallbackRes = await fetch('./data/recipes.json');
        if (fallbackRes.ok) {
          this.recipes = await fallbackRes.json();
        }
      } catch (err) {
        console.error('[Cibus Recipes] Failed to load recipes dataset:', err);
      }
    }
  },

  getRecipeImage(recipeId) {
    if (this.recipeImages[recipeId]) {
      return this.recipeImages[recipeId];
    }
    return 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80';
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
    const img = this.getRecipeImage(r.id);
    return `
      <a href="./recipe-detail.html#${Utils.escapeHtml(r.id)}" class="recipe-fanned-card" aria-label="${Utils.escapeHtml(r.name)} from ${Utils.escapeHtml(r.state)}">
        <div class="card-img" style="background-image: url('${img}');"></div>
        <div class="card-description">
          <h2 class="card-title">${Utils.escapeHtml(r.name)}</h2>
          <p class="card-state">${Utils.escapeHtml(r.state)}</p>
        </div>
        <span class="card-btn">
          View more information &rarr;
        </span>
      </a>
    `;
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
    const sidebarList = document.getElementById('recipe-nav-list');
    if (!sidebarList) return;

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
    document.addEventListener('change', (e) => {
      if (e.target.matches('.ingredient-checkbox')) {
        const item = e.target.closest('.ingredient-item');
        if (item) {
          item.style.textDecoration = e.target.checked ? 'line-through' : 'none';
          item.style.opacity = e.target.checked ? '0.6' : '1';
        }
      }
    });
  }
};
