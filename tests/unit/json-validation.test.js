const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const dataDir = path.resolve(__dirname, '../../data');

test('JSON Datasets: states.json validation', () => {
  const filePath = path.join(dataDir, 'states.json');
  assert.ok(fs.existsSync(filePath), 'states.json must exist');

  const raw = fs.readFileSync(filePath, 'utf8');
  const states = JSON.parse(raw);

  assert.ok(Array.isArray(states), 'states.json must be an array');
  assert.strictEqual(states.length, 28, 'Must cover exactly 28 Indian States');

  const seenIds = new Set();
  const validRegions = new Set(['North', 'South', 'East', 'West', 'Central', 'Northeast']);

  states.forEach((s, idx) => {
    assert.ok(s.id && typeof s.id === 'string', `State #${idx} missing id`);
    assert.ok(s.name && typeof s.name === 'string', `State #${idx} missing name`);
    assert.ok(validRegions.has(s.region), `State ${s.name} has invalid region: ${s.region}`);
    assert.ok(s.capital && typeof s.capital === 'string', `State ${s.name} missing capital`);
    assert.ok(s.dish && typeof s.dish === 'string', `State ${s.name} missing dish`);
    assert.ok(s.dishId && typeof s.dishId === 'string', `State ${s.name} missing dishId`);
    assert.ok(!seenIds.has(s.id), `Duplicate state id: ${s.id}`);
    seenIds.add(s.id);
  });
});

test('JSON Datasets: food-items.json validation', () => {
  const filePath = path.join(dataDir, 'food-items.json');
  assert.ok(fs.existsSync(filePath), 'food-items.json must exist');

  const raw = fs.readFileSync(filePath, 'utf8');
  const foods = JSON.parse(raw);

  assert.ok(Array.isArray(foods), 'food-items.json must be an array');
  assert.ok(foods.length >= 28, 'Must contain at least 28 regional dishes');

  const seenIds = new Set();
  const validDiets = new Set(['Vegetarian', 'Non-Vegetarian', 'Vegan']);

  foods.forEach((f, idx) => {
    assert.ok(f.id && typeof f.id === 'string', `Food #${idx} missing id`);
    assert.ok(f.name && typeof f.name === 'string', `Food #${idx} missing name`);
    assert.ok(f.state && typeof f.state === 'string', `Food #${idx} missing state`);
    assert.ok(typeof f.price === 'number' && f.price > 0, `Food ${f.name} invalid price: ${f.price}`);
    assert.ok(typeof f.rating === 'number' && f.rating >= 1 && f.rating <= 5, `Food ${f.name} invalid rating: ${f.rating}`);
    assert.ok(f.description && f.description.length >= 10, `Food ${f.name} description too short`);
    assert.ok(f.image && typeof f.image === 'string', `Food ${f.name} missing image`);
    assert.ok(validDiets.has(f.diet), `Food ${f.name} invalid diet: ${f.diet}`);
    assert.ok(!seenIds.has(f.id), `Duplicate food item id: ${f.id}`);
    seenIds.add(f.id);
  });
});

test('JSON Datasets: recipes.json validation and cross-referencing', () => {
  const recipesPath = path.join(dataDir, 'recipes.json');
  const statesPath = path.join(dataDir, 'states.json');

  assert.ok(fs.existsSync(recipesPath), 'recipes.json must exist');
  const recipes = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));
  const states = JSON.parse(fs.readFileSync(statesPath, 'utf8'));

  assert.ok(Array.isArray(recipes), 'recipes.json must be an array');
  assert.strictEqual(recipes.length, 28, 'Must contain exactly 28 recipes');

  const recipeIdSet = new Set(recipes.map(r => r.id));

  // Verify all dishIds in states.json map to a valid recipe id
  states.forEach(s => {
    assert.ok(recipeIdSet.has(s.dishId), `State ${s.name} dishId "${s.dishId}" not found in recipes.json`);
  });

  const validDifficulties = new Set(['Easy', 'Medium', 'Hard']);

  recipes.forEach((r, idx) => {
    assert.ok(r.id && typeof r.id === 'string', `Recipe #${idx} missing id`);
    assert.ok(r.name && typeof r.name === 'string', `Recipe #${idx} missing name`);
    assert.ok(r.state && typeof r.state === 'string', `Recipe #${idx} missing state`);
    assert.ok(r.prepTime && typeof r.prepTime === 'string', `Recipe ${r.name} missing prepTime`);
    assert.ok(r.cookTime && typeof r.cookTime === 'string', `Recipe ${r.name} missing cookTime`);
    assert.ok(typeof r.servings === 'number' && r.servings >= 1, `Recipe ${r.name} invalid servings`);
    assert.ok(validDifficulties.has(r.difficulty), `Recipe ${r.name} invalid difficulty: ${r.difficulty}`);

    assert.ok(Array.isArray(r.ingredients) && r.ingredients.length >= 4, `Recipe ${r.name} must have at least 4 ingredients`);
    assert.ok(Array.isArray(r.instructions) && r.instructions.length >= 4, `Recipe ${r.name} must have at least 4 instructions`);
  });
});

