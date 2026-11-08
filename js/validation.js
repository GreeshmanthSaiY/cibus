/**
 * CIBUS FORM VALIDATION ENGINE
 * WCAG-compliant accessible real-time form validation
 */

const FormValidator = {
  /**
   * Validate standard email pattern
   * @param {string} email
   * @returns {boolean}
   */
  isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    // RFC 5322 compliant practical regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(email.trim());
  },

  /**
   * Validate password policy:
   * Minimum 8 characters, at least 1 uppercase letter, at least 1 lowercase letter, at least 1 number
   * @param {string} password
   * @returns {{isValid: boolean, message: string}}
   */
  validatePassword(password) {
    if (!password || typeof password !== 'string') {
      return { isValid: false, message: 'Password is required.' };
    }
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long.' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter.' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter.' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number.' };
    }
    return { isValid: true, message: '' };
  },

  /**
   * Show accessible error message on input field
   * @param {HTMLInputElement} input
   * @param {string} message
   */
  showError(input, message) {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');

    const errorId = `${input.id}-error`;
    let errorElem = document.getElementById(errorId);
    if (!errorElem) {
      errorElem = document.createElement('div');
      errorElem.id = errorId;
      errorElem.className = 'field-error visible';
      errorElem.setAttribute('role', 'alert');
      input.parentNode.appendChild(errorElem);
    }
    errorElem.textContent = message;
    errorElem.classList.add('visible');
    input.setAttribute('aria-describedby', errorId);
  },

  /**
   * Clear error state from input field
   * @param {HTMLInputElement} input
   */
  clearError(input) {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    const errorId = `${input.id}-error`;
    const errorElem = document.getElementById(errorId);
    if (errorElem) {
      errorElem.textContent = '';
      errorElem.classList.remove('visible');
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FormValidator };
}
