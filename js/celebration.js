/**
 * CIBUS CELEBRATION & PARTICLE EFFECTS ENGINE
 * Lightweight 60fps canvas & DOM micro-animations for culinary actions
 * No external dependencies.
 */

const CelebrationFx = {
  /**
   * Radial particle sparkle burst originating from a click event or element
   * @param {number} x Screen X coordinate
   * @param {number} y Screen Y coordinate
   * @param {object} options
   */
  burst(x, y, options = {}) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const count = options.count || 28;
    const colors = options.colors || [
      '#FFB300', // Saffron gold
      '#E85A19', // Terracotta orange
      '#15803D', // Cardamom green
      '#DC2626', // Kashmiri chilli red
      '#F59E0B', // Turmeric amber
      '#FFFFFF'  // Rice pearl white
    ];

    const container = document.createElement('div');
    container.className = 'cibus-fx-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 99999;
      overflow: hidden;
    `;
    document.body.appendChild(container);

    const particles = [];
    const shapes = ['circle', 'square', 'star', 'spark'];

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.floor(Math.random() * 8) + 6;

      p.className = `cibus-fx-particle cibus-fx-${shape}`;
      p.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        left: ${x}px;
        top: ${y}px;
        border-radius: ${shape === 'circle' ? '50%' : shape === 'spark' ? '2px' : '3px'};
        opacity: 1;
        box-shadow: 0 0 ${size}px ${color};
        transform: translate(-50%, -50%) scale(1);
        will-change: transform, opacity;
      `;

      if (shape === 'star') {
        p.textContent = '✨';
        p.style.background = 'none';
        p.style.boxShadow = 'none';
        p.style.fontSize = `${size + 4}px`;
        p.style.lineHeight = '1';
      }

      container.appendChild(p);

      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const velocity = Math.random() * 140 + 70;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 35; // Slight upward bias
      const rot = Math.random() * 720 - 360;

      particles.push({ el: p, vx, vy, rot, size });
    }

    // Animate particles with spring physics
    const startTime = performance.now();
    const duration = 950;

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      particles.forEach((p) => {
        const currentX = p.vx * easeOut;
        const currentY = p.vy * easeOut + 0.5 * 180 * Math.pow(progress, 2); // gravity
        const currentRot = p.rot * progress;
        const scale = Math.max(1 - progress * 1.2, 0);
        const opacity = Math.max(1 - progress * 1.1, 0);

        p.el.style.transform = `translate(-50%, -50%) translate(${currentX}px, ${currentY}px) rotate(${currentRot}deg) scale(${scale})`;
        p.el.style.opacity = opacity;
      });

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }
    }

    requestAnimationFrame(frame);
  },

  /**
   * Burst celebration effect centered on a DOM button/card
   * @param {HTMLElement} element
   * @param {string} dishName
   */
  burstFromElement(element, dishName = '') {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    this.burst(centerX, centerY);
    this.floatPillToCart(centerX, centerY, dishName);
    this.bounceCartBadge();
  },

  /**
   * Spawns a floating celebratory badge "+1 🍲 [Dish Name]" that flies to the cart
   */
  floatPillToCart(startX, startY, dishName = '') {
    const cartBtn = document.querySelector('.cart-icon-btn') || document.querySelector('a[href*="cart"]');
    let targetX = window.innerWidth - 60;
    let targetY = 30;

    if (cartBtn) {
      const cr = cartBtn.getBoundingClientRect();
      targetX = cr.left + cr.width / 2;
      targetY = cr.top + cr.height / 2;
    }

    const pill = document.createElement('div');
    pill.className = 'cibus-fx-flight-pill';
    pill.innerHTML = `<span>+1</span> <span>🍲 ${Utils.escapeHtml(dishName || 'Added')}</span>`;
    pill.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      transform: translate(-50%, -50%) scale(0.6);
      background: linear-gradient(135deg, #E85A19 0%, #C74B16 100%);
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 800;
      box-shadow: 0 8px 24px rgba(232, 90, 25, 0.55), 0 0 12px rgba(255, 179, 71, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.4);
      pointer-events: none;
      z-index: 100000;
      opacity: 0;
      transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      display: inline-flex;
      align-items: center;
      gap: 6px;
    `;
    document.body.appendChild(pill);

    // Initial pop
    requestAnimationFrame(() => {
      pill.style.opacity = '1';
      pill.style.transform = 'translate(-50%, -50%) translateY(-24px) scale(1.08)';

      // Flight to cart
      setTimeout(() => {
        pill.style.transition = 'all 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
        pill.style.left = `${targetX}px`;
        pill.style.top = `${targetY}px`;
        pill.style.transform = 'translate(-50%, -50%) scale(0.2)';
        pill.style.opacity = '0.1';

        setTimeout(() => {
          if (pill.parentNode) {
            pill.parentNode.removeChild(pill);
          }
        }, 580);
      }, 350);
    });
  },

  /**
   * Bounces the navbar cart icon with a joyful pulse
   */
  bounceCartBadge() {
    const cartBtn = document.querySelector('.cart-icon-btn');
    if (cartBtn) {
      cartBtn.classList.remove('cart-bounce-active');
      // Trigger reflow
      void cartBtn.offsetWidth;
      cartBtn.classList.add('cart-bounce-active');
      setTimeout(() => cartBtn.classList.remove('cart-bounce-active'), 800);
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CelebrationFx };
}

