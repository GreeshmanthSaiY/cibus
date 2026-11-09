/**
 * CIBUS APPLICATION CONFIGURATION
 * Single source of truth for global routes, currency symbols, and storage keys
 */

const CIBUS_CONFIG = Object.freeze({
  APP_NAME: 'CIBUS',
  APP_TAGLINE: 'Traditional Indian Cuisines & Heritage Recipes',
  VERSION: '2.0.0',
  CURRENCY_SYMBOL: '₹',
  TAX_RATE: 0.05, // 5% GST on culinary services
  STORAGE_KEYS: Object.freeze({
    CART: 'cibus_cart_v2',
    AUTH_DEMO_USER: 'cibus_demo_user',
    BOOKMARKS: 'cibus_recipe_bookmarks'
  }),
  DEFAULT_PLACEHOLDER_IMAGE: '../public/assets/images/dishes/biriyani.webp',
  ROUTES: Object.freeze({
    HOME: './home.html',
    FOOD_MENU: './food-menu.html',
    RECIPES: './recipe-cards.html',
    RECIPE_DETAIL: './recipe-detail.html',
    CART: './cart.html',
    LOGIN: './login.html',
    REGISTER: './register.html',
    CONTACT: './contact.html'
  })
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CIBUS_CONFIG };
}
