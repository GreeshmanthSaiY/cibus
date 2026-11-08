# CIBUS — AUTOMATED TESTING & QUALITY ASSURANCE GUIDE

- **Version:** 1.0.0
- **Auditor:** QA Automation Engineer & Principal Frontend Engineer

---

## 1. Quality Strategy & Testing Pyramid

To ensure CIBUS is production-ready, regression-free, and maintainable without bloated dependencies, the testing strategy is structured into three tiers:

```text
       ▲
      / \
     /   \     Tier 3: End-to-End Tests (Playwright)
    / E2E \    - Cross-page navigation, cart flows, form submissions, mobile viewports
   /-------\
  / Integr. \  Tier 2: Link & HTML Integrity Validation
 /           \ - Static HTML parsing, broken relative links, missing assets
/-------------\
/   Unit Tests \ Tier 1: Logic Units (Cart, Validation, Storage)
/_______________\ - Price calculations, schema validation, input sanitization
```

---

## 2. Test Suites & Coverage

### 2.1. Unit Tests (`tests/unit/`)
- `tests/unit/cart.test.js`:
  - Cart item addition, deduplication, quantity increments.
  - Subtotal calculation, GST tax computation (5%), and grand total rounding.
  - Item removal and clearing of state.
  - Quantity clamping between 1 and 99.
- `tests/unit/validation.test.js`:
  - Email format validation with compliant RFC patterns.
  - Password strength verification (min 8 chars, mixed case, digits).
  - Password matching and mismatch error generation.
  - Required field validation and XSS tag neutralization.
- `tests/unit/storage.test.js`:
  - Schema verification of stored items.
  - Handling of corrupted or tampered JSON strings in localStorage.
  - Graceful fallback when storage quota is exceeded or storage is disabled.
- `tests/unit/json-validation.test.js`:
  - Schema validation for `data/states.json` (all 28 states, regions, capitals, coordinates).
  - Schema validation for `data/food-items.json` (28+ authentic dishes, prices, ratings, dietary flags).
  - Schema validation for `data/recipes.json` (28 heritage recipes, prep/cook times, servings, ingredients, instructions).
  - Cross-referencing integrity between recipes, food items, and state catalogs.

### 2.2. HTML, Link & Server Integration Tests (`tests/integration/`)
- `tests/integration/html-integrity.test.js`:
  - Checks every HTML file for valid HTML5 DOCTYPE and semantic tags.
  - Existence of all local `href` targets (no dead 404 links).
  - Existence of all local `src` targets (no missing images or scripts).
  - Absence of hardcoded localhost (`127.0.0.1:5500`) references.
  - Absence of duplicate HTML element IDs on the same page.
- `tests/integration/server-probe.js`:
  - Automated HTTP static server probe testing all 18 application routes.
  - Asserts HTTP 200 OK status, proper MIME content-type headers, and positive byte sizes.

### 2.3. End-to-End Browser Tests (`tests/e2e/`)
- Tests executed across Chromium, Firefox, and WebKit (mobile & desktop):
  - **Landing Page Flow:** Splash page loads, clicking "Explore CIBUS" routes to Home.
  - **Food Menu Search & Filter:** Typing a dish name filters cards immediately; clicking state filter displays only that state's culinary specialties.
  - **Recipe Card to Recipe Detail Navigation:** Clicking any of the 28 recipe cards scrolls smoothly to that recipe's anchor in `recipe-detail.html`.
  - **Cart Interaction Flow:**
    - Adding an item increments the header cart badge.
    - Opening `pages/cart.html` displays the item with correct image, name, price, and subtotal.
    - Incrementing quantity updates the total in real time.
    - Removing the item displays the branded empty state with a return button.
  - **Form Validation & Accessible Errors:**
    - Submitting blank forms shows accessible inline error messages.
    - Mismatched passwords prevent submission and announce error.
  - **Mobile Responsive Drawer:**
    - Hamburger button toggles navigation drawer on viewports < 768px.

---

## 3. Running Automated Tests Locally

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Run HTML integrity and link checking
npm run validate:html

# Run End-to-End tests with Playwright
npm run test:e2e

# Run Playwright in UI mode for visual inspection
npm run test:e2e:ui
```

---

## 4. Continuous Integration (GitHub Actions)

Every pull request and push to `update` or `develop` triggers `.github/workflows/quality-checks.yml`, which runs all suites automatically on Ubuntu and Windows virtual environments. Merging into `main` requires 100% green status across all test suites.
