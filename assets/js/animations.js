/* ==========================================================================
   CODE & DESIGNS - LUXURY MOTION DESIGN & GSAP/FRAMER ANIMATION ENGINE
   Scroll-triggered entrance fades, staggered kinetic typography, 
   smooth counters, sticky header transitions, and 60fps micro-interactions.
   ========================================================================== */

export function initScrollAnimations() {
  // 1. Sticky Header Controller with Smooth Transition
  const header = document.querySelector('.tp-header-area');
  if (header) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      if (lastScrollY > 40) {
        header.classList.add('sticky-active');
      } else {
        header.classList.remove('sticky-active');
      }
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
          window.requestAnimationFrame(updateHeader);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateHeader();
  }

  // 2. High-Performance Animated PureCounter Numbers
  const counters = document.querySelectorAll('.purecounter');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target') || el.textContent, 10);
            if (isNaN(target)) return;

            const duration = 1800; // ms
            const startTime = performance.now();

            const animateCounter = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // easeOutExpo for ultra-luxury deceleration
              const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              const currentVal = Math.round(target * easeProgress);

              el.textContent = currentVal;

              if (progress < 1) {
                requestAnimationFrame(animateCounter);
              } else {
                el.textContent = target;
              }
            };

            requestAnimationFrame(animateCounter);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  // 3. Hover-Reveal Recent Projects Floating Preview
  const awardItems = document.querySelectorAll('.tp-award-item');
  const previewBox = document.querySelector('.hover-reveal-preview');
  const previewImg = previewBox ? previewBox.querySelector('img') : null;

  if (awardItems.length && previewBox && previewImg) {
    let previewX = 0;
    let previewY = 0;
    let targetX = 0;
    let targetY = 0;
    let isHovering = false;

    window.addEventListener(
      'mousemove',
      (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
      },
      { passive: true }
    );

    function renderPreviewFollow() {
      if (isHovering) {
        previewX += (targetX - previewX) * 0.14;
        previewY += (targetY - previewY) * 0.14;
        previewBox.style.left = `${previewX}px`;
        previewBox.style.top = `${previewY}px`;
      }
      requestAnimationFrame(renderPreviewFollow);
    }
    requestAnimationFrame(renderPreviewFollow);

    awardItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        const imgSrc = item.getAttribute('data-preview-img');
        if (imgSrc) {
          previewImg.src = imgSrc;
          previewBox.classList.add('active');
          isHovering = true;
        }
      });

      item.addEventListener('mouseleave', () => {
        previewBox.classList.remove('active');
        isHovering = false;
      });
    });
  }

  // 4. GSAP/Framer-Grade Scroll-Triggered Entrance Animations
  // Automatically discovers headings, paragraphs, buttons, cards, and sections across all pages
  const animSelectors = [
    '.tp-hero-title-box',
    '.tp-hero-title',
    '.tp-section-title',
    '.tp-section-subtitle',
    '.tp-section-title-wrapper',
    '.tp-section-description',
    'h1:not(.tp-hero-title)',
    'h2',
    'h3',
    'h4',
    '.ar-hero-col-left p',
    '.tp-about-content p',
    '.tp-service-desc',
    '.tp-service-item',
    '.tp-project-item',
    '.tp-award-item',
    '.pricing-card',
    '.feature-box',
    '.tp-hero-more-info',
    '.tp-btn-gold',
    '.card-action-btn-white',
    '.tp-btn-navy',
    '.tp_fade_anim',
    '.fade-up-init'
  ];

  const targetElements = document.querySelectorAll(animSelectors.join(', '));

  if (targetElements.length) {
    // Group elements by parent container to calculate staggered delays
    const parentMap = new Map();

    targetElements.forEach((el) => {
      // Don't override already custom animated elements
      if (!el.classList.contains('lux-fade-up') && !el.classList.contains('fade-up-init') && !el.classList.contains('tp_fade_anim')) {
        el.classList.add('lux-fade-up');
      }

      const parent = el.parentElement;
      if (!parentMap.has(parent)) {
        parentMap.set(parent, []);
      }
      parentMap.get(parent).push(el);
    });

    // Apply sequential stagger delay to siblings
    parentMap.forEach((children) => {
      children.forEach((child, index) => {
        const staggerDelay = Math.min(index * 0.08, 0.4);
        child.style.transitionDelay = `${staggerDelay}s`;
      });
    });

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    };

    const entranceObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('lux-active', 'fade-up-active', 'lux-in-view');
          observer.unobserve(el);
        }
      });
    }, observerOptions);

    targetElements.forEach((el) => {
      // Check if element is already in initial viewport on page load
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Immediate smooth entrance for above-the-fold content
        requestAnimationFrame(() => {
          el.classList.add('lux-active', 'fade-up-active', 'lux-in-view');
        });
      } else {
        entranceObserver.observe(el);
      }
    });
  }
}
