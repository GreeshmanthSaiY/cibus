# CIBUS — Production Deployment, Architecture & Vercel Integration Guide

This document is the definitive production deployment manual for the **CIBUS** culinary heritage platform. It covers repository architecture, deployment configuration, routing, official branding, performance instrumentation (Web Analytics & Speed Insights), security headers, observability on Vercel Hobby, and step-by-step dashboard instructions.

---

## 1. Architecture & Technology Stack Overview

- **Architecture:** Pure High-Performance Static Web Application (JAMstack static tier).
- **Core Technologies:** HTML5, Modern CSS3, Vanilla ECMAScript 2022+ (ES6 Modules/Vanilla JS), JSON datasets.
- **Hosting Platform:** Vercel Global Edge Network.
- **Framework Preset:** `Other` (Static HTML / No Bundler Required).
- **Output Directory:** `.` (Repository root containing `index.html`, `pages/`, `css/`, `js/`, `data/`, and `public/`).
- **Build Step:** Native verification gate (`node scripts/verify-build.js`) executing zero-compilation validation with strict exit codes.

---

## 2. Root Cause Analysis: The Vercel 404 NOT_FOUND Issue

### Why the Initial Deployment Failed
1. **Implicit Output Directory Assumption:**
   When a project contains a `package.json` with a `"build"` script and a directory named `public/`, Vercel's zero-config engine for the `Other` framework preset defaults to publishing **only** the `public/` folder unless explicitly overridden.
2. **Missing Root Index in Output:**
   Because `index.html`, `pages/`, `css/`, and `js/` lived at the root level, only `public/` (containing favicons and robots.txt) was published. Navigating to `/` resulted in Vercel looking for an `index.html` inside `public/` that did not exist.
3. **Legacy `routes` Conflict:**
   `vercel.json` previously utilized the legacy v2 `"routes"` array alongside `"cleanUrls": true`. In Vercel's routing specification, mixing `"routes"` with clean URLs disables the modern routing engine and filesystem fallback, causing requests to fall through to the catch-all rule.
4. **Missing Root 404 Page:**
   `404.html` was located solely inside `pages/404.html`. Vercel looks for `404.html` at the static root; lacking one, Vercel rendered its generic platform error page.

### The Engineering Remedy
1. **Explicit Output Directory:** Configured `"outputDirectory": "."` in `vercel.json` and documented dashboard settings.
2. **Modern Rewrites Pipeline:** Replaced legacy `"routes"` with modern `"rewrites"`, preserving clean URLs (`/home`, `/food-menu`, `/recipe-cards`, `/recipe-detail`, `/cart`, etc.) and filesystem asset resolution.
3. **Dual 404 Resolution:** Added root `404.html` mirroring `pages/404.html` to guarantee authentic HTTP 404 status codes and consistent user experience.
4. **Authentic Verification Script:** Replaced fake `console.log` build script with `node scripts/verify-build.js`, validating all 11 HTML files, 3 JSON datasets, 14 branding assets, and configuration before allowing builds to pass.

---

## 3. Exact Vercel Dashboard Settings

When configuring or reviewing the project in the [Vercel Dashboard](https://vercel.com):

| Setting | Recommended Value | Notes |
| :--- | :--- | :--- |
| **Framework Preset** | `Other` | Pure static site with zero compilation overhead. |
| **Root Directory** | `./` (Leave default blank) | Project root. |
| **Build Command** | `npm run build` | Runs `node scripts/verify-build.js`. |
| **Output Directory** | `.` (or leave empty if configured via `vercel.json`) | Configured explicitly as `.` in `vercel.json`. |
| **Install Command** | `npm install` (or leave default) | Fast install with zero runtime dependencies. |
| **Node.js Version** | `20.x` or `22.x` | Fully compatible across all LTS releases. |

> [!NOTE]
> **Regarding npm `cache-dir` warning during build:**
> If you observe `npm WARN config "cache-dir" ...` in Vercel build logs, this is an internal Vercel runner warning where Vercel's container sets the legacy environment variable `npm_config_cache_dir` for npm v10/v11+. It does not affect build output or website execution.

---

## 4. Git Branching & Preview Deployment Workflow

The project follows a standard production-grade release pipeline:

```
[Local Feature Branch]  ──(PR)──>  [develop]  ──(PR)──>  [main]
   (Preview URL)                    (Staging Preview)      (Production Domain)
```

1. **Feature Branches (`feature/*`):**
   - Opening a Pull Request on GitHub triggers a **Vercel Preview Deployment**.
   - Preview URLs are isolated (e.g., `cibus-git-feature-xxx-yourusername.vercel.app`).
   - Previews never overwrite or reassign the production domain.
2. **Develop Branch (`develop`):**
   - Serves as the integration and staging branch.
   - Triggers preview deployments for holistic team review.
3. **Main Branch (`main`):**
   - Exclusively mapped to the **Production Deployment** (`cibus-silk.vercel.app` or custom domain).
   - Only code reviewed and merged into `main` goes live to public traffic.

---

## 5. Official Branding & Favicon System

The website integrates the official master CIBUS artwork faithfully without distortion, redrawing, or background artifacts:

### Asset Manifest
- **Master Artwork:** `public/assets/images/cibus-logo.png` (1024×682 transparent RGBA PNG).
- **Header Asset:** `public/assets/images/cibus-logo-header.png` (tight bounding-box crop optimized for high-DPI displays).
- **Multi-size Favicon:** `public/favicon.ico` and root `favicon.ico` (16×16, 32×32, 48×48).
- **PNG Favicons:** `public/assets/images/favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`.
- **Apple Touch Icon:** `public/assets/images/apple-touch-icon.png` (180×180).
- **Android / PWA Icons:** `public/assets/images/android-chrome-192x192.png`, `android-chrome-512x512.png`.
- **Web App Manifest:** `public/site.webmanifest` and root `site.webmanifest`.
- **SVG Wrapper:** `public/favicon.svg` and root `favicon.svg`.

### HTML Integration
All 11 HTML pages feature standardized icon metadata:
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/public/assets/images/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/public/assets/images/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/public/assets/images/apple-touch-icon.png">
<link rel="manifest" href="/public/site.webmanifest">
```

---

## 6. Vercel Web Analytics Integration

### Implementation
Integrated via standard static script tag placed before `</body>` across all HTML pages:
```html
<script defer src="/_vercel/insights/script.js"></script>
```

### Key Technical Properties
- **Zero Dependencies:** Pure static endpoint served automatically by Vercel Edge.
- **Local Development Failsafe:** `server.js` contains an internal stub route (`/_vercel/*`) returning an empty script so local development incurs 0 errors and 0 console warnings.
- **Privacy First:** Privacy-friendly tracking with no third-party cookies or personally identifiable information (PII).

### Dashboard Activation (One-time manual action)
1. Go to the **Analytics** tab in your Vercel Project.
2. Click **Enable Web Analytics**.
3. Select your project and confirm.
4. Once traffic arrives on the production deployment, real-time page views and visitor metrics will appear.

---

## 7. Vercel Speed Insights Integration & Performance Optimization

### Implementation
Integrated via standard static script tag placed before `</body>` across all HTML pages:
```html
<script defer src="/_vercel/speed-insights/script.js"></script>
```

### Concrete Performance Engineering Delivered
1. **LCP Optimization:**
   - The primary hero dish image (`pages/home.html`) is configured with `loading="eager"` and `decoding="async"`.
   - The landing page master logo is equipped with explicit `width`, `height`, and `fetchpriority="high"`.
2. **CLS Elimination:**
   - All brand logo images, headers, and navigation bars have fixed aspect-ratio / dimensions declared in CSS to prevent layout shifting.
3. **FCP & Render-Blocking Mitigation:**
   - Preconnect links for Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`).
   - Below-the-fold dish cards utilize native `loading="lazy"` and `decoding="async"`.
4. **Edge Cache Headers:**
   - Static assets (`/public/*`, `/css/*`, `/js/*`) configured with `public, max-age=31536000, immutable`.
   - Datasets (`/data/*`) configured with `public, max-age=86400, stale-while-revalidate=604800`.

### Dashboard Activation (One-time manual action)
1. Go to the **Speed Insights** tab in your Vercel Project.
2. Click **Enable Speed Insights**.
3. Real-world Core Web Vitals (LCP, FID/INP, CLS) will populate automatically.

---

## 8. Observability & Monitoring on Vercel Hobby Plan

| Feature | Plan Availability | Code Preparation | Dashboard Action | Verification Method |
| :--- | :--- | :--- | :--- | :--- |
| **Deployment & Build Logs** | Free (Hobby) | Included (`scripts/verify-build.js`) | Automatic | View Deployments > Select Build > Inspect terminal log |
| **CDN Request Logs** | Free (Hobby - 6h summary) | Included | Automatic | Overview > "Observability 6h" widget |
| **Realtime Log Drains** | Pro plan only | N/A | Upgrade required | N/A for static sites |
| **Serverless Function Logs** | Free (Hobby) | N/A (Static site has 0 functions) | None | N/A |
| **Web Analytics** | Free (1 project on Hobby) | Script tag in all HTML files | Toggle "Enable Web Analytics" | Analytics tab |
| **Speed Insights** | Free (Hobby) | Script tag in all HTML files | Toggle "Enable Speed Insights" | Speed Insights tab |

---

## 9. Security Headers Configuration

All security headers are declared in `vercel.json` and apply globally to all routes:

- **Content-Security-Policy (CSP):**
  `default-src 'self'; script-src 'self' 'unsafe-inline' https://kit.fontawesome.com https://ka-f.fontawesome.com https://va.vercel-scripts.com https://speed-insights.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://use.fontawesome.com; font-src 'self' https://fonts.gstatic.com https://ka-f.fontawesome.com data:; img-src 'self' data: https:; connect-src 'self' https://ka-f.fontawesome.com https://vitals.vercel-insights.com https://va.vercel-scripts.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self';`
- **X-Content-Type-Options:** `nosniff` (Prevents MIME sniffing).
- **X-Frame-Options:** `SAMEORIGIN` (Clickjacking mitigation).
- **Referrer-Policy:** `strict-origin-when-cross-origin`.
- **Permissions-Policy:** `camera=(), microphone=(), geolocation=(), payment=()`.
- **Strict-Transport-Security:** `max-age=63072000; includeSubDomains; preload` (HSTS).

---

## 10. Local Testing & Verification Workflow

```bash
# 1. Run full unit test suite (22 unit tests)
npm test

# 2. Run HTML integrity & asset audit (11 HTML files)
npm run validate:html

# 3. Run production build verification gate
npm run build

# 4. Start local development server with live reload & Vercel stubbing
npm start
# Opens http://localhost:3000
```

---

## 11. Rollback Procedure

If any issue arises post-deployment:
1. Open the [Vercel Project Overview](https://vercel.com).
2. Click **Deployments**.
3. Locate the previous healthy deployment.
4. Click the three dots (`...`) and select **Instant Rollback**.
5. Traffic will instantly route to the selected deployment with zero downtime.

