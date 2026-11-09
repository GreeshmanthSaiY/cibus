const test = require('node:test');
const assert = require('node:assert');

// Mock localStorage for Cart testing
const mockStorage = {};
global.window = {
  localStorage: {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: (k) => { delete mockStorage[k]; }
  },
  dispatchEvent: () => {}
};
global.CustomEvent = class CustomEvent {};

const { StorageManager } = require('../../js/storage.js');
global.StorageManager = StorageManager;
const { CartEngine } = require('../../js/cart.js');

test('CartEngine: starts empty', () => {
  CartEngine.clearCart();
  assert.strictEqual(CartEngine.getTotalCount(), 0);
  assert.strictEqual(CartEngine.getSubtotal(), 0);
  assert.strictEqual(CartEngine.getGrandTotal(), 0);
});

test('CartEngine: adds item and increments count', () => {
  CartEngine.clearCart();
  const item = { id: 'pulihora', name: 'Pulihora', price: 160, state: 'Andhra Pradesh' };
  
  const success = CartEngine.addItem(item, 2);
  assert.strictEqual(success, true);
  assert.strictEqual(CartEngine.getTotalCount(), 2);
  assert.strictEqual(CartEngine.getSubtotal(), 320);

  // Add same item again
  CartEngine.addItem(item, 1);
  assert.strictEqual(CartEngine.getTotalCount(), 3);
  assert.strictEqual(CartEngine.getSubtotal(), 480);
});

test('CartEngine: calculates GST and Grand Total correctly', () => {
  CartEngine.clearCart();
  CartEngine.addItem({ id: 'item1', name: 'Item 1', price: 200 }, 1);
  
  assert.strictEqual(CartEngine.getSubtotal(), 200);
  assert.strictEqual(CartEngine.getTax(0.05), 10);
  assert.strictEqual(CartEngine.getGrandTotal(0.05), 210);
});

test('CartEngine: updates item quantity and clamps', () => {
  CartEngine.clearCart();
  CartEngine.addItem({ id: 'item1', name: 'Item 1', price: 100 }, 2);

  CartEngine.updateQuantity('item1', 5);
  assert.strictEqual(CartEngine.getTotalCount(), 5);

  // Clamping to 0 removes the item
  CartEngine.updateQuantity('item1', 0);
  assert.strictEqual(CartEngine.getTotalCount(), 0);
});

test('CartEngine: removes item', () => {
  CartEngine.clearCart();
  CartEngine.addItem({ id: 'item1', name: 'Item 1', price: 100 }, 1);
  CartEngine.addItem({ id: 'item2', name: 'Item 2', price: 150 }, 2);
  assert.strictEqual(CartEngine.getTotalCount(), 3);

  CartEngine.removeItem('item1');
  assert.strictEqual(CartEngine.getTotalCount(), 2);
  assert.strictEqual(CartEngine.getItems().some(i => i.id === 'item1'), false);
});

test('CartEngine: clears and returns empty array when user is signed out', () => {
  // Simulate an authenticated session with items
  global.AuthManager = {
    isAuthenticated: () => true
  };
  CartEngine.clearCart();
  CartEngine.addItem({ id: 'item1', name: 'Item 1', price: 100 }, 2);
  assert.strictEqual(CartEngine.getTotalCount(), 2);

  // User signs out
  global.AuthManager.isAuthenticated = () => false;

  // CartEngine should immediately report 0 items and empty array
  assert.strictEqual(CartEngine.getTotalCount(), 0);
  assert.deepStrictEqual(CartEngine.getItems(), []);

  // Unauthenticated user cannot add items
  const addAttempt = CartEngine.addItem({ id: 'item2', name: 'Item 2', price: 200 }, 1);
  assert.strictEqual(addAttempt, false);
  assert.strictEqual(CartEngine.getTotalCount(), 0);

  delete global.AuthManager;
});
