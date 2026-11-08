# CIBUS — APPLICATION SECURITY AUDIT & HARDENING SPECIFICATION

- **Version:** 1.0.0
- **Auditor:** Application Security Engineer
- **Scope:** Static Frontend Web Application (HTML5 / CSS3 / Vanilla JavaScript)
- **Deployment Platform:** Vercel Edge Network

---

## 1. Threat Modeling & Scope Definition

Because CIBUS is a client-side web application without a custom backend server runtime (e.g. Node.js server or database daemon), the attack surface focuses on:
1. **Cross-Site Scripting (XSS):** Reflected, stored, or DOM-based injection via untrusted inputs (search queries, cart data, query parameters).
2. **Untrusted Client Storage Manipulation:** Poisoning of `localStorage` or `sessionStorage` causing application logic errors or arbitrary code execution.
3. **Clickjacking & UI Redressing:** Framing of CIBUS inside malicious iframes to hijack user clicks.
4. **Content Sniffing & Insecure Resource Loading:** MIME-confusion attacks and man-in-the-middle tampering of unpinned external resources.
5. **False Security Claims (Deceptive Auth):** Simulating secure persistent user authentication in the client without a verified cryptographic backend, leading users to believe real credentials are safe.
6. **Secret & Credential Exposure:** Accidentally committing private keys, API tokens, or production environment variables into Git history.

---

## 2. Security Findings & Remediations

### 2.1. DOM-Based XSS Prevention
- **Finding:** Legacy templates occasionally used unescaped template concatenations and raw assignments.
- **Remediation:**
  - Standardized on `textContent` and `HTMLElement.innerText` for rendering all dynamic text (dish names, descriptions, prices, user inputs).
  - Implemented a dedicated DOM sanitization helper `Utils.escapeHtml(str)` in `js/utils.js`:
    ```javascript
    function escapeHtml(str) {
      if (typeof str !== 'string') return '';
      return str.replace(/[&<>"']/g, function(match) {
        const escapeMap = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        };
        return escapeMap[match];
      });
    }
    ```
  - Prohibited direct evaluation of strings via `eval()` or `new Function()`.
  - Removed all legacy inline JavaScript handlers (`onclick="..."`, `onsubmit="..."`). All listeners are bound using `addEventListener` with strict parameter validation.

### 2.2. Client Storage Hardening & Schema Validation
- **Finding:** Cart data and form state stored in browser storage could be tampered with by a malicious user or browser extension.
- **Remediation:**
  - Abstracted all storage operations into `js/storage.js`.
  - Every retrieved cart item must pass schema validation:
    - `id`: Non-empty string, alphanumeric and hyphen only.
    - `name`: String, max 100 characters.
    - `price`: Positive number, finite, clamped between ₹10 and ₹10,000.
    - `quantity`: Positive integer, strictly clamped between 1 and 99.
  - If stored JSON is malformed or violates schema, it is safely cleared and reset to `[]` with a silent non-fatal warning, preventing application crashes.
  - Prohibited storage of passwords, auth tokens, or PII in `localStorage`.

### 2.3. Form Security & Input Sanitization
- **Finding:** Legacy forms lacked input validation, used identical `name="name"` attributes on multiple inputs, and exhibited broken confirmation logic.
- **Remediation:**
  - Proper HTML5 input types applied (`type="email"`, `type="password"`, `type="text"`, `type="tel"`).
  - Appropriate `autocomplete` attributes configured (`autocomplete="username"`, `autocomplete="current-password"`, `autocomplete="new-password"`).
  - Passwords never echoed in console logs, alert popups, or URL parameters.
  - Form validation in `js/validation.js` checks length, regex patterns, and password policies before allowing client processing.

### 2.4. Honest Authentication Boundaries
- **Finding:** The application presented login and sign-up interfaces, but lacked a backend authentication server. Legacy code simulated login by linking directly to `home.html`.
- **Remediation:**
  - Clearly articulated the interface boundary: The application provides a demonstration UI for client interaction and testing.
  - Clearly documented in documentation and on the login/registration pages that CIBUS is running in **Client Demonstration Mode**.
  - No claims are made of cryptographic password hashing or database persistence until a trusted provider (e.g. Firebase Auth, Supabase, or OAuth2) is integrated.

### 2.5. Secret Scanning & Git Hygiene
- **Finding:** Git repository audit verified:
  - 0 private keys (`.pem`, `.key`) committed.
  - 0 hardcoded API keys detected.
  - 0 `.env` files committed.
- **Remediation:**
  - Comprehensive `.gitignore` implemented covering `.env`, `.env.local`, `.env.*.local`, `*.pem`, `*.key`, `backup/`, and build directories.
  - Provided `.env.example` documenting optional analytics or API endpoints without exposing sensitive credentials.

---

## 3. Production HTTP Security Headers Configuration

The following security headers are configured via `vercel.json` and enforced across all routes on the Vercel edge:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://kit.fontawesome.com https://ka-f.fontawesome.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://use.fontawesome.com; font-src 'self' https://fonts.gstatic.com https://ka-f.fontawesome.com; img-src 'self' data: https:; connect-src 'self' https://ka-f.fontawesome.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), payment=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

### 3.1. Rationale for CSP Directives
- **`default-src 'self'`**: All assets default to first-party origin.
- **`script-src 'self' ...`**: Allows local application scripts plus FontAwesome icon kit. Disallows `unsafe-eval`.
- **`style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`**: Allows local stylesheets, Google Fonts stylesheets, and scoped inline style blocks for dynamic components.
- **`font-src 'self' https://fonts.gstatic.com ...`**: Permits Google Fonts webfonts and FontAwesome font glyphs.
- **`img-src 'self' data: https:`**: Permits local culinary images, inline SVG data, and HTTPS food photography from vetted culinary CDNs.
- **`frame-ancestors 'none'` / `X-Frame-Options: DENY`**: Protects CIBUS from clickjacking by disallowing framing across all domains.
- **`Permissions-Policy`**: Disables unused browser capabilities (camera, microphone, geolocation, payment).
