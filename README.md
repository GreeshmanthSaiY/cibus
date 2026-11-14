<div align="center">

<img src="public/assets/images/cibus-logo.png" alt="CIBUS — The Living Culinary Heritage of 28 Indian States" width="180" style="margin-bottom: 8px;" />

# 🍲 CIBUS
### *The Living Culinary Heritage of 28 Indian States*

<p align="center">
  <b>An authentic, high-speed, culturally grounded web platform celebrating indigenous ingredients, ancestral recipes, and regional gastronomy across the length and breadth of India.</b>
</p>

[![Version](https://img.shields.io/badge/version-2.0.0-E85A19.svg?style=for-the-badge)](https://github.com/GreeshmanthSaiY/cibus)
[![States Represented](https://img.shields.io/badge/States_Celebrated-28_Indian_States-15803D.svg?style=for-the-badge)](https://github.com/GreeshmanthSaiY/cibus)
[![Architecture](https://img.shields.io/badge/Architecture-Zero_Dependency_Static_JAMstack-0284C7.svg?style=for-the-badge)](https://github.com/GreeshmanthSaiY/cibus)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel_Edge_Network-000000.svg?style=for-the-badge)](https://vercel.com)
[![License](https://img.shields.io/badge/License-Personal_Project_All_Rights_Reserved-C74B16.svg?style=for-the-badge)](#-author--copyright-notice)

<br />

<img src="public/assets/gif/food-animation.gif" alt="CIBUS Culinary Experience Animation" width="480" style="border-radius: 16px; box-shadow: 0 16px 36px rgba(40,20,10,0.18);" />

<br /><br />

> *“If I were asked under what sky the human mind has most fully developed some of its choicest gifts, has most deeply pondered on the greatest problems of life, and has found solutions, I should point to India.”*  
> — **Max Müller**, Indologist & Philologist

</div>

---

## 🧭 The Problem Statement

India possesses one of the deepest, most sophisticated, and biodiverse culinary cultures on Earth. Spanning 28 states, hundreds of micro-climates, and millennia of regional agricultural traditions, each territory cultivates distinct wild herbs, ancestral grain varieties, and specialized slow-cooking techniques passed down through generations.

However, modern digital food spaces consistently fail Indian culinary heritage:

1. **Homogenization & Stereotyping:** Mainstream food media flattens Indian food into repetitive clichés—generic gravies, repetitive takeout menus, and commercial restaurant dishes. Essential regional staples—such as Tripura’s bamboo-infused *Chakhwi*, Uttarakhand’s iron-pot *Kafuli*, Himachal’s ceremonial *Dham*, or Chhattisgarh’s steamed *Muthia*—are virtually absent from mainstream culinary platforms.
2. **Inaccurate Visuals & Mismatched Dishes:** Popular cooking websites often display misleading stock photos showing unrelated curries, breads, or fast food for regional heritage dishes, diluting the authentic identity of traditional preparations.
3. **Bloated, Frustrating Interfaces:** Existing recipe websites are burdened by intrusive advertisements, tracking scripts, and multi-megabyte payloads that stutter and blur during mobile scrolling, compromising the cooking experience.
4. **Fragmented Kitchen Workflow:** Home cooks are forced to juggle static text instructions, external calculators, and separate grocery lists with no interactive way to check off ingredients in the kitchen or adjust dish portions in real time.

---

## 🌿 The Solution: CIBUS

**CIBUS** (*Latin for "Nourishment & Food"*) is an authentic, production-grade, culturally respectful digital culinary platform engineered to document, celebrate, and preserve authentic culinary traditions from all **28 States of India**.

Designed from first principles with zero external framework dependencies, CIBUS delivers a responsive 60fps experience that combines cultural storytelling, step-by-step kitchen guides, portion planning, and living spice botanical histories.

```
       🇮🇳 28 INDIAN STATES · COMPREHENSIVE REGIONAL DIVERSITY
   ┌─────────────────────────────────────────────────────────────┐
   │  🌴 SOUTH      │ Andhra · Karnataka · Kerala · Tamil · Tel  │
   │  🏔️ NORTH      │ Haryana · HP · Punjab · Rajasthan · UP · UK │
   │  🌊 WEST       │ Goa · Gujarat · Maharashtra                │
   │  🌾 EAST       │ Bihar · Jharkhand · Odisha · West Bengal   │
   │  🎋 NORTHEAST  │ Arunachal · Assam · Manipur · Meghalaya ·  │
   │                │ Mizoram · Nagaland · Sikkim · Tripura      │
   │  🌿 CENTRAL    │ Chhattisgarh · Madhya Pradesh              │
   └─────────────────────────────────────────────────────────────┘
```

---

## 🏛️ System & Engineering Architecture

CIBUS is engineered around a zero-dependency static JAMstack architecture, eliminating compilation overhead, runtime vulnerabilities, and hydration mismatches:

```mermaid
flowchart TD
    subgraph CDN[Vercel Global Edge Network]
        EdgeCache[Edge Routing & Immutable Cache]
        SecurityHeaders[Security Headers & CSP]
        WebAnalytics[Web Analytics & Speed Insights]
    end

    subgraph ClientBrowser[Browser Client Runtime]
        DOM[Semantic HTML5 & Design Tokens]
        Router[Clean URL History Routing]
        
        subgraph StateManagement[Reactive State Modules]
            CartEngine[Cart State & GST Calculations]
            AuthManager[Session Auth & Profile State]
            NotifCenter[Notification Center & Toasts]
            StorageGuard[Storage Schema Validation]
        end
        
        subgraph Datasets[Normalized JSON Data]
            StatesData[(states.json)]
            FoodData[(food-items.json)]
            RecipesData[(recipes.json)]
        end
    end

    EdgeCache --> DOM
    DOM --> Router
    Router --> StateManagement
    StateManagement <--> StorageGuard
    StorageGuard <--> LocalStorage[(Browser LocalStorage)]
    StateManagement <--> Datasets
```

### Key Architectural Pillars
- **Zero Framework Bloat:** Implemented strictly with standard HTML5, CSS3 Custom Properties, and modern ECMAScript (ES6+), resulting in instantaneous first paint and zero runtime compilation overhead.
- **Normalized Data Architecture:** 28 states, dishes, and recipes are stored in three relational JSON datasets with automated schema and cross-referencing validation.
- **Fail-Safe Edge Caching:** Static assets are served with immutable 1-year cache headers (`max-age=31536000, immutable`), while structured data benefits from stale-while-revalidate caching.
- **Defensive Client Storage:** Browser storage writes and reads are passed through strict schema-enforcing type guards to eliminate data poisoning and state corruption.

---

## 📸 Product Visual Showcase

<div align="center">

### 🖥️ Desktop Experience Across Key Product Views (1440 × 900)

| 1. Heritage Welcome & Gateway | 2. Regional Heritage Explorer |
| :---: | :---: |
| <img src="docs/screenshots/desktop/welcome.png" alt="CIBUS Welcome Gateway" width="440"/> | <img src="docs/screenshots/desktop/homepage.png" alt="CIBUS Regional Explorer" width="440"/> |
| *Tricolor Gateway with Ashoka Chakra* | *Interactive 28-State Cultural Explorer* |

<br/>

| 3. 28-State Food Directory | 4. Cascading Recipe Cards Gallery |
| :---: | :---: |
| <img src="docs/screenshots/desktop/food-menu.png" alt="28 State Food Directory" width="440"/> | <img src="docs/screenshots/desktop/recipe-cards.png" alt="Visual Recipe Cards Gallery" width="440"/> |
| *Real-Time Dietary Filters & Search* | *Interactive 3D Cascading Recipe Cards* |

<br/>

| 5. Step-by-Step Cooking Guide | 6. Luxury Shopping Cart & Stepper |
| :---: | :---: |
| <img src="docs/screenshots/desktop/recipe-detail.png" alt="Step-by-Step Cooking Checklist" width="440"/> | <img src="docs/screenshots/desktop/shopping-cart.png" alt="Dynamic Cart Engine" width="440"/> |
| *Interactive Ingredient Checklists & Progress Bar* | *Session-Guarded Cart & Regional Recommendations* |

<br/>

| 7. Real-Time Notification Center | 8. Authentic Community & Contact Hub |
| :---: | :---: |
| <img src="docs/screenshots/desktop/notifications.png" alt="Notification Drawer" width="440"/> | <img src="docs/screenshots/desktop/contact.png" alt="Community & Contact Hub" width="440"/> |
| *Filtered Notifications Drawer with Badging* | *Verified Maintainer Channels & State Inquiries* |

<br/>

| 9. Session Access & Authentication | 10. Member Registration Portal |
| :---: | :---: |
| <img src="docs/screenshots/desktop/login.png" alt="Session Login" width="440"/> | <img src="docs/screenshots/desktop/register.png" alt="Account Registration" width="440"/> |
| *Browser-Scoped Session Access* | *Client-Side Account Creation* |

<br/>

### 📱 Tablet Adaptive Experience (768 × 1024)

| Tablet Regional Explorer | Tablet Food Directory | Tablet Recipe Cards | Tablet Cooking Guide |
| :---: | :---: | :---: | :---: |
| <img src="docs/screenshots/tablet/homepage-tablet.png" alt="Tablet Explorer" width="220"/> | <img src="docs/screenshots/tablet/food-menu-tablet.png" alt="Tablet Food Menu" width="220"/> | <img src="docs/screenshots/tablet/recipe-cards-tablet.png" alt="Tablet Recipes" width="220"/> | <img src="docs/screenshots/tablet/recipe-detail-tablet.png" alt="Tablet Cooking Guide" width="220"/> |
| *Fluid 2-Column Hero & State Grid* | *Touch Toolbar & Adaptive Food Cards* | *Responsive 2-Card Stack Layout* | *Compact Kitchen Cooking Checklist* |

<br/>

| Tablet Welcome Gateway | Tablet Shopping Cart | Tablet Notification Center | Tablet Member Login |
| :---: | :---: | :---: | :---: |
| <img src="docs/screenshots/tablet/welcome-tablet.png" alt="Tablet Welcome" width="220"/> | <img src="docs/screenshots/tablet/cart-tablet.png" alt="Tablet Cart" width="220"/> | <img src="docs/screenshots/tablet/notifications-tablet.png" alt="Tablet Notifications" width="220"/> | <img src="docs/screenshots/tablet/login-tablet.png" alt="Tablet Login" width="220"/> |
| *Balanced Emblem Composition* | *Touch Cart Steppers & Tax Math* | *Centered Notification Glass Drawer* | *Single-Column Form Card* |

<br/>

### 📲 Mobile Adaptive Experience (390 × 844)

| Mobile Explorer | Mobile Food Menu | Mobile Recipe Cards | Mobile Cooking Guide |
| :---: | :---: | :---: | :---: |
| <img src="docs/screenshots/mobile/homepage-mobile.png" alt="Mobile Explorer" width="210"/> | <img src="docs/screenshots/mobile/food-menu-mobile.png" alt="Mobile Food Menu" width="210"/> | <img src="docs/screenshots/mobile/recipe-cards-mobile.png" alt="Mobile Recipe Cards" width="210"/> | <img src="docs/screenshots/mobile/recipe-detail-mobile.png" alt="Mobile Recipe Detail" width="210"/> |
| *Fluid Hero Typography & Compact Logo* | *Horizontal Scrolling Pills & Single Column* | *Deck Card Stacking & Touch Target* | *In-Kitchen Step Checklists* |

<br/>

| Mobile Welcome Gateway | Mobile Shopping Cart | Mobile Notifications | Mobile Member Login |
| :---: | :---: | :---: | :---: |
| <img src="docs/screenshots/mobile/welcome-mobile.png" alt="Mobile Welcome" width="210"/> | <img src="docs/screenshots/mobile/cart-mobile.png" alt="Mobile Cart" width="210"/> | <img src="docs/screenshots/mobile/notifications-mobile.png" alt="Mobile Notifications" width="210"/> | <img src="docs/screenshots/mobile/login-mobile.png" alt="Mobile Login" width="210"/> |
| *Seamless Indian Flag Gradient* | *Stacked Mobile Order Summary* | *Full-Width Glass Overlay Drawer* | *16px Inputs (No Safari Auto-Zoom)* |

<br/>

| Mobile Navigation Drawer | Mobile Recipe Collection | Mobile Member Registration | Mobile Contact Hub |
| :---: | :---: | :---: | :---: |
| <img src="docs/screenshots/mobile/navigation-mobile.png" alt="Mobile Navigation Drawer" width="210"/> | <img src="docs/screenshots/mobile/recipe-collection-mobile.png" alt="Mobile Recipe Collection" width="210"/> | <img src="docs/screenshots/mobile/registration-mobile.png" alt="Mobile Registration" width="210"/> | <img src="docs/screenshots/mobile/contact-mobile.png" alt="Mobile Contact" width="210"/> |
| *Smooth Slide-in Mobile Drawer* | *Adaptive Dual-View Recipe Cards* | *Client-Side Account Creation* | *Community & Maintainer Inquiries* |

</div>

<br/>

> [!TIP]
> **Cross-Device Precision Engineering:** All 30 screenshots above are genuinely captured in headless Chrome DevTools Protocol across actual device viewports. Every layout passed our automated 50-point responsive audit with **zero horizontal overflow** (`document.documentElement.scrollWidth === window.innerWidth`) from 320px ultra-compact phones to 1920px desktop displays.

---

## ✨ Core Product Features & Capabilities

### 1. 🍛 28-State Heritage Food Directory
* **Comprehensive Cultural Coverage:** Discover signature traditional dishes representing every Indian state, with authentic local names, historical contexts, and regional classifications.
* **Instant Multi-Filter Engine:** Filter instantaneously by region (*South, North, West, East, Central, Northeast*) and dietary preference (*Vegetarian, Vegan, Non-Vegetarian*).
* **Instant Typeahead Search:** Find dishes immediately by dish name, state, key spices, or culinary category.

### 2. 🎴 Dual-View Recipe Exploration Deck
* **3D Cascading Gallery:** Explore recipes in an interactive stacked deck format with depth shadows, regional accents, and dish metadata.
* **Responsive Grid Mode:** Toggle between an expansive visual grid and focused fanned cards with one click.
* **Clean Dish Identity:** Uncluttered presentation showcasing authentic culinary names with preparation timelines and portion indicators.

### 3. 📜 Living Kitchen Guide & Cooking Checklists
* **Interactive Ingredient Checklists:** Home cooks can tap and check off ingredients as they prepare, keeping active count of remaining items directly in the kitchen.
* **Step-by-Step Numbered Guidance:** Ancestral preparation methods, slow-simmering *dum* timings, stone-ground paste techniques, and tempering secrets organized sequentially.
* **Sticky Navigation Sidebar:** Jump instantly between states and recipes without losing your active step in the kitchen.

### 4. 🛒 Dynamic Cart & Portion Engine with Celebration FX
* **Adaptive Card Steppers:** Added items dynamically transform from "Add to Cart" into an active quantity stepper:
  $$\mathbf{[\,−\,]}\;\;✓\text{ In Cart (qty)}\;\;\mathbf{[\,+\,]}$$
* **Celebration Micro-Animations:** Radial bursts of saffron and gold culinary particles and a flying dish indicator each time a recipe is added to your order.
* **Real-Time Tax & Portion Mathematics:** Transparent price calculations, complimentary heritage packaging, and automated 5% GST tabulation.
* **Automatic Sign-Out Safeguard:** Signing out immediately purges the active cart and resets counter badges, ensuring privacy and data security.

### 5. 🔔 Real-Time Culinary Notification Center
* **Interactive Bell Dropdown:** Access real-time alerts, seasonal recipe recommendations, and order status updates from a glassmorphic notification drawer in the navigation bar.
* **Universal 10-Second Countdown:** Action toasts display an animated 10-second countdown bar that automatically pauses on hover.
* **Clean State Transitions:** Notifications and badge counts automatically clear upon sign-out, maintaining a quiet, distraction-free environment for guests.

### 6. 🌶️ Sacred Botanicals of Indian Heritage
Explore deep-dive agricultural and Ayurvedic profiles of India's 6 protected heritage botanicals:
* **Kashmiri Mongra Saffron** *(Pampore, Kashmir)* — Prized for intense crimson stigma and royal aroma.
* **Tellicherry Black Pepper** *(Malabar Coast, Kerala)* — Sun-ripened berries offering citrus undertones and robust warmth.
* **Guntur Sannam Chilli** *(Guntur, Andhra Pradesh)* — Celebrated for its fiery capsaicin punch and deep ruby infusion.
* **Lakadong Golden Turmeric** *(Jaintia Hills, Meghalaya)* — World-renowned for the highest natural curcumin concentration (7–9%).
* **Coorg Green Cardamom** *(Western Ghats, Karnataka)* — Fragrant sweet eucalyptus notes cultivated in misty rainforest shade.
* **Naga King Chilli (Bhut Jolokia)** *(Nagaland & Assam)* — Smoked over tribal wood fires for intense mountainous heat.

### 7. ⚡ Ultra-Fast 60fps Visual Engine
* **High-Efficiency Imagery:** All dish photographs and visuals are optimized for fast transmission and rapid browser decoding.
* **Zero Layout Shift (CLS):** Explicit aspect-ratio containers and image dimensions prevent layout jumps during loading.
* **Hardware-Accelerated Rendering:** CSS transforms and asynchronous image decoding ensure smooth scrolling across mobile and desktop devices.

### 8. 🎭 Centralized Cinematic Motion System & Micro-Interactions
* **Centralized Architecture:** Fully structured motion tokens (`motion-tokens.css`), global primitives (`motion-global.css`), bespoke section treatments (`motion-sections.css`), and touch-optimized responsive rules (`motion-responsive.css`).
* **Handcrafted Section Identities:** Every major section boasts a distinct animation personality:
  - *Homepage Hero:* Ambient dawn radiance, golden logo entrance, and sequenced title unveil.
  - *Story & Philosophy:* Editorial clip reveals and horizontally expanding golden motif dividers.
  - *Food Directory & Menu:* Staggered dish card waves, spring-popping region pills, and smooth category crossfades.
  - *Recipe Deck Gallery:* 3D cascading fan-deck opening physics and view-toggle perspective flips.
  - *In-Kitchen Recipe Guide:* Interactive checkbox celebrations, strikethrough glides, and live cooking progress bar updates.
  - *Shopping Cart:* Tactile micro-stepper physics, price pulse highlights, and smooth row collapse on item removal.
* **Native Page Transitions:** Fluid 160ms exit glide and entry fade with full `pageshow` (bfcache) support for instantaneous browser back/forward navigation.
* **Full Reduced-Motion Accessibility:** Automatic detection of `prefers-reduced-motion: reduce`, instantaneously revealing all content with zero-duration transitions. Progressive enhancement ensures 100% content visibility even if JavaScript is unavailable.

---

## 🍽️ The 28-State Culinary Mosaic

| Region | State | Signature Dish | Category | Estimated Time | Price (INR) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **South** | Andhra Pradesh | **Pulihora** | Vegetarian | 35 mins | ₹160 |
| **Northeast** | Arunachal Pradesh | **Bamboo Shoot Stir Fry** | Vegan | 30 mins | ₹190 |
| **Northeast** | Assam | **Duck Meat Curry** | Non-Vegetarian | 60 mins | ₹380 |
| **East** | Bihar | **Litti Chokha** | Vegetarian | 50 mins | ₹180 |
| **Central** | Chhattisgarh | **Muthia** | Vegetarian | 30 mins | ₹150 |
| **West** | Goa | **Goan Fish Curry** | Non-Vegetarian | 40 mins | ₹360 |
| **West** | Gujarat | **Khaman Dhokla** | Vegetarian | 25 mins | ₹140 |
| **North** | Haryana | **Bajra Khichdi** | Vegetarian | 45 mins | ₹170 |
| **North** | Himachal Pradesh | **Dham (Madra)** | Vegetarian | 55 mins | ₹220 |
| **East** | Jharkhand | **Dhooska** | Vegetarian | 35 mins | ₹140 |
| **South** | Karnataka | **Bisi Bele Bath** | Vegetarian | 45 mins | ₹180 |
| **South** | Kerala | **Appam with Stew** | Vegetarian | 40 mins | ₹200 |
| **Central** | Madhya Pradesh | **Bhutte Ka Kees** | Vegetarian | 30 mins | ₹160 |
| **West** | Maharashtra | **Misal Pav** | Vegetarian | 35 mins | ₹150 |
| **Northeast** | Manipur | **Kangshoi** | Vegetarian | 30 mins | ₹170 |
| **Northeast** | Meghalaya | **Jadoh** | Non-Vegetarian | 50 mins | ₹280 |
| **Northeast** | Mizoram | **Misa Mach Poora** | Non-Vegetarian | 40 mins | ₹340 |
| **Northeast** | Nagaland | **Smoked Pork with Bamboo** | Non-Vegetarian | 60 mins | ₹390 |
| **East** | Odisha | **Chhena Poda** | Vegetarian | 50 mins | ₹190 |
| **North** | Punjab | **Makki di Roti & Sarson Saag**| Vegetarian | 55 mins | ₹240 |
| **North** | Rajasthan | **Dal Baati Churma** | Vegetarian | 65 mins | ₹260 |
| **Northeast** | Sikkim | **Steamed Momos** | Vegetarian | 35 mins | ₹180 |
| **South** | Tamil Nadu | **Masala Dosa** | Vegetarian | 30 mins | ₹150 |
| **South** | Telangana | **Hyderabadi Dum Biryani** | Non-Vegetarian | 70 mins | ₹320 |
| **Northeast** | Tripura | **Chakhwi** | Vegetarian | 35 mins | ₹160 |
| **North** | Uttar Pradesh | **Galouti Kebab** | Non-Vegetarian | 45 mins | ₹310 |
| **North** | Uttarakhand | **Kafuli** | Vegetarian | 35 mins | ₹170 |
| **East** | West Bengal | **Macher Jhol** | Non-Vegetarian | 40 mins | ₹290 |

---

## 🛡️ Application Security & Defensive Engineering

Security is built into CIBUS as an architectural foundation:

1. **Content Security Policy (CSP):** Rigorous, verified CSP declared in `vercel.json` and mirrored in the local development server:
   ```text
   default-src 'self'; script-src 'self' 'unsafe-inline' https://kit.fontawesome.com https://ka-f.fontawesome.com https://va.vercel-scripts.com https://speed-insights.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://use.fontawesome.com; font-src 'self' https://fonts.gstatic.com https://ka-f.fontawesome.com data:; img-src 'self' data: https:; connect-src 'self' https://ka-f.fontawesome.com https://vitals.vercel-insights.com https://va.vercel-scripts.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self';
   ```
2. **Untrusted DOM Sanitization:** Textual data is rendered via `textContent` or filtered through `Utils.escapeHtml()` to eliminate Cross-Site Scripting (XSS).
3. **Storage Defensive Validation:** LocalStorage entries are validated against strict JSON schemas before parsing, protecting against client-side state manipulation.
4. **Honest Authentication Boundaries:** Demonstrates client authentication state without false claims of cryptographic backend security.

---

## 📂 Repository & Directory Structure

```text
cibus/
├── index.html                  # Welcome landing gateway with tricolor hero & parallax waves
├── pages/                      # Product page views
│   ├── home.html               # 28-State interactive cultural explorer
│   ├── food-menu.html          # State food directory with dietary & regional filters
│   ├── recipe-cards.html       # Cascading 3D & grid recipe card gallery
│   ├── recipe-detail.html      # In-kitchen step-by-step cooking checklists
│   ├── cart.html               # Session cart with GST calculation & checkout
│   ├── contact.html            # Community contact and culinary inquiries
│   ├── login.html              # Member session login portal
│   └── register.html           # New member registration portal
├── css/                        # Design system & modular stylesheets
│   ├── components.css          # Navigation, back-to-top, buttons, cards, toasts
│   ├── layout.css              # Header, footer, grid layouts, mobile drawer
│   ├── responsive.css          # Viewport media queries (320px - 1920px)
│   ├── pages/                  # Page-specific styling (landing, recipes, cart, etc.)
│   └── motion/                 # Centralized 60fps cinematic motion system
├── js/                         # Vanilla ECMAScript modules
│   ├── main.js                 # Application initializer & state showcase
│   ├── navigation.js           # Header, active routes, drawer & back-to-top observer
│   ├── food-menu.js            # Food filtering, query params & search logic
│   ├── recipes.js              # Recipe decks, filtering & detail checklists
│   ├── cart.js                 # Reactive shopping cart & order calculations
│   ├── auth.js                 # Client authentication & session management
│   ├── notifications.js        # Notification drawer & auto-dismissing toasts
│   ├── storage.js              # Schema-validated LocalStorage guard
│   └── motion/motion-engine.js # Cinematic motion triggers & scroll transitions
├── data/                       # Normalized JSON relational datasets
│   ├── states.json             # 28 Indian States metadata, geography & culture
│   ├── food-items.json         # Traditional dishes, ingredients & dietary tags
│   └── recipes.json            # Step-by-step cooking methods & timelines
├── docs/                       # Comprehensive technical documentation & screenshots
│   ├── architecture/           # System & data architecture specifications
│   ├── deployment/             # Vercel deployment & release engineering guides
│   ├── development/            # Setup, testing & QA manuals
│   ├── project/                # Features catalog, changelog & migration records
│   ├── security/               # Security audits & frontend hardening standards
│   └── screenshots/            # Genuine multi-device captures (desktop, tablet, mobile)
├── tests/                      # Automated test suite
│   ├── unit/                   # 22 Node.js unit tests (auth, cart, datasets, storage)
│   └── integration/            # HTML integrity, route probe & link validator
├── scripts/                    # Build, verification & screenshot capture utilities
│   ├── verify-build.js         # Production pre-flight verification gate
│   └── capture-screenshots.js  # Chrome headless genuine multi-device screenshot capture
├── server.js                   # Minimalist local development HTTP server
└── vercel.json                 # Vercel Edge routing, clean URLs & security headers
```

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js v20.x LTS or higher (aligned with `.nvmrc`)
- Modern web browser

```bash
# 1. Clone repository
git clone https://github.com/GreeshmanthSaiY/cibus.git
cd cibus

# 2. Verify and launch development server with live reload
npm start
# Server listens on http://localhost:3000
```

### Quality Assurance & Validation Commands

```bash
# Run unit tests (22 tests across auth, cart, datasets, storage, validation)
npm test

# Run HTML integrity and broken link validation (all 11 HTML pages)
npm run validate:html

# Run server route probe (39 HTTP endpoints including Vercel Analytics & Speed Insights mocks)
npm run test:probe

# Run production build verification gate
npm run build
```

---

## ☁️ Production Deployment (Vercel)

CIBUS is engineered for zero-compilation deployment on the **Vercel Global Edge Network**:

1. **Edge Configuration:** `vercel.json` provides route rewrites, clean `.html` extension stripping, immutable asset caching, and enterprise Content Security Policy (CSP).
2. **Pre-Flight Verification:** Always run `npm run build` locally before pushing to verify dataset integrity, required assets, and route definitions.
3. **Deploying via Vercel CLI:**
   ```bash
   # Preview Deployment
   vercel

   # Production Deployment
   vercel --prod
   ```
4. **Git-Integrated Continuous Deployment:** Pushes to `main` trigger automated production deployments; pull requests generate isolated preview URLs for review.

---

## ⚠️ Known Limitations

1. **Client-Side Session State:** As a zero-dependency static JAMstack platform, user sessions, favorites, and cart contents are persisted in browser `localStorage` protected by schema guards. There is no remote backend database.
2. **Simulated Commerce Checkout:** The shopping cart and order confirmation demonstrate real-time GST calculations, portion changes, and celebration micro-interactions without processing real financial transactions.
3. **Offline Network Availability:** Full offline caching relies on standard browser caching headers; progressive Service Worker installation (PWA) is designated for a future version.

---

## 🔮 Future Improvements

1. **Progressive Web App (PWA):** Service worker offline caching and Web App Manifest for seamless in-kitchen reference during connectivity dropouts.
2. **Regional Vernacular Localization:** Multi-language support across major Indian regional languages (Hindi, Tamil, Telugu, Bengali, Kannada, Marathi, Gujarati, etc.).
3. **Indigenous Audio Pronunciation:** Authentic audio clips for regional dish names, local cooking implements, and indigenous spice terms.
4. **Seasonal Harvest Calendar:** Dynamic seasonal recommendations highlighting regional ingredients at their agricultural peak across Indian climatic zones.

---

## 📬 Contact & Responsible Disclosure

- **Maintainer:** Greeshmanth Sai Y
- **GitHub Profile:** [@GreeshmanthSaiY](https://github.com/GreeshmanthSaiY)
- **Repository:** [https://github.com/GreeshmanthSaiY/cibus](https://github.com/GreeshmanthSaiY/cibus)
- **Issue Tracker:** [GitHub Issues](https://github.com/GreeshmanthSaiY/cibus/issues)
- **Security Inquiries:** Please use [GitHub Private Vulnerability Reporting](https://github.com/GreeshmanthSaiY/cibus/security) or contact the maintainer directly via GitHub.

---

## 📚 Technical Documentation Library

Deep dive into the architectural and engineering documentation available in the `docs/` directory:

- 🏛️ **[System Architecture Specification](docs/architecture/ARCHITECTURE.md)**
- 📊 **[Data Architecture & Schemas](docs/architecture/DATA_ARCHITECTURE.md)**
- 🚀 **[Vercel Production Deployment Manual](docs/deployment/VERCEL_DEPLOYMENT.md)**
- 🚢 **[Release Engineering & Branch Protection](docs/deployment/DEPLOYMENT_GUIDE.md)**
- 🛡️ **[Application Security Audit](docs/security/SECURITY_AUDIT.md)**
- 🔒 **[Frontend Security Guidelines](docs/security/SECURITY_GUIDELINES.md)**
- 🛠️ **[Local Developer Setup Guide](docs/development/SETUP_GUIDE.md)**
- 🧪 **[Automated Testing & QA Guide](docs/development/TESTING_GUIDE.md)**
- 📋 **[Existing Features Inventory](docs/project/EXISTING_FEATURES.md)**
- 📝 **[Project Changelog](docs/project/CHANGELOG.md)**

---

## 📜 Cultural Heritage Statement

> *CIBUS is created with profound gratitude to the generations of home cooks, grandmothers, regional farmers, and indigenous communities across India who have nurtured and preserved these culinary masterpieces for thousands of years. We honor the diversity, technique, and seasonal balance that make Indian food a living world heritage.*

---

## 📄 Author & Copyright Notice

- **Project Type:** Personal Project
- **Copyright:** &copy; 2026 [Greeshmanth Sai Y](https://github.com/GreeshmanthSaiY). All Rights Reserved.
- **Notice:** This repository and its source code, design assets, and documentation are the personal work of **Greeshmanth Sai Y**. Unauthorized copying, distribution, modification, or commercial use is strictly prohibited without explicit written permission.
- **Platform:** [CIBUS on GitHub](https://github.com/GreeshmanthSaiY/cibus)

---

<div align="center">
  <sub>Handcrafted with devotion to the culinary heritage of Bharat 🇮🇳</sub>
</div>
