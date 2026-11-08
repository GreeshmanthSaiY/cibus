# CIBUS — FILE MIGRATION & CONSOLIDATION MAP

- **Document Version:** 1.0.0
- **Auditor:** DevOps Engineer & Senior Frontend Engineer

This document specifies the exact disposition and migration path for every single file from the original repository state.

---

## 1. Migration Overview & Strategy

The original project suffered from exact file duplicates between the root directory and `src/`, as well as inconsistent and cryptic naming (`trail_3_uid_recipe_page.html`, `_new_all_states.html`, `home_auto_effect.html`).

**Resolution Strategy:**
1. All 37 original files are permanently archived in `backup/BACKUP_COMPLETE/` and verified with SHA256 checksums.
2. Canonical files were compared using MD5 hashing (demonstrating 100% binary identity between root and `src` duplicates).
3. The codebase is consolidated into a clean, modern architecture:
   - Root `index.html` serves as the primary application entrypoint.
   - Secondary pages are organized in `pages/`.
   - Stylesheets are modularized in `css/`.
   - JavaScript modules are organized in `js/`.
   - Culinary data is externalized into clean JSON files in `data/`.
   - Public assets are structured in `public/assets/`.

---

## 2. Comprehensive File Migration Matrix

| # | Original File Path(s) | Original MD5 Checksum | Target Location | Migration Action & Rationale |
|---|---|---|---|---|
| 1 | `opening_page.html`<br>`src/opening_page.html` | `96AA293A07212180EF3B382FEBD171A4` | `index.html` | **Consolidate & Promote:** Converted into the root landing page (`index.html`) so visitors land on the iconic welcome splash with animated waves and Indian chakra. Repaired SVG syntax and added WCAG-compliant navigation. |
| 2 | `home_auto_effect.html`<br>`src/home.html` | `803B38FCDA34D9CC8D22CC664E439C8C` | `pages/home.html` | **Consolidate & Modernize:** Migrated to semantic `pages/home.html`. Fixed broken background image paths and integrated responsive navigation. |
| 3 | `_new_all_states.html`<br>`src/food-menu.html` | `7DA7C1133A20D9B8D3B5A5B5874C9D1D` | `pages/food-menu.html` | **Consolidate & Refactor:** Migrated to `pages/food-menu.html`. Replaced hardcoded `19000px` height with responsive CSS Grid, repaired corrupted base64 image data, and integrated instant search and region filters. |
| 4 | `recipe_cards.html`<br>`src/recipe_cards.html` | `7136E771BC3B951A1BBF00E5EC59F296` | `pages/recipe-cards.html` | **Consolidate & Repair:** Migrated to `pages/recipe-cards.html`. Replaced broken `http://127.0.0.1:5500/trail_3_uid_recipe_page.html#...` links with relative paths to `recipe-detail.html#...`. Fixed duplicate ID attributes. |
| 5 | `trail_3_uid_recipe_page.html`<br>`src/recipe-detail.html` | `0CBFF5BF1E0FFC7CE430BEF4E57A56E2` | `pages/recipe-detail.html` | **Consolidate & Enhance:** Migrated to `pages/recipe-detail.html`. Cleaned layout, added responsive sidebar navigation for jumping directly to any of the 28 recipes, and added interactive ingredient checkboxes. |
| 6 | `add_to_cart.html`<br>`src/add_to_cart.html` | `71FB2398F025597A71D1DF3E1D89EAB3` | `pages/cart.html` | **Consolidate & Implement:** Migrated to `pages/cart.html`. Built complete cart engine with item management, quantity controls, subtotal/tax/total calculations, and LocalStorage persistence. |
| 7 | `login.html`<br>`src/login.html` | `DB13514CA07A3A2BF5C452970E29376D` | `pages/login.html` | **Consolidate & Harden:** Migrated to `pages/login.html`. Fixed duplicate input names, added accessible form validation, and added honest client interface boundaries. |
| 8 | `form.html`<br>`src/form.html` | `74BDF9B3456A5036B7C33BCA79760B9C` | `pages/register.html` | **Consolidate & Rename:** Renamed `form.html` to semantic `pages/register.html`. Corrected password confirmation logic, added standard input names, and removed inline event handlers. |
| 9 | `contact.html`<br>`src/contact.html` | `9F616E91763F63C03870346CCACE3C90` | `pages/contact.html` | **Consolidate & Fix:** Migrated to `pages/contact.html`. Repaired unclosed HTML tags, replaced disruptive `alert()` dialogs with accessible inline alerts and feedback states. |
| 10 | `favicon.ico`<br>`assets/icons/favicon.ico` | `FE032DF7FA10B8E00BEDE8FABB1A785C` | `public/favicon.ico`<br>`public/assets/icons/favicon.ico` | **Preserve & Relocate:** Placed at root of `public/` and under `public/assets/icons/` for universal browser discovery. |
| 11 | `home_style_auto_effect.css`<br>`src/home.css` | `4D7EB7B2908969E25A7733CD24D1A36A` | `css/pages/home.css` | **Consolidate & Modernize:** Migrated into modular page stylesheet `css/pages/home.css`, eliminating invalid image references. |
| 12 | `form_style.css`<br>`src/form.css` | `DBD4D041D12314512D7BA214CEDC293F` | `css/pages/forms.css` | **Consolidate & Modernize:** Migrated to `css/pages/forms.css`, unifying login and registration styling with design tokens. |
| 13 | `style.css`<br>`src/style.css` | `713B946FFB6BEA9BB4E1B23E85E155BC` | `css/main.css`<br>`css/layout.css` | **Refactor & Modularize:** Refactored into unified CSS architecture with design tokens in `variables.css`, universal layouts in `layout.css`, and reusable components in `components.css`. |
| 14 | `assets/gif/food-animation.gif` | `4B15CD05F52ECE4A635C0098C16663B85AB8DE888EE3F90746E852DFAF91C5B5` | `public/assets/gif/food-animation.gif` | **Preserve:** Moved to `public/assets/gif/food-animation.gif` as the primary animated culinary showcase visual. |
| 15 | `assets/images/food-photo.jpeg` | `60377DBBD531CE6ED62FCF4AF6B3CFAF806C3D0E961B651E8B62F6169F55C1D4` | `public/assets/images/food-photo.jpeg` | **Preserve:** Moved to `public/assets/images/food-photo.jpeg` as high-definition food visual. |
| 16 | `docs/Cibus_Project_Documentation.docx` | `6C2B19DF000541E297C10B64762C4BD300A1A5C7E1FE13FF369DDEEB5F2E6EE9` | `docs/legacy/Cibus_Project_Documentation.docx` | **Preserve:** Preserved under `docs/legacy/` for historical reference. |
| 17 | `screenshots/*` (6 files) | Various | `public/assets/screenshots/*` | **Preserve & Link:** Kept available for documentation and visual regression auditing. |
| 18 | `.gitignore` | `97DFFAB1CD1D29352BF76EFAB905ACF6FB3F50F9512F08ABC4EDFA0D430FFC45` | `.gitignore` | **Update:** Updated to explicitly exclude `backup/`, build output, node_modules, and secret files. |
| 19 | `README.md` | `5846B89A39016D6D9770121E49B76CFA703A163C5C0B884627DE53C74DAE8771` | `README.md` | **Rewrite:** Comprehensive professional rewrite documenting modern architecture, workflows, setup, and features. |

---

## 3. Newly Created Structural & Functional Files

| New File Path | Purpose |
|---|---|
| `vercel.json` | Production deployment configuration with route rewriting, security headers, and static caching |
| `package.json` | Modern NPM project manifest with testing scripts (Playwright, ESLint, Prettier, HTML validator) |
| `.editorconfig` | Cross-editor indentation and newline standard configuration |
| `SECURITY.md` | Security disclosure, CSP documentation, and frontend security policy |
| `LICENSE` | Standard MIT Open Source License |
| `public/robots.txt` | Crawler indexing instructions |
| `public/sitemap.xml` | Search engine discoverability sitemap |
| `pages/404.html` | Custom branded error page |
| `css/variables.css` | Design system tokens (colors, typography, spacing, shadows, radius) |
| `css/reset.css` | Modern CSS reset and baseline styling |
| `css/layout.css` | Responsive header, navigation, container, and footer grid/flex styles |
| `css/components.css` | Buttons, food cards, badge counters, toasts, modals, and quantity selectors |
| `css/responsive.css` | Consolidated media queries across mobile, tablet, and widescreen |
| `js/config.js` | Universal application constants, routes, and currency settings |
| `js/utils.js` | XSS sanitization, DOM helpers, toast alerts, price formatting |
| `js/storage.js` | Schema-validated LocalStorage abstraction with defensive error handling |
| `js/cart.js` | Production cart engine (item addition, quantity updates, subtotal/tax calculations, empty states) |
| `js/navigation.js` | Responsive mobile drawer toggle, active route highlighting, cart counter sync |
| `js/food-menu.js` | Interactive search, state filtering tabs, quick-add actions |
| `js/recipes.js` | Recipe search, state filtering, bookmarking, and smooth anchor scrolling |
| `js/validation.js` | Robust accessible form validation with live feedback |
| `js/forms.js` | Contact, login, and registration form submission controllers |
| `js/main.js` | Global application initialization and event delegation |
| `data/states.json` | Metadata for 28 Indian States & Union Territories |
| `data/food-items.json` | Traditional dishes dataset with prices, states, and descriptions |
| `data/recipes.json` | Step-by-step recipe instructions, ingredients, cooking and prep times |
| `.github/workflows/quality-checks.yml` | GitHub Actions workflow for PRs and pushes to `update` & `develop` |
| `.github/PULL_REQUEST_TEMPLATE.md` | Standardized pull request template with QA and security checklist |
| `tests/unit/*.test.js` | Unit tests for cart calculations, storage, and form validation |
| `tests/e2e/*.spec.js` | End-to-end browser tests for navigation, cart flows, and responsiveness |
