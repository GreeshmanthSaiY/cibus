# CIBUS — EXISTING FEATURES CATALOGUE & RECOVERY RECORD

- **Document Version:** 1.0.0
- **Auditor:** Principal Software Architect

This document records all culinary, functional, and regional content from the original Cibus application to guarantee 100% preservation and intentional enhancement.

---

## 1. 28 Indian States & Traditional Culinary Mapping

The original codebase featured culinary representations across 28 Indian States. Every dish, state affiliation, and culinary description has been recovered, catalogued, and enriched into structured datasets (`data/states.json`, `data/food-items.json`, and `data/recipes.json`):

| # | State | Signature Traditional Dish | Original Source Anchor | Culinary Highlights |
|---|---|---|---|---|
| 1 | **Andhra Pradesh** | **Pulihora** (Tamarind Rice) | `#pulihora` | Cooked rice infused with tangy tamarind pulp, roasted peanuts, mustard seeds, green chilies, and curry leaves. |
| 2 | **Arunachal Pradesh** | **Bamboo Shoot Stir Fry** | `#bamboo` | Tender bamboo shoots stir-fried with traditional northeastern herbs, fenugreek, and mustard oil. |
| 3 | **Assam** | **Duck Meat Curry** (Khaar / Joha) | `#duck` | Slow-cooked tender duck prepared with ash gourd (kumura), black pepper, and indigenous Assamese spices. |
| 4 | **Bihar** | **Litti Chokha** | `#litti` | Roasted whole wheat dough balls stuffed with spiced sattu (roasted gram flour), paired with smoky mashed brinjal and tomato chokha. |
| 5 | **Chhattisgarh** | **Muthia** | `#muthia` | Steamed and seasoned savory rice flour dumplings tempered with mustard seeds and fresh coriander. |
| 6 | **Goa** | **Goan Fish Curry** | `#fish` | Fresh fish simmered in a fragrant coconut milk curry infused with tart kokum, Kashmiri chilies, and coriander. |
| 7 | **Gujarat** | **Khaman Dhokla** | `#dhokla` | Spongy steamed fermented gram flour cakes garnished with mustard seeds, sesame, green chilies, and fresh grated coconut. |
| 8 | **Haryana** | **Bajra Khichdi** | `#bajre` | Wholesome pearl millet and moong dal porridge slow-cooked with pure desi ghee. |
| 9 | **Himachal Pradesh** | **Dham** | `#dham` | Festive vegetarian feast prepared with red kidney beans (rajma), curd, and aromatic whole spices in brass utensils. |
| 10 | **Jharkhand** | **Dhooska** | `#dhooska` | Crispy, savory deep-fried pancake made from fermented rice and chana dal batter, served with spicy aloo chana curry. |
| 11 | **Karnataka** | **Bisi Bele Bath** | `#bisi` | Hot lentil rice cooked with assorted vegetables, tamarind, nutmeg, and aromatic Bisi Bele Bath masala powder. |
| 12 | **Kerala** | **Appam with Stew** | `#appam` | Bowl-shaped fermented rice batter pancakes with soft, spongy centers and crispy lacy edges, paired with vegetable or meat coconut stew. |
| 13 | **Madhya Pradesh** | **Bhutte Ka Kees** | `#bhutte` | Grated fresh sweet corn simmered in seasoned milk with mustard seeds, green chilies, and grated coconut. |
| 14 | **Maharashtra** | **Misal Pav** | `#misal` | Spicy sprouted moth bean curry (usal) topped with crispy farsan, fresh onions, lemon, and served with buttery pav. |
| 15 | **Manipur** | **Kangshoi** | `#kangshoi` | Nutritious soupy vegetable stew boiled with seasonal greens, sliced onions, cloves, and fermented fish (ngari) or mushroom. |
| 16 | **Meghalaya** | **Jadoh** | `#jadoh` | Traditional Khasi dish of aromatic red hill rice cooked with seasoned meat, ginger, onions, and black pepper. |
| 17 | **Mizoram** | **Misa Mach Poora** | `#misa` | Grilled or pan-roasted freshwater shrimp seasoned with mustard oil, coriander, peppercorns, and zesty lime juice. |
| 18 | **Nagaland** | **Smoked Pork with Bamboo Shoots** | `#pork` | Tender smoked pork slow-braised with fermented bamboo shoots, spicy Naga king chili (bhut jolokia), and garlic. |
| 19 | **Odisha** | **Chhena Poda** | `#chenna` | Iconic baked cottage cheese dessert caramelized with sugar, cardamom, and cashews, wrapped in sal leaves. |
| 20 | **Punjab** | **Makki di Roti & Sarson da Saag** | `#makki` | Rustic flatbreads of maize flour accompanied by slow-cooked mustard greens topped with homemade white butter. |
| 21 | **Rajasthan** | **Dal Baati Churma** | `#dal` | Hard wheat rolls baked over cow dung cakes or tandoor, dipped in ghee and served with spicy panchmel dal and sweet jaggery churma. |
| 22 | **Sikkim** | **Momo (Steamed Dumplings)** | `#momo` | Handcrafted steamed flour wrappers stuffed with spiced vegetable or meat filling, accompanied by fiery red chili-tomato chutney. |
| 23 | **Tamil Nadu** | **Ven Pongal** | `#pongal` | Comforting savory porridge of rice and split yellow moong dal tempered with crushed black peppercorns, cumin, ginger, and cashews in ghee. |
| 24 | **Telangana** | **Hyderabadi Dum Biryani** | `#biriyani` | Fragrant basmati rice layered with marinated meat or vegetables, saffron, mint, and fried onions, slow-cooked under sealed steam (dum). |
| 25 | **Tripura** | **Chakhwi** | `#chakhwi` | Healthy traditional dish prepared with bamboo shoots, green papaya, pork or jackfruit seeds, cooked with indigenous alkaline berma. |
| 26 | **Uttar Pradesh** | **Tunday Kababi (Galouti Kebab)** | `#tunde` | Melt-in-the-mouth spiced minced meat kebabs prepared with over 160 secret spices, originating from the royal Awadhi kitchens of Lucknow. |
| 27 | **Uttarakhand** | **Kafuli** | `#kafuli` | Thick, vibrant green curry made from spinach and fenugreek leaves, slow-cooked in iron kadhai and thickened with rice paste. |
| 28 | **West Bengal** | **Kosha Mangsho** | `#kosha` | Rich, dark, slow-roasted mutton curry cooked in mustard oil with whole garam masalas, ginger-garlic paste, and caramelized onions. |

---

## 2. Interactive Page Feature Breakdown

### A. Landing / Splash Screen (`opening_page.html` ➔ `index.html`)
- **Original:** Animated SVG Ashoka Chakra, animated SVG gentle waves (multi-layered parallax), welcoming typography, links to sign up and login.
- **Enhanced:** Preserved the iconic waving tricolor / Ashoka Chakra visual identity, repaired SVG syntax errors, added responsive viewport clamping, added a direct "Explore CIBUS" CTA button for immediate guest access, and improved contrast to meet WCAG AA standards.

### B. Culinary Hub (`home.html` ➔ `pages/home.html`)
- **Original:** Hero showcase section, introductory culinary quote from Max Mueller, navigation links.
- **Enhanced:** Fixed broken background image paths (`UI Design Case study images/...` and `ezgif...`), introduced an editorial food hero with authentic typography, quick-navigation cards to regional states, and a mobile-responsive navigation bar.

### C. Food Menu Directory (`_new_all_states.html` ➔ `pages/food-menu.html`)
- **Original:** Long list of state dishes with hardcoded `19000px` height and broken base64 images.
- **Enhanced:** Converted into a clean, responsive card grid with live instant search by dish name, state, or region (North, South, East, West, Central, Northeast), state filtering tabs, resilient image fallback handling, and "Add to Cart / Favorites" quick-action buttons.

### D. Recipe Cards Gallery (`recipe_cards.html` ➔ `pages/recipe-cards.html`)
- **Original:** 28 recipe cards with hardcoded `127.0.0.1:5500` localhost links and invalid duplicate button IDs.
- **Enhanced:** Converted to semantic HTML5 cards with relative dynamic routing (`./recipe-detail.html#<dish-id>`), search filter, preparation time tags, difficulty level tags, and smooth hover micro-interactions.

### E. Recipe Details (`trail_3_uid_recipe_page.html` ➔ `pages/recipe-detail.html`)
- **Original:** Two-column grid with detailed ingredients and step-by-step instructions for all dishes.
- **Enhanced:** Restored full ingredient checklists and step-by-step cooking instructions, added jump-to-dish quick navigation sidebar/dropdown, responsive column restructuring for mobile devices, and interactive checkbox toggles for ingredients while cooking.

### F. Cart & Favorites (`add_to_cart.html` ➔ `pages/cart.html`)
- **Original:** Visual grid of dishes with button animation but no actual state, persistence, or calculations.
- **Enhanced:** Complete production-grade cart engine with:
  - Add / remove items.
  - Increment / decrement quantity controls (clamped 1–99).
  - Live calculations for Subtotal, GST/Taxes (5%), and Grand Total.
  - LocalStorage persistence with data schema validation.
  - Empty cart state with "Browse Foods" call to action.
  - Live item count badge in top navigation across all pages.
  - Quick toast notifications when items are added.

### G. User Authentication Interface (`login.html` & `form.html` ➔ `pages/login.html` & `pages/register.html`)
- **Original:** Styled login and registration forms with fake navigation links, mismatched input names, and broken password matching logic.
- **Enhanced:** Honest, secure client-side interface:
  - Real-time client-side email format validation.
  - Password strength validation (minimum 8 characters, uppercase, lowercase, number).
  - Confirm password synchronization check with accessible error messages.
  - Clear architectural notice indicating static client mode (no mock backend secrets or insecure plaintext storage).
  - Session demo mode allowing simulated sign-in for preview testing without storing real passwords.

### H. Contact Inquiries (`contact.html` ➔ `pages/contact.html`)
- **Original:** Form with raw `alert()` validation and unclosed HTML tags.
- **Enhanced:** Accessible contact form with:
  - Accessible inline error feedback (`aria-describedby`, `aria-invalid`).
  - Character counters for message body.
  - Honest submission state: clear notification acknowledging client receipt with clear message status, avoiding deceptive false backend submission claims.
  - Real operational contact metadata for Indian culinary discovery inquiries.
