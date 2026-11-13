# Security Policy

## Supported Versions

The following table reflects which versions of CIBUS receive security updates:

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :x:                |

---

## Reporting a Vulnerability

Security is a foundational engineering priority for CIBUS. If you discover a security vulnerability, we appreciate your responsible disclosure.

### Private Reporting Route

Please report vulnerabilities privately through GitHub's Private Vulnerability Reporting feature (navigate to the **Security** tab of the [CIBUS repository](https://github.com/GreeshmanthSaiY/cibus/security) and click **"Report a vulnerability"**), or contact the repository maintainer directly via GitHub at [@GreeshmanthSaiY](https://github.com/GreeshmanthSaiY).

Please do not open public issues for security vulnerabilities until a coordinated assessment has been completed.

### What to Include in Your Report
1. Description of the vulnerability.
2. Steps to reproduce or proof-of-concept.
3. Potential impact and attack scenarios.
4. Suggested remediation if available.

### Our Response Commitment
- **Initial Response:** Within 48 hours of receipt.
- **Triage & Assessment:** Within 5 business days.
- **Fix & Disclosure:** Coordinated release and release notes acknowledging your contribution.

---

## Frontend Security Architecture

1. **Content Security Policy (CSP):** Rigorous CSP defined in `vercel.json` disallowing untrusted scripts and object embeds.
2. **Untrusted DOM Sanitization:** Textual data is rendered via `textContent` and `Utils.escapeHtml()` to mitigate Cross-Site Scripting (XSS).
3. **Storage Defensive Validation:** LocalStorage entries are validated against strict JSON schemas before being parsed.
4. **No Plaintext Credential Persistence:** The client demonstrates authentication flows without persisting plaintext credentials or claiming unsupported backend guarantees.

