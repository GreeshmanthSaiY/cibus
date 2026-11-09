/**
 * CIBUS AUTHENTICATION & SESSION MANAGER
 * Manages dynamic client-side user accounts, password reset, login sessions,
 * and browser-session scoped persistence (persisting across page reloads/hard refreshes,
 * but securely clearing when the browser is completely closed).
 */

const AuthManager = {
  STORAGE_KEYS: {
    ACTIVE_USER: 'cibus_active_session_user',
    SESSION_USERS: 'cibus_registered_session_users'
  },

  // Default pre-seeded demo account available in every fresh session
  DEFAULT_USER: {
    name: 'Aarav Sharma',
    email: 'demo@cibus.in',
    password: 'Cibus@2026',
    registeredAt: '2026-01-01T00:00:00.000Z'
  },

  /**
   * Safe getter for sessionStorage with fallback
   */
  _getSessionItem(key) {
    try {
      const raw = window.sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  },

  /**
   * Safe setter for sessionStorage
   */
  _setSessionItem(key, value) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      return false;
    }
  },

  /**
   * Safe remover for sessionStorage
   */
  _removeSessionItem(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch (_) {}
  },

  /**
   * Retrieve all accounts created in this browser session
   */
  getRegisteredUsers() {
    const list = this._getSessionItem(this.STORAGE_KEYS.SESSION_USERS);
    if (Array.isArray(list)) {
      return list;
    }
    // Seed default account
    const initial = [this.DEFAULT_USER];
    this._setSessionItem(this.STORAGE_KEYS.SESSION_USERS, initial);
    return initial;
  },

  /**
   * Save updated list of registered users
   */
  _saveRegisteredUsers(users) {
    return this._setSessionItem(this.STORAGE_KEYS.SESSION_USERS, users);
  },

  /**
   * Check if a user is currently authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  /**
   * Get currently active session user
   * @returns {object|null}
   */
  getCurrentUser() {
    const u = this._getSessionItem(this.STORAGE_KEYS.ACTIVE_USER);
    if (u && !u.firstName && u.name) {
      u.firstName = u.name.split(' ')[0];
    }
    return u;
  },

  /**
   * Register a new dynamic user account
   * @param {object} param0 { name, firstName, lastName, email, password }
   */
  register({ name, firstName, lastName, email, password }) {
    const combined = name || `${firstName || ''} ${lastName || ''}`.trim();
    const cleanName = String(combined || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '');

    if (!cleanName || cleanName.length < 2) {
      return { success: false, message: 'Please provide a valid full name (minimum 2 characters).' };
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    const users = this.getRegisteredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return {
        success: false,
        message: 'An account with this email address already exists in this browser session. Please sign in.'
      };
    }

    const newUser = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    this._saveRegisteredUsers(users);

    // Auto-login upon successful registration
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      loggedInAt: new Date().toISOString()
    };
    this._setSessionItem(this.STORAGE_KEYS.ACTIVE_USER, sessionUser);

    this._dispatchAuthChange(sessionUser);

    return {
      success: true,
      user: sessionUser,
      message: `Welcome, ${cleanName}! Your account was created and is active for this browser session.`
    };
  },

  /**
   * Authenticate user with email and password
   * @param {string} email
   * @param {string} password
   */
  login(email, password) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '');

    if (!cleanEmail || !cleanPassword) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    const users = this.getRegisteredUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword);

    if (!user) {
      // Check if user exists with wrong password
      const userExists = users.some((u) => u.email.toLowerCase() === cleanEmail);
      if (userExists) {
        return {
          success: false,
          message: 'Incorrect password. Please try again or use the "Reset Password" option.'
        };
      }
      return {
        success: false,
        message: 'No account found with this email in this browser session. Please create an account.'
      };
    }

    const sessionUser = {
      id: user.id || 'usr_demo',
      name: user.name,
      email: user.email,
      loggedInAt: new Date().toISOString()
    };

    this._setSessionItem(this.STORAGE_KEYS.ACTIVE_USER, sessionUser);
    this._dispatchAuthChange(sessionUser);

    return {
      success: true,
      user: sessionUser,
      message: `Welcome back, ${user.name}!`
    };
  },

  /**
   * Reset password for an existing account
   * @param {string} email
   * @param {string} newPassword
   */
  resetPassword(email, newPassword) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(newPassword || '');

    if (!cleanEmail) {
      return { success: false, message: 'Please provide your registered email address.' };
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    const users = this.getRegisteredUsers();
    const index = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);

    if (index === -1) {
      return {
        success: false,
        message: 'We could not find an account with that email in this browser session.'
      };
    }

    users[index].password = cleanPassword;
    users[index].passwordUpdatedAt = new Date().toISOString();
    this._saveRegisteredUsers(users);

    // If currently logged in as this user, update active session
    const current = this.getCurrentUser();
    if (current && current.email.toLowerCase() === cleanEmail) {
      current.passwordUpdatedAt = new Date().toISOString();
      this._setSessionItem(this.STORAGE_KEYS.ACTIVE_USER, current);
    }

    return {
      success: true,
      message: `Password updated successfully for ${users[index].name}! You can now sign in with your new password.`
    };
  },

  /**
   * Sign out current user and clear session-bound cart and notification items
   */
  logout() {
    this._removeSessionItem(this.STORAGE_KEYS.ACTIVE_USER);

    // Securely clear shopping cart upon user sign out
    const cart = typeof CartEngine !== 'undefined' ? CartEngine : (typeof window !== 'undefined' ? window.CartEngine : null);
    if (cart && typeof cart.clearCart === 'function') {
      try {
        cart.clearCart();
      } catch (_) {}
    }

    // Securely clear notifications upon user sign out
    const notifs = typeof NotificationCenter !== 'undefined' ? NotificationCenter : (typeof window !== 'undefined' ? window.NotificationCenter : null);
    if (notifs && typeof notifs.clearAll === 'function') {
      try {
        notifs.clearAll(true);
      } catch (_) {}
    }

    this._dispatchAuthChange(null);
    return true;
  },

  /**
   * Broadcast auth state changes to window listeners
   */
  _dispatchAuthChange(user) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cibus:auth:changed', {
          detail: { user, isAuthenticated: !!user }
        })
      );
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuthManager };
}
