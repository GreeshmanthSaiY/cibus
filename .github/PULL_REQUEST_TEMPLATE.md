# Pull Request — CIBUS Engineering

## 1. Summary of Changes
<!-- Provide a clear, concise overview of what has changed and the purpose of this PR -->

- **Target Branch:** `develop` (for features) / `main` (for releases)
- **Source Branch:** `update` (for features) / `develop` (for releases)
- **Related Issue / Directive:** 

---

## 2. Scope & Architectural Impact
- [ ] HTML structure updates
- [ ] Stylesheet / Design System (CSS) updates
- [ ] JavaScript / State logic updates
- [ ] Culinary Dataset (`data/*.json`) updates
- [ ] Asset / Image optimizations
- [ ] Security headers or routing changes

---

## 3. Testing & Verification Checklist
- [ ] `node --test tests/unit/*.test.js` passes (100% green)
- [ ] `node tests/integration/html-integrity.test.js` passes (0 errors, 0 broken links, 0 duplicate IDs)
- [ ] Verified on Desktop viewport (> 1024px)
- [ ] Verified on Mobile viewport (< 768px) and mobile navigation drawer functions
- [ ] Shopping Cart interactions verified (add, remove, quantity update, subtotal & total calculation)
- [ ] No hardcoded localhost (`127.0.0.1:5500`) references present
- [ ] No browser console errors on any route

---

## 4. Security Considerations
- [ ] No plaintext credentials or secrets introduced
- [ ] All dynamic DOM insertions sanitized (`textContent` / `Utils.escapeHtml`)
- [ ] CSP compliant (no prohibited external origins)
- [ ] Storage inputs validated against defensive JSON schemas

---

## 5. Deployment & Rollback Plan
- **Vercel Impact:** Static deployment; zero build failure risk.
- **Rollback Strategy:** Revert commit on `main` or promote previous stable deployment in Vercel dashboard.
