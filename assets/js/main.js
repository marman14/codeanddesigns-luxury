/* ==========================================================================
   CODE & DESIGNS - MAIN CONTROLLER
   Integrates all modules, menu toggles, tabs, interactive forms
   ========================================================================== */

import { initCustomCursor } from './cursor.js';
import { initHeroThreeScene } from './three-scene.js';
import { initProjectHoverDisplacement } from './hover-displacement.js';
import { initScrollAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Core Interactive Systems
  initCustomCursor();
  initHeroThreeScene();
  initProjectHoverDisplacement();
  initScrollAnimations();

  // 2. Off-canvas Mobile Menu Drawer
  const openBtn = document.querySelector('.tp-offcanvas-open-btn');
  const closeBtn = document.querySelector('.tp-offcanvas-close-btn');
  const drawer = document.querySelector('.tp-offcanvas-area');
  const overlay = document.querySelector('.body-overlay');

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.add('opened');
      overlay.classList.add('opened');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('opened');
      overlay.classList.remove('opened');
      document.body.style.overflow = '';
    }
  }

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // 3. Interactive Pricing Tabs (if present on page)
  const tabButtons = document.querySelectorAll('.pricing-tab-btn');
  const pricingCards = document.querySelectorAll('.pricing-card');

  if (tabButtons.length) {
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const billingCycle = btn.getAttribute('data-cycle'); // 'monthly' or 'onetime'

        pricingCards.forEach((card) => {
          const monthlyPrice = card.getAttribute('data-monthly');
          const onetimePrice = card.getAttribute('data-onetime');
          const priceEl = card.querySelector('.pricing-price .amount');
          const periodEl = card.querySelector('.pricing-price .period');

          if (priceEl && periodEl) {
            if (billingCycle === 'monthly' && monthlyPrice) {
              priceEl.textContent = monthlyPrice;
              periodEl.textContent = '/monthly';
            } else if (onetimePrice) {
              priceEl.textContent = onetimePrice;
              periodEl.textContent = '/one-time';
            }
          }
        });
      });
    });
  }

  // 4. Interactive Contact Form with Validation & Feedback
  const contactForms = document.querySelectorAll('.contact-ajax-form');
  contactForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Message...';
      }

      // Simulate network response
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = '✓ Message Sent Successfully!';
          submitBtn.style.backgroundColor = 'var(--bg-btn-gold)';
          submitBtn.style.color = '#ffffff';
        }

        // Show feedback message
        const responseBox = document.createElement('div');
        responseBox.className = 'form-success-alert';
        responseBox.style.cssText = `
          margin-top: 18px;
          padding: 16px 20px;
          background: rgba(190, 140, 51, 0.12);
          border: 1px solid var(--accent-gold);
          border-radius: var(--radius-sm);
          color: var(--text-navy);
          font-size: 1.15rem;
          font-weight: 500;
          text-align: center;
        `;
        responseBox.textContent = 'Thank you! We received your message and will respond within 24 hours.';
        form.appendChild(responseBox);

        form.reset();

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.style.color = '';
          }
          if (responseBox) responseBox.remove();
        }, 6000);
      }, 1000);
    });
  });

  // 5. Highlight Current Active Page in Navigation
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.tp-nav-menu a, .tp-offcanvas-menu a');
  navLinks.forEach((link) => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      const parentLi = link.closest('li');
      if (parentLi) parentLi.classList.add('active');
    }
  });
});
