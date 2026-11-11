# CIBUS — Production Deployment & Release Engineering Guide

- **Version:** 2.0.0
- **Auditor:** Release Management & DevOps Engineering
- **Target Platform:** Vercel Global Edge Network & GitHub Enterprise/Free

---

## 1. Overview & Branching Governance

CIBUS enforces an enterprise 3-branch Git lifecycle:

```text
[Local Feature Branch]  ──(PR)──>  [develop]  ──(PR)──>  [main]
   (Preview URL)                    (Staging Preview)      (Production Domain)
```

### Branch Responsibilities
1. **`feature/*` / `update` (Active Development):**
   - All feature implementation, bug fixes, refactoring, and UI enhancements occur here.
   - Pushes trigger the `.github/workflows/quality-checks.yml` workflow.
2. **`develop` (Integration & Preview Staging):**
   - Merged exclusively via Pull Request.
   - Connected to Vercel Preview Deployments for staging verification.
3. **`main` (Production Releases):**
   - Merged exclusively via Pull Request from `develop` by repository owner `@GreeshmanthSaiY`.
   - Never modified directly. Force pushes and branch deletion are permanently blocked.
   - Connected to Vercel Production Environment (`cibus-silk.vercel.app` or custom domain).

---

## 2. GitHub Branch Protection Configuration

Configure GitHub branch protection rules under **Settings ➔ Branches ➔ Branch protection rules** for `main`:

1. **Branch name pattern:** `main`
2. **Protect matching branches:**
   - [x] **Require a pull request before merging:**
     - Require approvals: `1`
     - Dismiss stale pull request approvals when new commits are pushed: `Checked`
   - [x] **Require status checks to pass before merging:**
     - Require branches to be up to date before merging: `Checked`
     - Status checks to enforce: `Code Quality & Integrity Validation`
   - [x] **Require conversation resolution before merging:** `Checked`
   - [x] **Do not allow bypassing the above settings:** `Checked`
   - [x] **Block force pushes:** `Checked`
   - [x] **Block deletions:** `Checked`

Apply equivalent settings to `develop` to ensure pull requests and status checks are required before merging into staging.

---

## 3. Vercel Configuration Settings

In the [Vercel Dashboard](https://vercel.com):

| Setting | Value | Rationale |
| :--- | :--- | :--- |
| **Framework Preset** | `Other` | Pure static HTML/CSS/JS without compilation steps. |
| **Root Directory** | `./` | Root repository level. |
| **Build Command** | `npm run build` | Executes `scripts/verify-build.js` integrity audit. |
| **Output Directory** | `.` | Declared in `vercel.json` (`outputDirectory: "."`). |
| **Install Command** | `npm install` | Fast setup with zero heavy runtime packages. |
| **Node.js Version** | `20.x` | Aligned with `.nvmrc` (`20.18.0`). |

---

## 4. Release Verification Checklist

Before tagging or deploying a production release:

- [ ] All 22 unit tests pass: `npm test`
- [ ] HTML integrity & asset audit passes with 0 errors: `npm run validate:html`
- [ ] Local HTTP server route probe passes: `npm run test:probe`
- [ ] Build verification script succeeds: `npm run build`
- [ ] Vercel Preview Deployment verified on mobile, tablet, and desktop viewports.
- [ ] No uncommitted or untracked temporary files exist in the working directory.

