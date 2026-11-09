/**
 * CIBUS FORM HANDLERS
 * Accessible validation and dynamic authentication integration (Register, Login, Forgot Password, Contact)
 */

const FormHandlers = {
  /**
   * Helper to get URL query parameter (e.g., ?redirect=...)
   */
  getRedirectUrl() {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect && !redirect.startsWith('http')) {
      return redirect;
    }
    return './home.html';
  },

  /**
   * Contact Form Handler
   */
  initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const messageInput = document.getElementById('contact-message');
    const counter = document.getElementById('message-char-counter');

    if (messageInput && counter) {
      messageInput.addEventListener('input', () => {
        counter.textContent = `${messageInput.value.length} / 1000 characters`;
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageField = document.getElementById('contact-message');

      let isValid = true;

      if (!nameInput.value.trim()) {
        FormValidator.showError(nameInput, 'Please provide your full name.');
        isValid = false;
      } else {
        FormValidator.clearError(nameInput);
      }

      if (!FormValidator.isValidEmail(emailInput.value)) {
        FormValidator.showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        FormValidator.clearError(emailInput);
      }

      if (!messageField.value.trim() || messageField.value.trim().length < 10) {
        FormValidator.showError(messageField, 'Message must be at least 10 characters long.');
        isValid = false;
      } else {
        FormValidator.clearError(messageField);
      }

      if (!isValid) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending Message...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message &rarr;';
        form.reset();
        if (counter) counter.textContent = '0 / 1000 characters';
        Utils.showToast('Thank you! Your message has been logged in this demonstration session.', 'success', 5000);
      }, 600);
    });
  },

  /**
   * Registration Form Handler
   * Creates dynamic accounts in AuthManager session storage
   */
  initRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    const firstName = document.getElementById('first-name');
    const lastName = document.getElementById('last-name');
    const email = document.getElementById('register-email');
    const p1 = document.getElementById('register-password');
    const p2 = document.getElementById('confirm-password');

    // Real-time inline validation triggers
    if (email) {
      email.addEventListener('blur', () => {
        if (email.value.trim() && !FormValidator.isValidEmail(email.value)) {
          FormValidator.showError(email, 'Please enter a valid email address (e.g. name@domain.com).');
        } else {
          FormValidator.clearError(email);
        }
      });
    }

    if (p1) {
      p1.addEventListener('input', () => {
        if (p1.value) {
          const check = FormValidator.validatePassword(p1.value);
          if (!check.isValid) {
            FormValidator.showError(p1, check.message);
          } else {
            FormValidator.clearError(p1);
          }
        }
      });
    }

    if (p2) {
      p2.addEventListener('input', () => {
        if (p2.value && p1.value !== p2.value) {
          FormValidator.showError(p2, 'Passwords do not match.');
        } else {
          FormValidator.clearError(p2);
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate First Name
      if (!firstName || !firstName.value.trim() || firstName.value.trim().length < 2) {
        FormValidator.showError(firstName, 'First name is required (minimum 2 characters).');
        isValid = false;
      } else {
        FormValidator.clearError(firstName);
      }

      // Validate Last Name
      if (!lastName || !lastName.value.trim()) {
        FormValidator.showError(lastName, 'Last name is required.');
        isValid = false;
      } else {
        FormValidator.clearError(lastName);
      }

      // Validate Email
      if (!email || !FormValidator.isValidEmail(email.value)) {
        FormValidator.showError(email, 'Please enter a valid email address.');
        isValid = false;
      } else {
        FormValidator.clearError(email);
      }

      // Validate Password
      const passCheck = FormValidator.validatePassword(p1.value);
      if (!passCheck.isValid) {
        FormValidator.showError(p1, passCheck.message);
        isValid = false;
      } else {
        FormValidator.clearError(p1);
      }

      // Validate Password Match
      if (p1.value !== p2.value) {
        FormValidator.showError(p2, 'Passwords do not match.');
        isValid = false;
      } else {
        FormValidator.clearError(p2);
      }

      if (!isValid) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Creating Account...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Create Account &rarr;';

        const fullName = `${firstName.value.trim()} ${lastName.value.trim()}`;
        const res = AuthManager.register({
          name: fullName,
          email: email.value.trim(),
          password: p1.value
        });

        if (!res.success) {
          FormValidator.showError(email, res.message);
          Utils.showToast(res.message, 'error');
          return;
        }

        Utils.showToast(`Account created! Welcome to Cibus, ${fullName}.`, 'success', 4000);
        setTimeout(() => {
          window.location.href = FormHandlers.getRedirectUrl();
        }, 1200);
      }, 500);
    });
  },

  /**
   * Login & Forgot Password Form Handler
   */
  initLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    // Check if redirected from cart or another page
    const redirectUrl = this.getRedirectUrl();
    if (window.location.search.includes('redirect')) {
      const banner = document.getElementById('login-redirect-notice');
      if (banner) {
        banner.style.display = 'block';
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const usernameInput = document.getElementById('login-username');
      const passwordInput = document.getElementById('login-password');

      let isValid = true;

      if (!usernameInput || !usernameInput.value.trim()) {
        FormValidator.showError(usernameInput, 'Please enter your registered email address.');
        isValid = false;
      } else {
        FormValidator.clearError(usernameInput);
      }

      if (!passwordInput || !passwordInput.value) {
        FormValidator.showError(passwordInput, 'Password is required.');
        isValid = false;
      } else {
        FormValidator.clearError(passwordInput);
      }

      if (!isValid) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Verifying Credentials...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Sign In to Cibus &rarr;';

        const res = AuthManager.login(usernameInput.value.trim(), passwordInput.value);

        if (!res.success) {
          FormValidator.showError(passwordInput, res.message);
          Utils.showToast(res.message, 'error', 5000);
          return;
        }

        Utils.showToast(res.message, 'success', 3000);
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
      }, 400);
    });

    // Forgot Password Toggle & Form Handler
    this.setupForgotPassword();
  },

  /**
   * Setup interactive Forgot / Reset Password workflow
   */
  setupForgotPassword() {
    const toggleBtn = document.getElementById('forgot-password-toggle');
    const resetCard = document.getElementById('forgot-password-card');
    const resetForm = document.getElementById('forgot-password-form');
    const cancelBtn = document.getElementById('cancel-reset-btn');

    if (!toggleBtn || !resetCard || !resetForm) return;

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetCard.style.display = resetCard.style.display === 'none' ? 'block' : 'none';
      if (resetCard.style.display === 'block') {
        const resetEmail = document.getElementById('reset-email');
        const loginUser = document.getElementById('login-username');
        if (resetEmail && loginUser && loginUser.value.trim()) {
          resetEmail.value = loginUser.value.trim();
        }
        resetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        resetCard.style.display = 'none';
      });
    }

    resetForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('reset-email');
      const newPassInput = document.getElementById('reset-new-password');
      const confirmPassInput = document.getElementById('reset-confirm-password');

      let isValid = true;

      if (!emailInput || !FormValidator.isValidEmail(emailInput.value)) {
        FormValidator.showError(emailInput, 'Please provide a valid email address.');
        isValid = false;
      } else {
        FormValidator.clearError(emailInput);
      }

      const passCheck = FormValidator.validatePassword(newPassInput.value);
      if (!passCheck.isValid) {
        FormValidator.showError(newPassInput, passCheck.message);
        isValid = false;
      } else {
        FormValidator.clearError(newPassInput);
      }

      if (newPassInput.value !== confirmPassInput.value) {
        FormValidator.showError(confirmPassInput, 'Passwords do not match.');
        isValid = false;
      } else {
        FormValidator.clearError(confirmPassInput);
      }

      if (!isValid) return;

      const submitBtn = resetForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Updating Password...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Save New Password &rarr;';

        const res = AuthManager.resetPassword(emailInput.value.trim(), newPassInput.value);

        if (!res.success) {
          FormValidator.showError(emailInput, res.message);
          Utils.showToast(res.message, 'error');
          return;
        }

        Utils.showToast(res.message, 'success', 5000);
        resetCard.style.display = 'none';
        resetForm.reset();

        // Pre-fill login input
        const loginUser = document.getElementById('login-username');
        const loginPass = document.getElementById('login-password');
        if (loginUser) loginUser.value = emailInput.value.trim();
        if (loginPass) {
          loginPass.value = '';
          loginPass.focus();
        }
      }, 500);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  FormHandlers.initContactForm();
  FormHandlers.initRegisterForm();
  FormHandlers.initLoginForm();
});
