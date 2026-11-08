# 🍽️ CIBUS — Celebrating Traditional Indian Cuisines & Heritage Recipes

> **Cibus** (*Latin for "Food"*) is an authentic, production-ready static web application engineered to celebrate the culinary diversity of India across its **28 States and Union Territories**. Built with semantic HTML5, modular CSS3, and vanilla modern JavaScript (ES6+), CIBUS enables food lovers and home cooks to explore regional dishes, follow step-by-step cooking recipes with ingredient checklists, manage an interactive shopping and favorites cart, and experience a modern, accessible interface.

---

## 📸 Application Screenshots

| Opening / Splash Page | Food Menu by States | Recipe Cards Gallery |
| :---: | :---: | :---: |
| ![Opening Page](public/assets/screenshots/opening_page.png) | ![Food Menu](public/assets/screenshots/food_menu.png) | ![Recipe Cards](public/assets/screenshots/recipe_cards.png) |

| Shopping Cart & Favorites | Step-by-Step Recipe Detail | User Sign In & Access |
| :---: | :---: | :---: |
| ![Add to Cart](public/assets/screenshots/add_to_cart.png) | ![Recipe Detail](public/assets/screenshots/recipe_detail.png) | ![Login](public/assets/screenshots/login_page.webp) |

*Archived project screenshots are preserved in [`public/assets/screenshots/`](./public/assets/screenshots/).*

---

## 🌟 Core Features & Highlights

- **🇮🇳 Tricolor Splash Page (`index.html`):** Welcoming landing experience featuring an animated 24-spoke Ashoka Chakra emblem, multi-layer CSS parallax waves, and responsive call-to-actions.
- **🏛️ Cultural Exploration Hub (`pages/home.html`):** Culinary hub featuring reflections on Indian culture by Indologist Max Müller, quick-access regional cards, and heritage philosophy.
- **🍛 Comprehensive 28-State Directory (`pages/food-menu.html`):** Instant client-side search by dish, state, or ingredients, real-time region filters (North, South, East, West, Central, Northeast, Vegetarian), and one-click quick add to cart.
- **🎴 Visual Recipe Cards Gallery (`pages/recipe-cards.html`):** Responsive card collection linking directly to specific dishes across all 28 states with difficulty and timing badges.
- **📜 Detailed Recipe Instructions (`pages/recipe-detail.html`):** Complete ingredient checklists with interactive cooking checkboxes, step-by-step numbered instructions, and a sticky quick-jump sidebar.
- **🛒 Production-Grade Cart Engine (`pages/cart.html`):**
  - Add, remove, and adjust portions (clamped between 1 and 99).
  - Real-time calculations for subtotal, 5% GST, and grand total.
  - LocalStorage persistence with defensive schema validation.
  - Interactive empty cart state with quick navigation back to the food menu.
  - Live item count badge in the top navigation bar across all pages.
- **🔐 Honest Authentication Interfaces (`pages/login.html` & `pages/register.html`):**
  - Live client-side email format validation (RFC-compliant).
  - Strong password policy enforcement (minimum 8 characters, uppercase, lowercase, number).
  - Confirm password synchronization check with accessible error announcements.
  - Clearly articulated demonstration boundaries (no mock secrets or insecure storage).
- **📬 Accessible Contact Center (`pages/contact.html`):** Accessible form with live character counters, field validation, and real operational culinary inquiry contacts.
- **📱 100% Responsive Design:** Optimized breakpoints covering mobile portrait, mobile landscape, tablets, laptops, and wide desktop screens.

---

## 🏗️ Application Architecture

CIBUS is engineered as a zero-dependency static web application, maximizing edge performance, zero build delays, and high security.

```text
cibus/
├── index.html                  # Root landing page (Tricolor splash & waves)
├── vercel.json                 # Vercel deployment routing, caching & CSP headers
├── package.json                # Project scripts, test runner, and metadata
├── .gitignore                  # Git tracking rules
├── .editorconfig               # Formatting & indentation standards
├── .env.example                # Environment variables template
├── README.md                   # Project documentation
├── SECURITY.md                 # Security policies & vulnerability reporting
├── LICENSE                     # MIT Open Source License
│
├── public/                     # Static discovery assets
│   ├── favicon.ico             # Browser favicon
│   ├── robots.txt              # Search engine crawler policies
│   ├── sitemap.xml             # Search engine indexing map
│   └── assets/                 # Brand imagery and media
│       ├── images/             # Food photography
│       ├── icons/              # Favicon & icons
│       ├── gif/                # Culinary UI animation
│       └── screenshots/        # Application screenshots
│
├── pages/                      # Application views
│   ├── home.html               # Main culinary discovery hub
│   ├── food-menu.html          # 28-state food directory with filters
│   ├── recipe-cards.html       # Visual recipe gallery
│   ├── recipe-detail.html      # Step-by-step cooking instructions
│   ├── cart.html               # Shopping cart & order calculations
│   ├── login.html              # Sign-in interface
│   ├── register.html           # New user registration interface
│   ├── contact.html            # Contact inquiry form
│   └── 404.html                # Branded 404 fallback page
│
├── css/                        # Modular CSS architecture
│   ├── main.css                # Master stylesheet
│   ├── variables.css           # Design tokens (colors, spacing, typography)
│   ├── reset.css               # Box-sizing & layout reset
│   ├── layout.css              # Navbars, headers, containers, footers
│   ├── components.css          # Cards, buttons, filter pills, toasts, badges
│   ├── responsive.css          # Media query breakpoints
│   └── pages/                  # Page-specific stylesheets
│       ├── landing.css
│       ├── home.css
│       ├── food-menu.css
│       ├── recipes.css
│       ├── cart.css
│       └── forms.css
│
├── js/                         # Modular client scripts
│   ├── config.js               # Application constants & routes
│   ├── utils.js                # DOM helpers, XSS sanitization, formatters
│   ├── storage.js              # Schema-validated LocalStorage abstraction
│   ├── cart.js                 # Cart state engine & price calculations
│   ├── navigation.js           # Responsive drawer & active link highlighting
│   ├── food-menu.js            # State menu search & filter controller
│   ├── recipes.js              # Recipe card rendering & anchor navigation
│   ├── validation.js           # Accessible form validation engine
│   ├── forms.js                # Form submission controllers
│   └── main.js                 # Application bootstrapper & cart page renderer
│
├── data/                       # Structured culinary datasets
│   ├── states.json             # 28 Indian States & Capitals metadata
│   ├── food-items.json         # Traditional dishes, descriptions, prices
│   └── recipes.json            # Step-by-step recipes & ingredients
│
├── docs/                       # Architectural & operational documentation
│   ├── PROJECT_AUDIT.md        # Initial project audit & bug findings
│   ├── ARCHITECTURE.md         # Architecture specification & design tokens
│   ├── EXISTING_FEATURES.md    # 28-State culinary catalogue
│   ├── FILE_MIGRATION_MAP.md   # Exact migration matrix
│   ├── SECURITY_AUDIT.md       # Frontend security audit & CSP guide
│   ├── DEPLOYMENT_GUIDE.md     # Vercel & GitHub 3-branch workflow
│   ├── TESTING_GUIDE.md        # QA testing strategy & test execution
│   └── legacy/                 # Original project documentation archive
│
├── tests/                      # Automated quality & integrity test suites
│   ├── unit/                   # Logic tests (Cart, Validation, Storage)
│   │   ├── cart.test.js
│   │   ├── validation.test.js
│   │   └── storage.test.js
│   └── integration/            # HTML & link integrity validation
│       └── html-integrity.test.js
│
└── .github/                    # CI/CD & repository automation
    ├── workflows/
    │   ├── quality-checks.yml  # Pull request & push validation
    │   ├── develop-preview.yml # Staging verification
    │   └── production-check.yml# Production release gate
    └── PULL_REQUEST_TEMPLATE.md# Pull request template with checklists
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Structure** | Semantic HTML5, W3C standards, WAI-ARIA accessible landmarks |
| **Styling** | Modular CSS3, CSS Custom Properties (Design Tokens), Flexbox, CSS Grid |
| **Scripting** | Vanilla Modern JavaScript (ES6+), Event-driven state bus |
| **Data Layer** | Structured JSON (`data/states.json`, `data/food-items.json`, `data/recipes.json`) |
| **Typography** | Playfair Display (Serif headings) & Plus Jakarta Sans (Clean body) via Google Fonts |
| **Testing** | Node.js Test Runner (`node:test`, `node:assert`), Custom HTML & Link Integrity Validator |
| **CI/CD** | GitHub Actions (`quality-checks.yml`, `develop-preview.yml`, `production-check.yml`) |
| **Deployment** | Vercel Static Hosting (Edge Network) |

---

## ⚡ Local Setup & Development

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- [Node.js](https://nodejs.org/) v18+ (used for running automated quality tests and local server)

### 1. Clone the Repository
```bash
git clone https://github.com/GreeshmanthSaiY/cibus.git
cd cibus
```

### 2. Switch to Development Branch
```bash
git checkout update
```

### 3. Run Automated Tests
```bash
# Run unit tests
node --test tests/unit/*.test.js

# Run HTML & link integrity validation
node tests/integration/html-integrity.test.js
```

### 4. Start Local Static Server
You can serve the static files with any local server:
```bash
# Using Node npx serve
npx serve -l 3000 .

# Or using Python 3
python -m http.server 3000
```
Open your browser to: **`http://localhost:3000`**

---

## 🌿 Git Branching Model & Release Workflow

CIBUS strictly enforces an enterprise **Three-Branch Architecture**:

```text
  [ update ]  ──(Pull Request)──>  [ develop ]  ──(Owner PR Review)──>  [ main ]
(Development)                     (Staging)                             (Production)
```

1. **`update` Branch:** All feature work, bug fixes, UI enhancements, and refactoring are committed here.
2. **`develop` Branch:** Integration and staging verification. Pushes to `develop` trigger automated CI audits and generate Vercel Preview Deployments.
3. **`main` Branch:** Approved production releases only. Merges into `main` require:
   - A pull request from `develop`.
   - Passing status checks (`quality-checks.yml`).
   - Final review and merge approval by repository owner `@GreeshmanthSaiY`.
   - Never commit or force-push directly to `main`.

---

## 🔒 Security Approach & Hardening

1. **Defensive DOM Sanitization:** Textual data is rendered via `textContent` and `Utils.escapeHtml()` to neutralize Cross-Site Scripting (XSS).
2. **Storage Schema Verification:** Browser `localStorage` is treated as untrusted input. `StorageManager.validateCartSchema()` filters out corrupted, tampered, or out-of-range values.
3. **HTTP Security Headers:** Configured in `vercel.json` and enforced globally:
   - `Content-Security-Policy` (CSP)
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY` (anti-clickjacking)
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
4. **Honest Authentication:** Clear boundary transparency — the application presents user sign-in and registration interfaces for client demonstration without making false claims of encrypted backend password storage.
5. **Secret Hygiene:** No API keys, credentials, or `.env` files are tracked in version control. Full `.gitignore` and secret scanning in CI.

---

## 🚀 Vercel Production Deployment

1. Import the repository `GreeshmanthSaiY/cibus` in your [Vercel Dashboard](https://vercel.com).
2. Set **Framework Preset** to `Other` (Static Website).
3. Set **Root Directory** to `./`.
4. Deploy! Vercel automatically respects `vercel.json` routing, clean URLs, security headers, and static caching.
5. Set `main` as the **Production Branch** and `develop` as the **Preview Branch**.

---

## ⚠️ Known Limitations & Future Roadmap

- **Backend Authentication:** The login and registration interfaces currently operate in Client Demonstration Mode. Future releases can integrate Firebase Authentication, Supabase, or OAuth2.
- **Payment Processing:** Cart checkout currently demonstrates order compilation. Live payment gateway integration (Razorpay / Stripe) is planned for future milestones.
- **Recipe Submission:** Future roadmap includes an interface for community food enthusiasts to submit traditional regional recipes for editorial review.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Handcrafted with passion for Indian culinary heritage by **[Greeshmanth Sai Y](https://github.com/GreeshmanthSaiY)**.
