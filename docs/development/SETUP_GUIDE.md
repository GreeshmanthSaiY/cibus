# CIBUS — Local Developer Setup & Engineering Workflow Guide

This guide covers everything needed to clone, run, test, and contribute to the CIBUS platform locally.

---

## 1. Prerequisites

- **Operating System:** Windows 10/11, macOS, or Linux.
- **Node.js:** Node.js v20.x LTS or higher (aligned with `.nvmrc`).
- **Package Manager:** `npm` (v10+ bundled with Node.js).
- **Git:** Git 2.30+.
- **Modern Browser:** Chrome, Edge, Firefox, or Safari with ES2022+ support.

---

## 2. Quickstart (Under 2 Minutes)

```bash
# 1. Clone repository
git clone https://github.com/GreeshmanthSaiY/cibus.git
cd cibus

# 2. Check out working branch
git checkout update

# 3. Verify Node version
node --version # Should report v20.x or higher

# 4. Run test suite
npm test

# 5. Start development server with live reload
npm start
```

The CLI will display the clean local development launch banner and open:
```text
CIBUS Development Server

Local: http://localhost:3000/

Ready.
```

---

## 3. Interactive CLI Developer Commands

The local development server (`server.js`) includes an interactive CLI prompt:

| Key | Action |
|---|---|
| `h` | Display help menu and shortcut list |
| `r` | Send manual live reload signal to all connected browser tabs |
| `o` | Re-open website in default browser |
| `c` | Clear console output |
| `u` | Run unit tests in-process |
| `q` | Stop server gracefully |

---

## 4. Code Structure & Conventions

- **HTML:** Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`).
- **CSS:** BEM-like naming, scoped variables in `css/variables.css`, responsive breakpoints at 480px, 768px, 1024px, 1280px.
- **JavaScript:** Native ES6 modules, strict mode, zero frameworks, defensive DOM sanitization.
- **Data:** JSON datasets located strictly under `data/`.

---

## 5. Verification Commands

Before staging any changes, always execute:

```bash
# Verify unit tests
npm test

# Verify all HTML links and assets
npm run validate:html

# Verify build readiness
npm run build
```

