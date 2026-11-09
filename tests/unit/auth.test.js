const test = require('node:test');
const assert = require('node:assert');

// Mock sessionStorage and window
const mockSession = {};
global.window = {
  sessionStorage: {
    getItem: (k) => (mockSession[k] !== undefined ? mockSession[k] : null),
    setItem: (k, v) => {
      mockSession[k] = String(v);
    },
    removeItem: (k) => {
      delete mockSession[k];
    },
    clear: () => {
      for (const k of Object.keys(mockSession)) delete mockSession[k];
    }
  },
  dispatchEvent: () => true
};
global.CustomEvent = class CustomEvent {
  constructor(type, init) {
    this.type = type;
    this.detail = init?.detail;
  }
};

const { AuthManager } = require('../../js/auth.js');

test('AuthManager: seeds default demo user on initialization', () => {
  mockSession[AuthManager.STORAGE_KEYS.REGISTERED_USERS] = undefined;
  mockSession[AuthManager.STORAGE_KEYS.ACTIVE_USER] = undefined;

  const users = AuthManager.getRegisteredUsers();
  assert.ok(users.length >= 1);
  assert.strictEqual(users[0].email, 'demo@cibus.in');
  assert.strictEqual(users[0].name, 'Aarav Sharma');
});

test('AuthManager.register: adds new user to session registry', () => {
  const result = AuthManager.register({
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@example.com',
    password: 'Password@123'
  });

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.user.name, 'Priya Patel');

  // Verify stored in session
  const users = AuthManager.getRegisteredUsers();
  const found = users.find((u) => u.email === 'priya.patel@example.com');
  assert.ok(found);
});

test('AuthManager.register: rejects duplicate email', () => {
  const duplicate = AuthManager.register({
    firstName: 'Duplicate',
    lastName: 'User',
    email: 'priya.patel@example.com',
    password: 'Password@123'
  });

  assert.strictEqual(duplicate.success, false);
  assert.match(duplicate.message, /already exists/i);
});

test('AuthManager.login: authenticates registered user and marks active', () => {
  const loginRes = AuthManager.login('priya.patel@example.com', 'Password@123');
  assert.strictEqual(loginRes.success, true);
  assert.strictEqual(AuthManager.isAuthenticated(), true);

  const active = AuthManager.getCurrentUser();
  assert.strictEqual(active.email, 'priya.patel@example.com');
  assert.strictEqual(active.firstName, 'Priya');
});

test('AuthManager.login: rejects incorrect password', () => {
  const failRes = AuthManager.login('priya.patel@example.com', 'WrongPass!');
  assert.strictEqual(failRes.success, false);
  assert.match(failRes.message, /incorrect password/i);
});

test('AuthManager.resetPassword: updates user password in session', () => {
  const resetRes = AuthManager.resetPassword('priya.patel@example.com', 'NewPassword@2026');
  assert.strictEqual(resetRes.success, true);

  // Sign in with new password
  const newLogin = AuthManager.login('priya.patel@example.com', 'NewPassword@2026');
  assert.strictEqual(newLogin.success, true);
});

test('AuthManager.logout: terminates active session and clears cart and notifications', () => {
  let cartCleared = false;
  let notifsCleared = false;
  global.CartEngine = {
    clearCart: () => {
      cartCleared = true;
    }
  };
  global.NotificationCenter = {
    clearAll: (silent) => {
      notifsCleared = true;
    }
  };

  AuthManager.login('priya.patel@example.com', 'NewPassword@2026');
  assert.strictEqual(AuthManager.isAuthenticated(), true);

  AuthManager.logout();
  assert.strictEqual(AuthManager.isAuthenticated(), false);
  assert.strictEqual(AuthManager.getCurrentUser(), null);
  assert.strictEqual(cartCleared, true);
  assert.strictEqual(notifsCleared, true);

  delete global.CartEngine;
  delete global.NotificationCenter;
});

