/**
 * CIBUS RECIPES CONTROLLER
 * Manages recipe card rendering, quick links to recipe details, and interactive ingredient checklists
 */

const RecipesController = {
  recipes: [],
  searchQuery: '',

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

  setupCardListeners() {
    const searchInput = document.getElementById('recipe-search-input');
    if (searchInput) {
      searchInput.addEventListener(
        'input',
        Utils.debounce((e) => {
          this.searchQuery = e.target.value.trim().toLowerCase();
          this.renderCards();
        }, 200)
      );
    }
  },

  renderCards() {
    const grid = document.getElementById('recipes-card-grid');
    if (!grid) return;

    const filtered = this.recipes.filter((r) => {
      if (!this.searchQuery) return true;
      return (
        r.name.toLowerCase().includes(this.searchQuery) ||
        r.state.toLowerCase().includes(this.searchQuery) ||
        r.difficulty.toLowerCase().includes(this.searchQuery)
      );
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <span class="empty-state-icon">📖</span>
          <h3>No Recipes Found</h3>
          <p>No regional recipes matched "${Utils.escapeHtml(this.searchQuery)}".</p>
          <button class="btn btn-outline" onclick="document.getElementById('recipe-search-input').value=''; RecipesController.searchQuery=''; RecipesController.renderCards();">Clear Search</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered
      .map((r) => {
        const fallbackImg =
          'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80';

        return `
        <article class="card recipe-card">
          <div class="card-img-wrap">
            <img src="${fallbackImg}" alt="${Utils.escapeHtml(r.name)}" loading="lazy">
            <span class="card-tag">${Utils.escapeHtml(r.difficulty)}</span>
          </div>
          <div class="card-body">
            <span class="card-state-eyebrow">${Utils.escapeHtml(r.state)}</span>
            <h3 class="card-title">${Utils.escapeHtml(r.name)}</h3>
            <div class="recipe-meta-row">
              <span class="recipe-meta-item">⏱️ Prep: ${Utils.escapeHtml(r.prepTime)}</span>
              <span class="recipe-meta-item">🔥 Cook: ${Utils.escapeHtml(r.cookTime)}</span>
              <span class="recipe-meta-item">🍽️ ${Utils.escapeHtml(String(r.servings))} Servings</span>
            </div>
            <div class="card-footer" style="padding-top: var(--space-md); border-top: none;">
              <a href="./recipe-detail.html#${Utils.escapeHtml(r.id)}" class="btn btn-primary btn-block">
                View Full Recipe & Instructions &rarr;
              </a>
            </div>
          </div>
        </article>
      `;
      })
      .join('');
  },

  setupDetailSidebar() {
    const sidebarList = document.getElementById('recipe-nav-list');
    if (!sidebarList) return;

    sidebarList.innerHTML = this.recipes
      .map((r) => `
        <li class="recipe-nav-item" id="nav-${Utils.escapeHtml(r.id)}">
          <a href="#${Utils.escapeHtml(r.id)}">
            ${Utils.escapeHtml(r.name)} <small>(${Utils.escapeHtml(r.state)})</small>
          </a>
        </li>
      `)
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
