/* ==========================================================================
   CODE & DESIGNS - MAIN CONTROLLER
   Integrates all modules, menu toggles, tabs, interactive forms
   ========================================================================== */

import { initCustomCursor } from './cursor.js?v=13.0';
import { initProjectHoverDisplacement } from './hover-displacement.js?v=13.0';
import { initScrollAnimations } from './animations.js?v=13.0';

function initApp() {
  // 1. Initialize Core Interactive Systems
  initCustomCursor();
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
    if (e.key === 'Escape') {
      closeDrawer();
      document.querySelectorAll('.has-dropdown').forEach((d) => d.classList.remove('dropdown-open'));
    }
  });

  // 2b. Services Megamenu Click & Touch Toggle
  const dropdownItems = document.querySelectorAll('.has-dropdown');
  dropdownItems.forEach((dropdown) => {
    const trigger = dropdown.querySelector(':scope > a');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        // Allow hover on desktop, but allow click to toggle
        const isHoverSupported = window.matchMedia('(hover: hover)').matches;
        if (!isHoverSupported || window.innerWidth <= 1200) {
          e.preventDefault();
          dropdown.classList.toggle('dropdown-open');
        }
      });
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    dropdownItems.forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('dropdown-open');
      }
    });
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

  // 4. Interactive Contact Form with Validation & Feedback (#fluentform_7 & #fluentform_2)
  const contactForms = document.querySelectorAll('.contact-ajax-form, #fluentform_7');
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
          submitBtn.innerHTML = '✓ Project Details Received!';
          submitBtn.style.backgroundColor = 'var(--bg-btn-gold)';
          submitBtn.style.color = '#ffffff';
        }

        // Show feedback message
        const responseBox = document.createElement('div');
        responseBox.className = 'form-success-alert';
        responseBox.style.cssText = `
          margin-top: 18px;
          padding: 18px 24px;
          background: rgba(190, 140, 51, 0.12);
          border: 1px solid var(--accent-gold);
          border-radius: var(--radius-sm);
          color: var(--text-navy);
          font-size: 1.15rem;
          font-weight: 500;
          text-align: center;
        `;
        responseBox.textContent = 'Thank you! Arman and the AR Webcrafts senior engineering team have received your brief and will respond within 24–48 hours.';
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
        }, 7000);
      }, 900);
    });
  });

  // Newsletter Form Handler (#fluentform_2)
  const newsletterForms = document.querySelectorAll('#fluentform_2');
  newsletterForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Subscribe';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Subscribing...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = '✓ Subscribed!';
        }

        const alertBox = document.createElement('div');
        alertBox.style.cssText = `
          margin-top: 12px;
          font-size: 1rem;
          color: var(--accent-gold);
          font-weight: 500;
        `;
        alertBox.textContent = 'You are subscribed to AR Webcrafts engineering briefings.';
        form.appendChild(alertBox);

        form.reset();

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
          if (alertBox) alertBox.remove();
        }, 5000);
      }, 700);
    });
  });

  // 5. Highlight Current Active Page in Navigation
  const rawPath = window.location.pathname.replace(/^\/|\/$/g, '');
  const currentPath = rawPath.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.tp-nav-menu a, .tp-offcanvas-menu a, .tp-megamenu a');
  navLinks.forEach((link) => {
    const linkPath = (link.getAttribute('href') || '').replace(/^\/|\/$/g, '');
    if (
      linkPath === currentPath ||
      (currentPath === 'index.html' && (linkPath === '' || linkPath === './')) ||
      (currentPath && linkPath && linkPath.includes(currentPath))
    ) {
      const parentLi = link.closest('li');
      if (parentLi) parentLi.classList.add('active');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

