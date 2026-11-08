# CIBUS — ARCHITECTURE DESIGN SPECIFICATION

- **Version:** 2.0.0
- **Architect:** Principal Software Architect
- **Status:** Approved Target Architecture

---

## 1. Architectural Philosophy

CIBUS is engineered as a high-performance, modular, zero-dependency static web application. It delivers a fast, responsive, and secure experience without the unnecessary overhead, hydration delays, and build fragility of heavy JavaScript frameworks.

The architecture emphasizes:
1. **Semantic HTML5:** Native accessible markup, correct landmark structures, and standard form controls.
2. **Modular CSS3:** Custom properties design system (design tokens), flexbox/CSS grid layouts, zero CSS framework bloat, and `prefers-reduced-motion` compliance.
3. **Pure Vanilla Modern JavaScript (ES6+):** Pure functions, encapsulated state modules (Cart, Navigation, Search/Filter, Storage), declarative DOM bindings, and strict DOM sanitization.
4. **Resilient Local & CDN Pathing:** Universal relative paths enabling identical execution in local development, preview deployments, and production Vercel environments.
5. **Security in Depth:** Rigid Content Security Policy (CSP), subresource integrity, XSS immunity, and safe state persistence.

---

## 2. Target Directory Hierarchy

```text
cibus/
│
├── index.html                  # Root landing & splash entrypoint
├── .gitignore                  # Git tracking rules (protecting backups, env, build)
├── .editorconfig               # Consistent cross-platform indentation & formatting
├── .npmrc                      # Package manager configuration
├── package.json                # Project scripts, dev dependencies, test tooling
├── package-lock.json           # Locked dependency tree
├── vercel.json                 # Vercel deployment routing, security headers & caching
├── README.md                   # Comprehensive project documentation & usage guide
├── SECURITY.md                 # Security policies, disclosure & hardening guide
├── LICENSE                     # Open source license (MIT)
│
├── public/                     # Static assets served at root
│   ├── favicon.ico             # Application favicon
│   ├── robots.txt              # Search engine crawler policies
│   ├── sitemap.xml             # Search engine indexing map
│   └── assets/
│       ├── images/             # High-definition food imagery & fallbacks
│       │   └── food-photo.jpeg
│       ├── icons/              # SVG and ICO icons
│       │   └── favicon.ico
│       ├── gif/                # Hero animations & UI micro-interactions
│       │   └── food-animation.gif
│       └── fonts/              # Typography assets (if self-hosted)
│
├── pages/                      # Application views & pages
│   ├── home.html               # Main culinary discovery hub
│   ├── food-menu.html          # Comprehensive 28 Indian states food directory
│   ├── recipe-cards.html       # Visual card gallery of regional recipes
│   ├── recipe-detail.html      # In-depth ingredients & preparation instructions
│   ├── cart.html               # Interactive shopping & favorites cart with drawer
│   ├── login.html              # Clean authentication interface
│   ├── register.html           # New user sign-up form with live validation
│   ├── contact.html            # Contact inquiry form with feedback states
│   └── 404.html                # Custom styled, branded fallback page
│
├── css/                        # Modular stylesheet architecture
│   ├── variables.css           # Global design tokens (colors, typography, spacing, shadows)
│   ├── reset.css               # Modern CSS reset & box-sizing normalization
│   ├── layout.css              # Universal grid, flex containers, headers & footers
│   ├── components.css          # Cards, buttons, badges, modals, drawers & toasts
│   ├── responsive.css          # Media queries across mobile, tablet, and widescreen
│   ├── main.css                # Master stylesheet importing variables & components
│   └── pages/                  # Page-specific styling rules
│       ├── landing.css         # Animated wave & hero section styles
│       ├── home.css            # Culinary showcase styles
│       ├── food-menu.css       # Menu filters & state cuisine showcases
│       ├── recipes.css         # Recipe card grids & detail instruction tables
│       ├── cart.css            # Cart summary, quantity controls, empty states
│       └── forms.css           # Unified authentication & contact form styling
│
├── js/                         # Modular client-side scripts
│   ├── config.js               # Global application constants & route definitions
│   ├── utils.js                # DOM helpers, sanitization, price formatting, toast notifications
│   ├── storage.js              # Safe LocalStorage wrapper with schema validation
│   ├── navigation.js           # Responsive mobile navigation & active link handlers
│   ├── cart.js                 # Complete cart state engine (add, remove, qty, calculations)
│   ├── food-menu.js            # State menu search, filter, and quick-add logic
│   ├── recipes.js              # Recipe card search, state filter & deep link routing
│   ├── validation.js           # Real-time form validation engine with accessible error states
│   ├── forms.js                # Contact, login & register form submit handlers
│   └── main.js                 # Application bootstrapper & global event delegation
│
├── data/                       # Structured JSON culinary datasets
│   ├── states.json             # 28 Indian States & Union Territories metadata
│   ├── food-items.json         # Traditional dishes, descriptions, prices & state tags
│   └── recipes.json            # Step-by-step cooking recipes, prep times & ingredients
│
├── docs/                       # Architectural & operational documentation
│   ├── PROJECT_AUDIT.md        # Complete pre-migration engineering audit
│   ├── ARCHITECTURE.md         # Architecture specification (this file)
│   ├── EXISTING_FEATURES.md    # Feature catalogue & preservation record
│   ├── FILE_MIGRATION_MAP.md   # Exact migration mapping of all legacy files
│   ├── SECURITY_AUDIT.md       # Frontend security review & CSP configuration
│   ├── DEPLOYMENT_GUIDE.md     # Step-by-step Vercel & GitHub deployment guide
│   └── TESTING_GUIDE.md        # Test execution guide for unit, E2E & a11y checks
│
├── tests/                      # Automated quality & testing suites
│   ├── unit/                   # Unit tests for cart, validation, and storage modules
│   │   ├── cart.test.js
│   │   ├── validation.test.js
│   │   └── storage.test.js
│   ├── e2e/                    # Playwright end-to-end browser tests
│   │   ├── navigation.spec.js
│   │   ├── cart.spec.js
│   │   ├── recipes.spec.js
│   │   └── forms.spec.js
│   └── security/               # Security & headers validation tests
│       └── headers.spec.js
│
└── .github/                    # GitHub repository configurations
    ├── workflows/
    │   ├── quality-checks.yml  # Pull request & push CI workflow
    │   ├── develop-preview.yml # Develop branch preview check
    │   └── production-check.yml# Production release validation
    └── PULL_REQUEST_TEMPLATE.md# Pull request template with checklists
```

---

## 3. Data Flow & State Management

```mermaid
flowchart TD
    User([User]) -->|Browses Dishes| Menu[Food Menu / Recipe Cards]
    Menu -->|Selects Item| CartEngine[Cart State Engine - js/cart.js]
    CartEngine -->|Serializes & Validates| StorageModule[Safe Storage - js/storage.js]
    StorageModule -->|Stores JSON| LocalStorage[(Browser LocalStorage)]
    CartEngine -->|Dispatches CustomEvent| CartUI[Cart Page & Header Badge]
    User -->|Submits Contact / Auth| FormValidator[Form Engine - js/validation.js]
    FormValidator -->|Sanitized Input| FormHandler[Form Handler - js/forms.js]
    FormHandler -->|Feedback Toast| NotificationSystem[Toast Notification System]
```

### 3.1. Cart State Contract
The shopping & favorites cart persists data under the key `cibus_cart_v2`. Schema:
```json
[
  {
    "id": "pulihora",
    "name": "Pulihora",
    "state": "Andhra Pradesh",
    "price": 180,
    "quantity": 2,
    "image": "assets/images/food-photo.jpeg"
  }
]
```
- Quantities are strictly clamped between `1` and `99`.
- Non-integer or non-numeric values are automatically sanitized.
- Subtotal, estimated tax (5%), and grand total are calculated dynamically.

---

## 4. Design System Tokens (CSS Custom Properties)

```css
:root {
  /* Brand Palette - Inspired by authentic Indian spices & culinary warmth */
  --color-primary: #C74B16;          /* Deep saffron / terracotta */
  --color-primary-dark: #9A340B;     /* Roasted spice */
  --color-primary-light: #FDE8DE;    /* Warm cream */
  --color-secondary: #0A6B48;        /* Cardamom / Indian green */
  --color-secondary-dark: #064E34;   /* Deep emerald */
  --color-accent: #E68A00;           /* Golden turmeric */
  --color-accent-light: #FFF4D9;     /* Saffron tint */

  /* Neutral Surface Palette */
  --color-surface-bg: #FAF7F2;       /* Warm linen backdrop */
  --color-surface-card: #FFFFFF;     /* Crisp card surface */
  --color-surface-elevated: #F4EFEA; /* Subtle container wash */
  --color-text-main: #1C1917;        /* Charcoal ink */
  --color-text-muted: #645D56;       /* Stone grey */
  --color-border: #E7DFD5;           /* Soft border separator */

  /* Status Tokens */
  --color-success: #15803D;
  --color-error: #B91C1C;
  --color-warning: #B45309;

  /* Typography Scale */
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, monospace;

  /* Shadow & Elevation System */
  --shadow-sm: 0 1px 2px 0 rgba(28, 25, 23, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(28, 25, 23, 0.08), 0 2px 4px -2px rgba(28, 25, 23, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(28, 25, 23, 0.1), 0 4px 6px -4px rgba(28, 25, 23, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(28, 25, 23, 0.12), 0 8px 10px -6px rgba(28, 25, 23, 0.04);

  /* Spacing Scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Border Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;
}
```

---

## 5. Deployment Architecture on Vercel

- **Hosting Provider:** Vercel (Static Web Server)
- **Zero Build Step:** Native pure static assets deployed directly without bundling, maximizing edge cache hits and eliminating build failures.
- **Root Entrypoint:** `index.html` (which serves as the interactive landing page with links to `pages/home.html`, `pages/food-menu.html`, etc.).
- **Direct Page Routing:** Clean path configuration via `vercel.json` supporting both extensionless URLs (`/pages/home`) and explicit `.html` URLs (`/pages/home.html`), plus custom 404 handling.
- **Global Edge Caching:** Static assets (`/public/assets/*`, `/css/*`, `/js/*`) configured with immutable cache-control headers (`public, max-age=31536000, immutable`).
