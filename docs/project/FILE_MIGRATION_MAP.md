# CIBUS — File Migration & Preservation Mapping

This document provides a trace of every legacy file in the original Cibus repository to its modernized, clean destination in CIBUS v2.0.0.

---

## 1. File Traceability Matrix

| Original Legacy File | Purpose | Modern Destination | Status |
|---|---|---|---|
| `opening_page.html` | Animated splash page | `index.html` | **Modernized:** Retains Ashoka Chakra, tricolor gradient, parallax waves; adds top nav and hero shortcuts above the fold. |
| `home.html` | Main hub | `pages/home.html` | **Modernized:** High-definition photography, regional quick links, responsive navigation. |
| `_new_all_states.html` | Long food list | `pages/food-menu.html` | **Modernized:** Card grid, search filter, regional tabs, in-card quantity steppers. |
| `recipe_cards.html` | Recipe gallery | `pages/recipe-cards.html` | **Modernized:** Cascading fanned cards with tags and smooth deep linking. |
| `trail_3_uid_recipe_page.html` | Detailed recipes | `pages/recipe-detail.html` | **Modernized:** Full ingredients, preparation steps, interactive cooking checklists. |
| `add_to_cart.html` | Cart page | `pages/cart.html` | **Modernized:** Dynamic cart engine, quantity controls, GST calculations, empty state. |
| `login.html` | User login | `pages/login.html` | **Modernized:** Form validation, demo user presets, session state. |
| `form.html` | Sign up | `pages/register.html` | **Modernized:** Client validation, password strength indicators. |
| `contact_us.html` | Contact form | `pages/contact.html` | **Modernized:** Validated inputs, accessible alerts, toast confirmations. |
| `404.html` | Error page | `404.html` & `pages/404.html` | **Modernized:** Custom branded 404 page for root and page-level routes. |
| `Cibus_Project_Documentation.docx` | Legacy Word doc | `docs/legacy/Cibus_Project_Documentation.docx` | **Preserved:** Retained in legacy folder for historical record. |

