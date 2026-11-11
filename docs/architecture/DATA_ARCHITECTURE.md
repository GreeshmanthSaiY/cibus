# CIBUS — Data Architecture & Schema Specification

This document provides a comprehensive technical specification of CIBUS's data architecture, JSON schemas, entity relationships, validation rules, and client-side data querying pipeline.

---

## 1. Architectural Philosophy

CIBUS operates on an immutable, client-cached data architecture. The core domain data is structured across three normalized JSON datasets located in the `/data` directory:

1. **`states.json`** (28 Indian States & Regional Categorization)
2. **`food-items.json`** (28 Signature Regional Dishes & Metadata)
3. **`recipes.json`** (28 Comprehensive Heritage Cooking Guides)

```text
       ┌────────────────────────┐
       │     states.json        │
       │  (28 Indian States)    │
       └───────────┬────────────┘
                   │
                   │ 1:1 State-to-Dish Relational Integrity
                   ▼
       ┌────────────────────────┐
       │    food-items.json     │
       │  (28 Signature Dishes) │
       └───────────┬────────────┘
                   │
                   │ 1:1 Dish-to-Recipe Relational Integrity
                   ▼
       ┌────────────────────────┐
       │      recipes.json      │
       │  (28 Culinary Recipes) │
       └────────────────────────┘
```

---

## 2. Dataset Schemas & Specifications

### 2.1 States Dataset (`data/states.json`)

The states dataset represents all 28 states of India grouped into geographic culinary zones: `North`, `South`, `East`, `West`, `Central`, and `Northeast`.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "StateEntity",
  "type": "object",
  "required": ["id", "name", "region", "capital", "signature_dish", "description"],
  "properties": {
    "id": { "type": "string", "pattern": "^[a-z-]+$" },
    "name": { "type": "string" },
    "region": { "type": "string", "enum": ["North", "South", "East", "West", "Central", "Northeast"] },
    "capital": { "type": "string" },
    "signature_dish": { "type": "string" },
    "description": { "type": "string" }
  }
}
```

### 2.2 Food Items Dataset (`data/food-items.json`)

Each food item represents a verified culinary icon of its corresponding state, including pricing in INR, dietary classification, estimated preparation time, and high-definition photography URL.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "FoodItemEntity",
  "type": "object",
  "required": [
    "id",
    "name",
    "state",
    "region",
    "category",
    "price",
    "prep_time",
    "image_url",
    "description",
    "ingredients"
  ],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "state": { "type": "string" },
    "region": { "type": "string", "enum": ["North", "South", "East", "West", "Central", "Northeast"] },
    "category": { "type": "string", "enum": ["Vegetarian", "Non-Vegetarian", "Vegan"] },
    "price": { "type": "number", "minimum": 0 },
    "prep_time": { "type": "string" },
    "image_url": { "type": "string" },
    "description": { "type": "string" },
    "ingredients": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}
```

### 2.3 Recipes Dataset (`data/recipes.json`)

Contains in-depth culinary preparation guides, step-by-step instructions, nutritional facts, serving suggestions, and heritage background notes.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "RecipeEntity",
  "type": "object",
  "required": [
    "id",
    "name",
    "state",
    "region",
    "servings",
    "prep_time",
    "cook_time",
    "difficulty",
    "ingredients",
    "instructions",
    "nutrition",
    "heritage_story"
  ],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "state": { "type": "string" },
    "region": { "type": "string" },
    "servings": { "type": "integer", "minimum": 1 },
    "prep_time": { "type": "string" },
    "cook_time": { "type": "string" },
    "difficulty": { "type": "string", "enum": ["Easy", "Medium", "Hard"] },
    "ingredients": {
      "type": "array",
      "items": { "type": "string" }
    },
    "instructions": {
      "type": "array",
      "items": { "type": "string" }
    },
    "nutrition": {
      "type": "object",
      "properties": {
        "calories": { "type": "string" },
        "protein": { "type": "string" },
        "carbs": { "type": "string" },
        "fat": { "type": "string" }
      }
    },
    "heritage_story": { "type": "string" }
  }
}
```

---

## 3. Verified 28 States & Dishes Roster

| # | State | Region | Signature Dish | Category | Price (INR) |
|---|---|---|---|---|---|
| 1 | Andhra Pradesh | South | Pulihora (Tamarind Rice) | Vegetarian | ₹160 |
| 2 | Arunachal Pradesh | Northeast | Bamboo Shoot Stir Fry | Vegan | ₹190 |
| 3 | Assam | Northeast | Assamese Duck Meat Curry | Non-Vegetarian | ₹380 |
| 4 | Bihar | East | Litti Chokha | Vegetarian | ₹180 |
| 5 | Chhattisgarh | Central | Chhattisgarhi Muthia | Vegetarian | ₹150 |
| 6 | Goa | West | Goan Fish Curry | Non-Vegetarian | ₹360 |
| 7 | Gujarat | West | Dhokla | Vegetarian | ₹140 |
| 8 | Haryana | North | Bajra Khichdi | Vegetarian | ₹170 |
| 9 | Himachal Pradesh | North | Himachali Dham (Madra) | Vegetarian | ₹220 |
| 10 | Jharkhand | East | Dhooska | Vegetarian | ₹140 |
| 11 | Karnataka | South | Bisi Bele Bath | Vegetarian | ₹180 |
| 12 | Kerala | South | Appam with Stew | Vegetarian | ₹200 |
| 13 | Madhya Pradesh | Central | Bhutte Ka Kees | Vegetarian | ₹160 |
| 14 | Maharashtra | West | Misal Pav | Vegetarian | ₹150 |
| 15 | Manipur | Northeast | Manipuri Kangshoi | Vegetarian | ₹170 |
| 16 | Meghalaya | Northeast | Jadoh | Non-Vegetarian | ₹280 |
| 17 | Mizoram | Northeast | Misa Mach Poora | Non-Vegetarian | ₹340 |
| 18 | Nagaland | Northeast | Smoked Pork with Bamboo Shoot | Non-Vegetarian | ₹390 |
| 19 | Odisha | East | Chhena Poda | Vegetarian | ₹190 |
| 20 | Punjab | North | Makki di Roti & Sarson da Saag | Vegetarian | ₹240 |
| 21 | Rajasthan | North | Dal Baati Churma | Vegetarian | ₹260 |
| 22 | Sikkim | Northeast | Momo (Steamed Dumplings) | Vegetarian | ₹180 |
| 23 | Tamil Nadu | South | Masala Dosa | Vegetarian | ₹150 |
| 24 | Telangana | South | Hyderabadi Biryani | Non-Vegetarian | ₹320 |
| 25 | Tripura | Northeast | Chakhwi | Vegetarian | ₹160 |
| 26 | Uttar Pradesh | North | Galouti Kebab | Non-Vegetarian | ₹310 |
| 27 | Uttarakhand | North | Kafuli | Vegetarian | ₹170 |
| 28 | West Bengal | East | Macher Jhol | Non-Vegetarian | ₹290 |

---

## 4. Client-Side Data Loading & Caching Pipeline

The application fetches datasets dynamically via native browser `fetch()` APIs with error boundaries and memory memoization:

```javascript
class DataLoader {
  static #cache = new Map();

  static async load(datasetName) {
    if (this.#cache.has(datasetName)) {
      return this.#cache.get(datasetName);
    }
    const res = await fetch(`../data/${datasetName}.json`);
    if (!res.ok) {
      throw new Error(`Failed to load dataset: ${datasetName} (HTTP ${res.status})`);
    }
    const data = await res.json();
    this.#cache.set(datasetName, Object.freeze(data));
    return this.#cache.get(datasetName);
  }
}
```

### Relational Integrity Enforcement
The integrity of the datasets is automatically verified by automated unit tests in `tests/unit/datasets.test.js`:
- Ensures each state in `states.json` has a corresponding item in `food-items.json`.
- Ensures each food item in `food-items.json` has a corresponding detailed recipe in `recipes.json`.
- Guarantees exactly 28 items per dataset without missing, corrupt, or duplicate keys.

