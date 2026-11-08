const test = require('node:test');
const assert = require('node:assert');

// Mock localStorage
const mockStorage = {};
global.window = {
  localStorage: {
    getItem: (k) => mockStorage[k] !== undefined ? mockStorage[k] : null,
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: (k) => { delete mockStorage[k]; }
  }
};

const { StorageManager } = require('../../js/storage.js');

test('StorageManager: get and set roundtrip', () => {
  StorageManager.set('test_key', { foo: 'bar', count: 42 });
  const val = StorageManager.get('test_key');
  assert.deepStrictEqual(val, { foo: 'bar', count: 42 });
});

test('StorageManager: corrupted JSON returns default and clears key', () => {
  mockStorage['bad_key'] = '{ invalid json string...';
  const val = StorageManager.get('bad_key', 'fallback');
  assert.strictEqual(val, 'fallback');
  assert.strictEqual(mockStorage['bad_key'], undefined);
});

test('StorageManager.validateCartSchema: filters out invalid entries', () => {
  const dirty = [
    null,
    undefined,
    'random string',
    { name: 'Missing ID' },
    { id: '1', name: 'Valid Item', price: 150, quantity: 2 },
    { id: '2', name: 'Negative Price', price: -50, quantity: 1 },
    { id: '3', name: 'Invalid Quantity', price: 100, quantity: 'abc' }
  ];

  const cleaned = StorageManager.validateCartSchema(dirty);
  assert.strictEqual(cleaned.length, 1);
  assert.strictEqual(cleaned[0].id, '1');
  assert.strictEqual(cleaned[0].price, 150);
  assert.strictEqual(cleaned[0].quantity, 2);
});
