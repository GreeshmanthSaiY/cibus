# CIBUS — Automated Testing & Quality Assurance Guide

- **Version:** 2.0.0
- **Auditor:** QA Automation & Frontend Test Lead
- **Status:** All Suites Passing (100% Pass Rate)

---

## 1. Quality Strategy & Testing Pyramid

To ensure CIBUS is production-ready, regression-free, and maintainable without bloated dependencies, the testing strategy is structured into three tiers:

```text
       ▲
      / \
     /   \     Tier 3: E2E & Server Integration Probes
    / E2E \    - HTTP 200 OK route probing across 37 endpoints
   /-------\
  / Integr. \  Tier 2: Link & HTML Integrity Validation
 /           \ - Static HTML parsing, broken relative links, missing assets
/-------------\
/   Unit Tests \ Tier 1: Logic Units (Auth, Cart, Validation, Storage, Datasets)
/_______________\ - Price calculations, schema validation, input sanitization
```

---

## 2. Test Suites & Coverage

### 2.1. Unit Tests (`tests/unit/`)
- `tests/unit/auth.test.js`:
  - Seeds default demo user on initialization (`demo@cibus.com`).
  - Registers new users into session registry with duplicate email rejection.
  - Authenticates registered users and manages active sessions.
  - Verifies logout cleanly terminates active sessions and empties session cart and notifications.
- `tests/unit/cart.test.js`:
  - Cart item addition, deduplication, quantity increments.
  - Subtotal calculation, GST tax computation (5%), and grand total rounding.
  - Item removal and clearing of state.
  - Quantity clamping between 1 and 99.
  - Clears cart when signed out.
- `tests/unit/validation.test.js`:
  - Email format validation with compliant RFC patterns.
  - Password strength verification (min 8 chars, mixed case, digits).
  - Password matching and mismatch error generation.
  - Required field validation and XSS tag neutralization.
- `tests/unit/storage.test.js`:
  - Schema verification of stored items.
  - Handling of corrupted or tampered JSON strings in localStorage.
  - Graceful fallback when storage quota is exceeded or storage is disabled.
- `tests/unit/datasets.test.js`:
  - Schema validation for `data/states.json` (all 28 states, regions, capitals).
  - Schema validation for `data/food-items.json` (28 authentic dishes, prices, categories).
  - Schema validation for `data/recipes.json` (28 heritage recipes, prep/cook times, servings, ingredients, instructions).
  - Cross-referencing integrity between recipes, food items, and state catalogs.

### 2.2. HTML, Asset & Link Integrity Tests (`tests/integration/`)
- `tests/integration/html-integrity.test.js`:
  - Checks all 11 HTML files for valid HTML5 DOCTYPE and semantic tags.
  - Verifies existence of all local `href` targets (no dead 404 links).
  - Verifies existence of all local `src` targets (no missing images or scripts).
  - Asserts absence of hardcoded localhost (`127.0.0.1:5500`) references.
  - Asserts absence of duplicate HTML element IDs on the same page.
- `tests/integration/server-probe.js`:
  - Automated HTTP static server probe testing all 37 application routes.
  - Asserts HTTP 200 OK status, proper MIME content-type headers, and positive byte sizes.

---

## 3. Running Automated Tests Locally

```bash
# 1. Run full unit test suite (22 unit tests)
npm test

# 2. Run HTML integrity and link checking (11 HTML files)
npm run validate:html

# 3. Run server route probe (37 endpoints)
npm run test:probe

# 4. Run full validation suite (unit tests + HTML integrity)
npm run test:all

# 5. Run production build verification gate
npm run build
```

---

## 4. Continuous Integration (GitHub Actions)

Every pull request and push to `update`, `develop`, and `main` triggers automated CI execution via `.github/workflows/quality-checks.yml`:
1. Checkout and Node.js 20 LTS setup.
2. Unit test execution via native Node.js test runner (`node --test`).
3. HTML and asset integrity auditing.
4. Server route probe execution.
5. Secret and credential scanning.
6. Production verification script (`scripts/verify-build.js`).

