const test = require('node:test');
const assert = require('node:assert');

const { FormValidator } = require('../../js/validation.js');

test('FormValidator.isValidEmail: accepts valid emails', () => {
  assert.strictEqual(FormValidator.isValidEmail('user@cibus.com'), true);
  assert.strictEqual(FormValidator.isValidEmail('greeshmanth.sai@domain.co.in'), true);
  assert.strictEqual(FormValidator.isValidEmail('test+culinary@sub.domain.org'), true);
});

test('FormValidator.isValidEmail: rejects invalid emails', () => {
  assert.strictEqual(FormValidator.isValidEmail(''), false);
  assert.strictEqual(FormValidator.isValidEmail('plainaddress'), false);
  assert.strictEqual(FormValidator.isValidEmail('@missingusername.com'), false);
  assert.strictEqual(FormValidator.isValidEmail('username@.com'), false);
  assert.strictEqual(FormValidator.isValidEmail('username@domain'), false);
});

test('FormValidator.validatePassword: checks length and complexity', () => {
  // Too short
  let res = FormValidator.validatePassword('Ab1');
  assert.strictEqual(res.isValid, false);
  assert.match(res.message, /at least 8 characters/);

  // Missing uppercase
  res = FormValidator.validatePassword('alllowercase123');
  assert.strictEqual(res.isValid, false);
  assert.match(res.message, /uppercase/);

  // Missing lowercase
  res = FormValidator.validatePassword('ALLUPPERCASE123');
  assert.strictEqual(res.isValid, false);
  assert.match(res.message, /lowercase/);

  // Missing number
  res = FormValidator.validatePassword('NoDigitsHereAtAll');
  assert.strictEqual(res.isValid, false);
  assert.match(res.message, /number/);

  // Valid password
  res = FormValidator.validatePassword('ValidPass123');
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.message, '');
});
