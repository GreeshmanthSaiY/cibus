# Changelog

All notable changes to the CIBUS platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-11-14

### Added
- **Mobile Navigation Drawer & Responsive Layout on Welcome Gateway:**
  - Added slide-in mobile navigation drawer (`.landing-mobile-drawer`) and hamburger toggle (`.landing-nav-toggle`) to `index.html`.
  - Added URL parameter support (`?openMenu=true`) for programmatic menu activation and deep-linking.
  - Responsive logo and Ashoka Chakra proportions across small mobile (320px), standard mobile (360px-390px), large mobile (430px), tablet (768px), and desktop.
  - Standardized 48px minimum touch targets and centered CTA button layout on mobile.
- **Breadcrumb Navigation in Recipe Detail:**
  - Added top "Back to Recipes Gallery" breadcrumb navigation on `pages/recipe-detail.html`.
- **Automated Genuine Multi-Device Screenshot Suite:**
  - Added headless Chrome screenshot pipeline capturing desktop, tablet, and mobile views (`scripts/capture-screenshots.js`).

### Fixed
- **Section Option Buttons & Navigation Responsiveness:**
  - Eliminated delayed artificial page transition timer and link hijack in `js/motion/motion-engine.js`, restoring instant native navigation.
  - Removed accidental `pointer-events: none` on `body.page-is-leaving` that locked mobile gestures.
  - Fixed syntax error in `css/layout.css` around mobile drawer styling and ensured robust pointer-events handling for open/closed states.
  - Fixed regional filter pills in `pages/home.html` by binding click event listeners synchronously prior to dataset fetching.
  - Added URL search parameter parsing (`?region=`, `?filter=`, `?search=`) in `js/food-menu.js` so footer region links automatically activate corresponding filter pills.
- **Unified Back-To-Top Button Engineering:**
  - Upgraded `js/navigation.js` to observe hero boundary via `IntersectionObserver` across all pages.
  - Removed redundant conflicting `#back-to-top-btn` scripts and styles from `js/recipes.js` and `css/pages/recipes.css`.
  - Unified smooth scrolling with `prefers-reduced-motion` detection, accessibility state (`aria-hidden`), safe-area insets, and high-contrast `:focus-visible` styling.
- **Hero-to-Footer Layout & Gap Elimination:**
  - Configured flex layout on landing header and body to eliminate unintended cream gaps between wave graphics and footer across all mobile viewports.
- **Local Development Server Output:**
  - Simplified server startup banner in `server.js` to display clean local-only address.

---

## [2.0.0] - 2026-11-11

### Added
- **Official Brand Artwork & Multi-Resolution Favicon Suite:**
  - High-resolution master transparent RGBA logo (`public/assets/images/cibus-logo.png`).
  - High-DPI header logo (`cibus-logo-header.png`).
  - Multi-resolution `.ico` (16x16, 32x32, 48x48), PNG favicons, Apple touch icon, and Android/PWA icons.
  - Standardized favicon and manifest tags across all 11 HTML pages.
- **Welcome Page Navigation & Discoverability:**
  - Added frosted-glass top utility bar (`.landing-top-nav`) on `index.html` with direct links to Explore, Menu, Contact, Sign In, and Create Account.
  - Added contextual hero secondary links (`.landing-hero-auth`) directly beneath hero action buttons.
  - Balanced Ashoka Chakra size (44px) and spacing for visual hierarchy.
- **Production Vercel Deployment Architecture:**
  - Resolved Vercel 404 NOT_FOUND via explicit `"outputDirectory": "."` in `vercel.json`.
  - Added root `404.html` and clean rewrites pipeline.
  - Created zero-compilation build verification gate (`scripts/verify-build.js`).
- **Telemetry & Performance Instrumentation:**
  - Non-blocking static integration of Vercel Web Analytics and Speed Insights.
  - Zero-overhead local development stub in `server.js`.
  - LCP/CLS optimizations on hero images, fonts, and brand assets.
- **Security & Runtime Parity:**
  - Content Security Policy (CSP), HSTS, nosniff, SAMEORIGIN, and permissions policies applied across Vercel and local `server.js`.
  - Added `.nvmrc` locking runtime to Node.js 20 LTS (`20.18.0`).
  - Clarified personal project copyright and set `"license": "UNLICENSED"`.
- **Dynamic In-Card Quantity Steppers & Notifications:**
  - Dynamic in-card cart steppers on `food-menu.html`.
  - Notification center with sliding panel, celebration animations, and auto-dismiss toasts.
- **Structured Documentation Architecture:**
  - Level 1 Recruiter-Grade `README.md`.
  - Level 2 categorized documentation under `docs/architecture/`, `docs/deployment/`, `docs/security/`, `docs/development/`, and `docs/project/`.
  - Level 3 GitHub engineering templates (`.github/ISSUE_TEMPLATE/`, `PULL_REQUEST_TEMPLATE.md`, `SECURITY.md`).

### Fixed
- Fixed 404 error when navigating to root URL on Vercel deployment.
- Fixed layout overflows and hardcoded localhost URLs (`127.0.0.1:5500`).
- Fixed cart state not emptying upon user logout.
- Fixed notification alerts firing when user is signed out.

---

## [1.0.0] - 2026-11-08

### Added
- Initial conceptual prototype with 28 Indian state culinary dishes and recipes.
- Basic HTML layout and CSS styling.

