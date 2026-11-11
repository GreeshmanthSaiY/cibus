# CIBUS — Frontend Security & Coding Guidelines

This guide establishes the mandatory security rules and engineering practices for contributing code, authoring DOM interactions, and handling user inputs in CIBUS.

---

## 1. Core Principles

1. **Defense in Depth:** Security controls must exist at markup, styling, scripting, and transport layers.
2. **Zero Trust Client State:** Never assume browser storage (`localStorage`, `sessionStorage`, or cookies) is untampered. Always validate schemas on read.
3. **Strict DOM Sanitization:** Never render unsanitized dynamic strings into `innerHTML`.
4. **Honest Authentication & Privacy:** Never capture or persist plaintext user credentials in production without TLS-secured backend endpoints.

---

## 2. DOM Manipulation & Cross-Site Scripting (XSS) Prevention

### Rule 2.1: Prefer `textContent` Over `innerHTML`
Always use `textContent` or `innerText` when rendering user inputs, dish titles, descriptions, and dynamic data:

```javascript
// ✅ Correct
element.textContent = userProvidedText;

// ❌ Vulnerable to XSS
element.innerHTML = userProvidedText;
```

### Rule 2.2: Escaping Dynamic Templates
When constructing complex template literals that must be inserted via `innerHTML`, every dynamic variable must be escaped with `Utils.escapeHtml()`:

```javascript
// ✅ Correct
const safeHTML = `
  <div class="dish-card">
    <h3>${Utils.escapeHtml(dish.name)}</h3>
    <p>${Utils.escapeHtml(dish.description)}</p>
  </div>
`;
container.innerHTML = safeHTML;
```

### Rule 2.3: Prohibit `eval()` and Function Constructors
Never use:
- `eval(...)`
- `new Function(...)`
- `setTimeout("string", ...)`
- `setInterval("string", ...)`

---

## 3. Client Storage Security Model

### Understanding the Trade-Offs
Browser `localStorage` and `sessionStorage` are synchronous, persistent key-value stores. They are accessible to any JavaScript running on the same origin (including any script introduced via an XSS vulnerability).

### Defensive Storage Rules:
1. **Never Store Secrets:** Do not store sensitive tokens, authentication cookies, private cryptographic keys, or financial data in `localStorage`.
2. **Schema Verification:** All data retrieved via `StorageManager.get(key)` is passed through validation guards (e.g. `validateCartSchema`).
3. **Corrupted Data Reset:** If parsing fails or an invalid payload is detected, reset to the default empty state immediately.

---

## 4. Content Security Policy (CSP) Directives

CIBUS enforces a strict CSP in `vercel.json` and local `server.js`:

| Directive | Allowed Origins | Purpose |
|---|---|---|
| `default-src` | `'self'` | Disallow all external resources unless explicitly whitelisted |
| `script-src` | `'self'`, `'unsafe-inline'`, Vercel scripts | Allow local scripts and Vercel analytics |
| `style-src` | `'self'`, `'unsafe-inline'`, Google Fonts | Allow local styling and typography |
| `font-src` | `'self'`, `fonts.gstatic.com`, `data:` | Typography assets |
| `img-src` | `'self'`, `data:`, `https:` | High-definition regional food photography |
| `connect-src` | `'self'`, Vercel analytics/vitals endpoints | Telemetry and local data loading |
| `frame-ancestors` | `'none'` | Completely prevent framing/clickjacking |
| `object-src` | `'none'` | Block Flash and plugins |
| `base-uri` | `'self'` | Prevent base tag hijacking |

---

## 5. Security Incident Response
If a security vulnerability is identified, please follow the disclosure instructions outlined in [SECURITY.md](../../SECURITY.md).

