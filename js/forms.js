/**
 * CIBUS FORM HANDLERS
 * Handles contact, registration, and login interfaces with honest state boundaries
 */

const FormHandlers = {
  initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const messageInput = document.getElementById('contact-message');
    const counter = document.getElementById('message-char-counter');

    if (messageInput && counter) {
      messageInput.addEventListener('input', () => {
        const remaining = 1000 - messageInput.value.length;
        counter.textContent = `${messageInput.value.length} / 1000 characters`;
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageField = document.getElementById('contact-message');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        FormValidator.showError(nameInput, 'Please provide your full name.');
        isValid = false;
      } else {
        FormValidator.clearError(nameInput);
      }

      // Validate Email
      if (!FormValidator.isValidEmail(emailInput.value)) {
        FormValidator.showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        FormValidator.clearError(emailInput);
      }

      // Validate Message
      if (!messageField.value.trim() || messageField.value.trim().length < 10) {
        FormValidator.showError(messageField, 'Message must be at least 10 characters long.');
        isValid = false;
      } else {
        FormValidator.clearError(messageField);
      }

      if (!isValid) return;

      // Honest client demonstration submission
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending Message...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message &rarr;';
        form.reset();
        if (counter) counter.textContent = '0 / 1000 characters';
        Utils.showToast('Thank you! Your message has been logged in this demonstration session.', 'success', 5000);
      }, 750);
    });
  },

  initRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstName = document.getElementById('first-name');
      const lastName = document.getElementById('last-name');
      const email = document.getElementById('register-email');
      const p1 = document.getElementById('register-password');
      const p2 = document.getElementById('confirm-password');

      let isValid = true;

      if (!firstName.value.trim()) {
        FormValidator.showError(firstName, 'First name is required.');
        isValid = false;
      } else {
        FormValidator.clearError(firstName);
      }

      if (!lastName.value.trim()) {
        FormValidator.showError(lastName, 'Last name is required.');
        isValid = false;
      } else {
        FormValidator.clearError(lastName);
      }

      if (!FormValidator.isValidEmail(email.value)) {
        FormValidator.showError(email, 'Please enter a valid email address.');
        isValid = false;
      } else {
        FormValidator.clearError(email);
      }

      const passCheck = FormValidator.validatePassword(p1.value);
      if (!passCheck.isValid) {
        FormValidator.showError(p1, passCheck.message);
        isValid = false;
      } else {
        FormValidator.clearError(p1);
      }

      if (p1.value !== p2.value) {
        FormValidator.showError(p2, 'Passwords do not match.');
        isValid = false;
      } else {
        FormValidator.clearError(p2);
      }

      if (!isValid) return;

      // Honest registration simulation
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Creating Demo Account...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Create Free Account &rarr;';
        StorageManager.set('cibus_demo_user', {
          name: `${firstName.value.trim()} ${lastName.value.trim()}`,
          email: email.value.trim(),
          registeredAt: new Date().toISOString()
        });

        Utils.showToast('Account simulated successfully! Redirecting to Home...', 'success', 3000);
        setTimeout(() => {
          window.location.href = './home.html';
        }, 1500);
      }, 800);
    });
  },

  initLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('login-username');
      const password = document.getElementById('login-password');

      let isValid = true;

      if (!username.value.trim()) {
        FormValidator.showError(username, 'Please enter your username or email.');
        isValid = false;
      } else {
        FormValidator.clearError(username);
      }

      if (!password.value) {
        FormValidator.showError(password, 'Password is required.');
        isValid = false;
      } else {
        FormValidator.clearError(password);
      }

      if (!isValid) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Signing In...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Sign In to Cibus &rarr;';
        StorageManager.set('cibus_demo_user', {
          name: username.value.trim(),
          email: username.value.trim(),
          loggedInAt: new Date().toISOString()
        });

        Utils.showToast('Sign-in successful (Demo Mode)! Redirecting...', 'success', 3000);
        setTimeout(() => {
          window.location.href = './home.html';
        }, 1200);
      }, 700);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  FormHandlers.initContactForm();
  FormHandlers.initRegisterForm();
  FormHandlers.initLoginForm();
});
