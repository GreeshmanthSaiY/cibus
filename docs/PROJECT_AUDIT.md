# CIBUS — COMPREHENSIVE INITIAL ENGINEERING AUDIT

- **Audit Date:** 2026-11-08
- **Auditor:** Principal Software Architect, Application Security Engineer & DevOps Engineer
- **Repository:** `https://github.com/GreeshmanthSaiY/cibus`
- **Initial Commit SHA:** `3e93ef9f0e0043c093311855e4447bb1c0054900`
- **Technology Stack:** HTML5, CSS3, Vanilla JavaScript (Static Web Application)

---

## 1. Executive Summary

CIBUS is a web platform celebrating authentic traditional Indian cuisines across 28 Indian States and Union Territories. It features interactive landing pages, culinary showcases, state-by-state regional food menus, recipe card galleries, comprehensive ingredient & step-by-step cooking instructions, interactive shopping/favorites cart, user access interfaces, and contact forms.

However, an exhaustive engineering audit of the codebase in its initial state revealed severe architectural drift, duplicate files with conflicting naming conventions, hardcoded localhost addresses, broken asset paths, invalid HTML elements, syntax errors in SVGs and inline JavaScript, missing error boundaries, untrusted DOM manipulation (`innerHTML`), and non-responsive CSS declarations.

This audit catalogues every deficiency and outlines the recovery strategy.

---

## 2. Inventory of Critical Findings

### 2.1. File Duplication & Ambiguous Naming
The repository contained 37 tracked files with a 100% duplicate split between the root directory and `src/`:
- **Cryptic root names vs. semantic names:**
  - `_new_all_states.html` (root) ⟷ `src/food-menu.html` (identical MD5: `7DA7C1133A20D9B8D3B5A5B5874C9D1D`)
  - `trail_3_uid_recipe_page.html` (root) ⟷ `src/recipe-detail.html` (identical MD5: `0CBFF5BF1E0FFC7CE430BEF4E57A56E2`)
  - `home_auto_effect.html` (root) ⟷ `src/home.html` (identical MD5: `803B38FCDA34D9CC8D22CC664E439C8C`)
  - `form_style.css` (root) ⟷ `src/form.css` (identical MD5: `DBD4D041D12314512D7BA214CEDC293F`)
  - `home_style_auto_effect.css` (root) ⟷ `src/home.css` (identical MD5: `4D7EB7B2908969E25A7733CD24D1A36A`)
- **Direct duplicate names:**
  - `add_to_cart.html`, `contact.html`, `form.html`, `login.html`, `opening_page.html`, `recipe_cards.html`, `style.css`, `favicon.ico` appeared simultaneously in the root and in `src/`.

### 2.2. Hardcoded Localhost (`127.0.0.1:5500`) Links
In `recipe_cards.html`, all 28 recipe card action buttons were hardcoded to:
`http://127.0.0.1:5500/trail_3_uid_recipe_page.html#<anchor>`
*Impact:* In any production deployment (such as Vercel) or when served on any port other than `5500`, every recipe navigation button failed with a connection error.

### 2.3. Broken Local Image & Asset References
Multiple pages and stylesheets referenced files that did not exist in the repository:
1. `home.html` line 76: `url('./UI Design Case study images/uid home page bg image.jpeg')` (Directory does not exist).
2. `home.css` line 64: `url('ezgif.com-gif-maker4.gif')` (Missing file; actual gif is `assets/gif/food-animation.gif`).
3. `login.html` line 17: `url('sign_up-img.jpg')` (Missing file).
4. `form.css` line 11: `url('sign_up-img.jpg')` (Missing file).
5. `style.css` lines 65, 97, 127, 164, 196, 213, 244, 261, 292: `./images/tamarind-rice1.jpg`, `./images/assam-img1.jpg`, `./images/Burmese_Duck_Curry.gif`, etc. (Local `./images` folder does not exist).
6. `README.md` line 15: `screenshots/login.png` (Actual file in repository is `screenshots/login_page.webp`).
7. `recipe-detail.html` line 44: `/recipe_bg_1.jpg` (Missing file).
8. `food-menu.html` line 383: `/WhatsApp Image 2022-04-25 at 4.21.45 PM.jpeg` (Missing file).

### 2.4. Corrupted Base64 Image Data
In `food-menu.html` (lines 549–680), an embedded `data:image/jpeg;base64` string for Bhutte Ka Kees was corrupted with foreign text and clipboard contents (`"FU1RQVWRR... and has deeply pondered on the greatest problems of life..."`), breaking image rendering and bloating file size.

### 2.5. HTML Validation & Syntax Violations
- **Opening Page (`opening_page.html`):**
  - Line 145: `<svg xmlns="http://www.w3.org/1999/xlink"...>` (Invalid XML namespace declaration).
  - Line 354: `<use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />` (Missing closing parenthesis in RGBA declaration).
- **Home (`home.html`):**
  - Line 152: `<p class>` (Malformed empty HTML class attribute).
  - Broken link to `index.html` (Non-existent root entrypoint).
- **Recipe Cards (`recipe_cards.html`):**
  - Repeated identical IDs (`id="booknowbtn"`, `id="visit-header"`, `id="visit-state"`) on all 28 cards, violating W3C specification requiring unique IDs.
  - Interactive element nesting: `<button id="booknowbtn"><a href="...">...</a></button>` (Nesting an `<a>` tag inside a `<button>` tag violates HTML5 semantics and causes unpredictable click event bubbling).
- **Contact Page (`contact.html`):**
  - Lines 301–306: Unclosed `<div>` elements before `</section>`.
- **Add to Cart (`add_to_cart.html`):**
  - Line 18: Malformed attribute `<link srel="shortcut icon"...>`.

### 2.6. JavaScript Defects & Pseudo-Functionality
- **Cart (`add_to_cart.html`):**
  - The cart had no underlying state, data model, or persistence. Clicking "Add to Cart" simply appended CSS class `.clicked` to trigger a temporary micro-animation. There was no capability to view selected items, modify quantities, calculate subtotals, or inspect items.
- **Login (`login.html`):**
  - Form action was simulated via an anchor tag `<a href="home_auto_effect.html">Submit</a>` inside a form. No form submission or credential handling occurred. Both username and password input elements had `name="name"`.
- **Registration (`form.html`):**
  - `confirmEmail(p1, p2)` was named for email but checked passwords, returned `undefined`, and failed to prevent form submission when passwords mismatched.
  - Inputs lacked `name` attributes for standard payload serialization.
- **Contact Form (`contact.html`):**
  - `onclick="validate()"` executed synchronous `alert()` popups and alerted `"We have received your message!"` regardless of input validity or destination endpoint.

### 2.7. Responsive Design & Layout Deficiencies
- `food-menu.html`: `.outer` had hardcoded `height: 19000px; width: 1507.8px;`, creating massive horizontal and vertical overflow on standard desktop and mobile screens.
- `recipe-detail.html`: Fixed 450px column width grid without media query adaptations for tablets or mobile devices.
- `home.html` & `contact.html`: Navigation bar used `float: left` and `float: right` without clearfixes or mobile hamburger navigation, causing link wrapping and overlap on screens `< 768px`.

### 2.8. Security Vulnerabilities
- No Content Security Policy (CSP) or HTTP security headers configured.
- Absence of client-side sanitization for user inputs.
- External dependencies loaded without Subresource Integrity (SRI) hashes.
- Protocol-relative font URLs (`//fonts.googleapis.com/...`).

---

## 3. Consolidation & Action Plan

| Phase | Objective | Scope |
|---|---|---|
| **Phase 1: Inspection & Audit** | Complete full inventory and verification | Document all findings in `docs/` |
| **Phase 2: Complete Backup** | Create independent archive and git bundle | Backup all 37 files to `backup/BACKUP_COMPLETE/` with verified manifest |
| **Phase 3: Git Architecture** | Establish 3-branch governance | Create `update`, `develop`, and preserve `main` |
| **Phase 4: Structural Reorganization** | Clean, modular project layout | Target standard directory tree with clean path strategies |
| **Phase 5: Feature Restoration** | Functional repair across all pages | Restore food menu, recipe details, cart engine, contact, and auth UX |
| **Phase 6: UI/UX Modernization** | Premium culinary aesthetic | Cohesive design system, typography, responsive grid, reduced motion support |
| **Phase 7: Security Hardening** | Frontend security & Vercel headers | Implement CSP, XSS sanitization, input validation, secret hygiene |
| **Phase 8: Automated Quality Gates** | Linting, testing, and CI/CD | Add Playwright, ESLint, HTML validators, and GitHub Actions workflows |
| **Phase 9: Vercel Production Engineering** | Reliable static hosting | Configure `vercel.json`, custom 404, static asset caching |
| **Phase 10: Documentation** | Professional repository guides | Update README, architecture, testing, and deployment documentation |
| **Phase 11: Final Validation** | Full test execution & release | Run verification suite and compile final release report |
