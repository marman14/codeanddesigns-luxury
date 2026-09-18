/* ==========================================================================
   CODE & DESIGNS - LUXURY MOTION DESIGN & GSAP / SCROLLTRIGGER ANIMATION ENGINE
   Fluid 60fps scroll-triggered entrance animations, kinetic typography reveals,
   smooth counters, and hardware-accelerated transitions.
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

  // 2. High-End GSAP & ScrollTrigger Animations Engine
  const hasGSAP = typeof gsap !== 'undefined';
  const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';

  if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Strict element deduplication tracker — guarantees NO DOM element is ever animated twice
    const processedElements = new WeakSet();

    const markProcessed = (el) => {
      if (!el) return;
      processedElements.add(el);
      el.setAttribute('data-lux-animated', 'true');
    };

    // Helper: Safe fromTo entrance animation with automatic above-fold vs scroll detection
    const animateEntrance = (el, options = {}) => {
      if (!el || processedElements.has(el)) return;
      markProcessed(el);

      const yOffset = options.y !== undefined ? options.y : 22;
      const xOffset = options.x !== undefined ? options.x : 0;
      const duration = options.duration || 0.55;
      const delay = options.delay || 0;
      const ease = options.ease || 'power3.out';
      const rect = el.getBoundingClientRect();
      const isAboveFold = rect.top < window.innerHeight * 0.94 && rect.bottom > 0;

      const fromVars = { opacity: 0, y: yOffset };
      if (xOffset) fromVars.x = xOffset;
      if (options.scale) fromVars.scale = options.scale;

      const toVars = {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: duration,
        delay: delay,
        ease: ease,
        clearProps: 'all',
        onComplete: () => {
          el.classList.add('lux-live-active');
        }
      };

      if (isAboveFold) {
        gsap.fromTo(el, fromVars, toVars);
      } else {
        toVars.scrollTrigger = {
          trigger: el,
          start: options.start || 'top 92%',
          once: true
        };
        gsap.fromTo(el, fromVars, toVars);
      }
    };

    // Helper: Staggered grid/container entrance
    const animateGrid = (gridEl, childSelector, options = {}) => {
      if (!gridEl || processedElements.has(gridEl)) return;
      markProcessed(gridEl);

      const children = Array.from(gridEl.querySelectorAll(childSelector)).filter(
        (child) => !processedElements.has(child)
      );
      if (!children.length) return;

      children.forEach((c) => markProcessed(c));

      const yOffset = options.y !== undefined ? options.y : 24;
      const duration = options.duration || 0.6;
      const stagger = options.stagger !== undefined ? options.stagger : 0.07;
      const ease = options.ease || 'power3.out';
      const rect = gridEl.getBoundingClientRect();
      const isAboveFold = rect.top < window.innerHeight * 0.94 && rect.bottom > 0;

      const fromVars = { opacity: 0, y: yOffset };
      if (options.scale) fromVars.scale = options.scale;

      const toVars = {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: duration,
        stagger: stagger,
        ease: ease,
        clearProps: 'all',
        onComplete: () => {
          children.forEach((c) => c.classList.add('lux-live-active'));
        }
      };

      if (isAboveFold) {
        gsap.fromTo(children, fromVars, toVars);
      } else {
        toVars.scrollTrigger = {
          trigger: gridEl,
          start: options.start || 'top 90%',
          once: true
        };
        gsap.fromTo(children, fromVars, toVars);
      }
    };

    // Helper: Media / Image reveal with subtle scale
    const animateMedia = (mediaEl, options = {}) => {
      if (!mediaEl || processedElements.has(mediaEl)) return;
      // Skip header logo, offcanvas logo, and footer watermark
      if (mediaEl.closest('.tp-header-logo, .tp-footer-watermark, .tp-offcanvas-area')) return;
      markProcessed(mediaEl);

      const yOffset = options.y !== undefined ? options.y : 18;
      const duration = options.duration || 0.6;
      const delay = options.delay || 0;
      const ease = options.ease || 'power3.out';
      const rect = mediaEl.getBoundingClientRect();
      const isAboveFold = rect.top < window.innerHeight * 0.94 && rect.bottom > 0;

      const fromVars = { opacity: 0, y: yOffset, scale: 0.97 };
      const toVars = {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: duration,
        delay: delay,
        ease: ease,
        clearProps: 'all'
      };

      if (isAboveFold) {
        gsap.fromTo(mediaEl, fromVars, toVars);
      } else {
        toVars.scrollTrigger = {
          trigger: mediaEl,
          start: 'top 92%',
          once: true
        };
        gsap.fromTo(mediaEl, fromVars, toVars);
      }
    };

    // =========================================================================
    // A. HERO MASTER ENTRANCE (HOMEPAGE & ALL SUBPAGE HEROES)
    // =========================================================================
    const heroAreas = document.querySelectorAll('.tp-hero-area, .tp-case-study-hero');
    heroAreas.forEach((hero) => {
      const heroTitle = hero.querySelector('.tp-hero-title, h1');
      const heroBadge = hero.querySelector('.tp-hero-badge, .tp-section-subtitle');
      const heroDesc = hero.querySelector('.ar-hero-col-left p, p');
      const heroButtons = hero.querySelector('.tp-hero-buttons, .tp-btn-gold')?.parentElement || hero.querySelector('.tp-btn-gold');
      const heroFounderCard = hero.querySelector('.ar-hero-floating-card, .tp-hero-more-info');

      const heroTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          if (heroBadge) heroBadge.classList.add('lux-live-active');
          if (heroTitle) heroTitle.classList.add('lux-live-active');
          if (heroDesc) heroDesc.classList.add('lux-live-active');
        }
      });

      if (heroBadge && !processedElements.has(heroBadge)) {
        markProcessed(heroBadge);
        heroTl.fromTo(heroBadge, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.5, clearProps: 'all' }, 0.02);
      }
      if (heroTitle && !processedElements.has(heroTitle)) {
        markProcessed(heroTitle);
        heroTl.fromTo(heroTitle, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power4.out', clearProps: 'all' }, 0.08);
      }
      if (heroDesc && !processedElements.has(heroDesc)) {
        markProcessed(heroDesc);
        heroTl.fromTo(heroDesc, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, clearProps: 'all' }, '-=0.4');
      }
      if (heroButtons && !processedElements.has(heroButtons)) {
        markProcessed(heroButtons);
        heroTl.fromTo(heroButtons, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, clearProps: 'all' }, '-=0.4');
      }
      if (heroFounderCard && !processedElements.has(heroFounderCard)) {
        markProcessed(heroFounderCard);
        heroTl.fromTo(heroFounderCard, { opacity: 0, y: 22, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, clearProps: 'all' }, '-=0.45');
      }
    });

    // =========================================================================
    // B. MULTI-CARD GRIDS & LAYOUT CONTAINERS (CASCADE STAGGER)
    // =========================================================================
    // 1. Service Grids
    document.querySelectorAll('.tp-service-grid').forEach((grid) => {
      animateGrid(grid, '.tp-service-item, .tp-service-card', { y: 40, duration: 0.85, stagger: 0.1 });
    });

    // 2. Testimonial Grids & Review Lists
    document.querySelectorAll('.tp-testimonial-grid-8, .tp-testimonial-grid').forEach((grid) => {
      animateGrid(grid, '.tp-testimonial-card', { y: 35, duration: 0.85, stagger: 0.1 });
    });

    // 3. Pricing Grids
    document.querySelectorAll('.pricing-grid').forEach((grid) => {
      animateGrid(grid, '.pricing-card', { y: 40, duration: 0.85, stagger: 0.12 });
    });

    // 4. Onboarding & Process Grids
    document.querySelectorAll('.tp-onboarding-grid').forEach((grid) => {
      animateGrid(grid, '.tp-onboarding-card', { y: 35, duration: 0.85, stagger: 0.1 });
    });

    // 5. About Grids
    document.querySelectorAll('.tp-about-grid').forEach((grid) => {
      animateGrid(grid, '.tp-about-img-wrap, .tp-about-desc-box, .tp-about-card', { y: 35, duration: 0.85, stagger: 0.12 });
    });

    // 6. Generic Grid Containers (Catching Team grids, pillar cards, capability columns, gallery photos)
    document.querySelectorAll('div[style*="grid-template-columns"], .tp-counter-grid, .tp-funfact-row').forEach((grid) => {
      // Don't double-animate already handled grids
      if (grid.closest('.tp-footer-area, .tp-offcanvas-area')) return;
      animateGrid(grid, ':scope > div', { y: 35, duration: 0.85, stagger: 0.1 });
    });

    // 7. Bullet Checkmark Lists
    document.querySelectorAll('.card-bullet-list').forEach((list) => {
      animateGrid(list, 'li', { y: 16, duration: 0.65, stagger: 0.06 });
    });

    // =========================================================================
    // C. ALL HEADINGS & SUBTITLES ACROSS EVERY PAGE & SECTION
    // =========================================================================
    const allHeadings = document.querySelectorAll(
      'section h1, section h2, section h3, section h4, article h1, article h2, article h3, article h4, main h1, main h2, main h3, main h4, .tp-section-subtitle, .tp-section-title-large, .tp-section-title, .tp-section-title-wrapper'
    );
    allHeadings.forEach((heading) => {
      if (heading.closest('.tp-header-area, .tp-footer-area, .tp-offcanvas-area')) return;
      // Skip if heading is inside a card that was already animated
      if (heading.closest('.tp-service-item, .tp-testimonial-card, .tp-pillar-card, .tp-onboarding-card, .pricing-card, .case-study-card, .tp-project-item, .tp-award-item, .ar-hero-floating-card')) return;
      animateEntrance(heading, { y: 28, duration: 0.85 });
    });

    // =========================================================================
    // D. ALL PARAGRAPHS & DESCRIPTIONS (NO STATIC TEXT)
    // =========================================================================
    const allParagraphs = document.querySelectorAll(
      'section p, article p, main p, .tp-form-box p, .tp-contact-info-wrap p'
    );
    allParagraphs.forEach((p) => {
      if (p.closest('.tp-header-area, .tp-footer-area, .tp-offcanvas-area')) return;
      // Skip if inside an already-animated card component to avoid double displacement
      if (p.closest('.tp-service-item, .tp-testimonial-card, .tp-pillar-card, .tp-onboarding-card, .pricing-card, .case-study-card, .tp-project-item, .tp-award-item, .ar-hero-floating-card, .contact-card-badge')) return;
      animateEntrance(p, { y: 20, duration: 0.8 });
    });

    // =========================================================================
    // E. ALL STANDALONE CARDS, BOXES, ACCORDIONS, AND FORMS
    // =========================================================================
    const standaloneBoxes = document.querySelectorAll(
      '.tp-service-item, .tp-pillar-card, .tp-testimonial-card, .tp-onboarding-card, .pricing-card, .case-study-card, .tp-project-item, .tp-award-item, .tp-featured-case-section, .call-back-inner, .tp-form-box, .tp-contact-info-wrap, .tp-contact-info-card, .appointment-wrapper, .tp-funfact-item, .tp-faq-item, .product-card'
    );
    standaloneBoxes.forEach((box) => {
      if (box.closest('.tp-footer-area, .tp-offcanvas-area')) return;
      animateEntrance(box, { y: 35, duration: 0.85 });
    });

    // =========================================================================
    // F. ALL IMAGES & MEDIA ACROSS SECTIONS
    // =========================================================================
    const allImages = document.querySelectorAll(
      'section img, article img, main img, .tp-about-img-wrap img, .tp-testimonial-card img, .tp-hero-avater img'
    );
    allImages.forEach((img) => {
      if (img.closest('.tp-header-logo, .tp-footer-area, .tp-offcanvas-area')) return;
      animateMedia(img, { y: 22, duration: 0.85 });
    });

    const allVideos = document.querySelectorAll('section video, section iframe:not(.calendly-inline-widget)');
    allVideos.forEach((vid) => {
      animateEntrance(vid, { y: 30, duration: 0.85 });
    });

    // =========================================================================
    // G. ALL BUTTONS & CTAS
    // =========================================================================
    const allButtons = document.querySelectorAll(
      'section .tp-btn-gold, main .tp-btn-gold, .ar-cta-btn, .tp-btn-white, .btn-luxury, section button[type="submit"]'
    );
    allButtons.forEach((btn) => {
      if (btn.closest('.tp-header-area, .tp-footer-area, .tp-offcanvas-area')) return;
      animateEntrance(btn, { y: 16, duration: 0.75, ease: 'power2.out' });
    });

    // =========================================================================
    // H. NUMBERS & PURECOUNTERS
    // =========================================================================
    const counters = document.querySelectorAll('.purecounter');
    counters.forEach((counter) => {
      if (processedElements.has(counter)) return;
      markProcessed(counter);

      const rawVal = counter.getAttribute('data-target') || counter.textContent.replace(/\D/g, '');
      const target = parseInt(rawVal, 10);
      if (isNaN(target)) return;

      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 90%',
          once: true
        },
        onUpdate: () => {
          counter.textContent = Math.round(obj.val);
        }
      });
    });

    // Refresh ScrollTrigger positions once DOM is stable
    ScrollTrigger.refresh();
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });

    // Safety Fallback: Guarantee no element remains stuck at opacity 0 under any circumstance
    setTimeout(() => {
      document.querySelectorAll('[data-lux-animated]').forEach((el) => {
        if (window.getComputedStyle(el).opacity === '0') {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    }, 2200);

  } else {
    // Non-GSAP Fallback: High-performance IntersectionObserver
    const fallbackElements = document.querySelectorAll(
      '.tp-service-item, .tp-testimonial-card, .tp-section-title, .tp-section-title-large, .tp-hero-more-info, .purecounter'
    );
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('lux-active', 'fade-up-active');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    fallbackElements.forEach((el) => {
      el.classList.add('lux-fade-up');
      observer.observe(el);
    });
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

  // 3b. Interactive 3D Card Hover Tilts & Dynamic Physics
  const interactiveCards = document.querySelectorAll(
    '.tp-service-item, .tp-testimonial-card, .tp-pillar-card, .pricing-card, .ar-solo-portrait-card, .case-study-card, .tp-onboarding-card, .tp-process-card, .tp-contact-info-card, .call-back-inner, .tp-form-box'
  );
  interactiveCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4.5;
      const rotateY = ((x - centerX) / centerX) * 4.5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 4. Smooth Anchor Scrolling for all navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}
