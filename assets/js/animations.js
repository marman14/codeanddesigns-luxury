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

      const yOffset = options.y !== undefined ? options.y : 30;
      const duration = options.duration || 0.8;
      const delay = options.delay || 0;
      const ease = options.ease || 'power3.out';
      const rect = el.getBoundingClientRect();
      const isAboveFold = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

      if (isAboveFold) {
        gsap.fromTo(
          el,
          { opacity: 0, y: yOffset },
          {
            opacity: 1,
            y: 0,
            duration: duration,
            delay: delay,
            ease: ease,
            clearProps: 'all'
          }
        );
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, y: yOffset },
          {
            opacity: 1,
            y: 0,
            duration: duration,
            delay: delay,
            ease: ease,
            clearProps: 'all',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true
            }
          }
        );
      }
    };

    // Helper: Staggered grid entrance
    const animateGrid = (gridEl, childSelector, options = {}) => {
      if (!gridEl || processedElements.has(gridEl)) return;
      markProcessed(gridEl);

      const children = Array.from(gridEl.querySelectorAll(childSelector)).filter(
        (child) => !processedElements.has(child)
      );
      if (!children.length) return;

      children.forEach((c) => markProcessed(c));

      const yOffset = options.y !== undefined ? options.y : 35;
      const duration = options.duration || 0.8;
      const stagger = options.stagger !== undefined ? options.stagger : 0.09;
      const ease = options.ease || 'power3.out';
      const rect = gridEl.getBoundingClientRect();
      const isAboveFold = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

      if (isAboveFold) {
        gsap.fromTo(
          children,
          { opacity: 0, y: yOffset },
          {
            opacity: 1,
            y: 0,
            duration: duration,
            stagger: stagger,
            ease: ease,
            clearProps: 'all'
          }
        );
      } else {
        gsap.fromTo(
          children,
          { opacity: 0, y: yOffset },
          {
            opacity: 1,
            y: 0,
            duration: duration,
            stagger: stagger,
            ease: ease,
            clearProps: 'all',
            scrollTrigger: {
              trigger: gridEl,
              start: 'top 85%',
              once: true
            }
          }
        );
      }
    };

    // A. Hero Master Entrance Timeline (Homepage & Top Hero Area)
    const heroTitle = document.querySelector('.tp-hero-title');
    const heroBadge = document.querySelector('.tp-hero-badge');
    const heroDesc = document.querySelector('.ar-hero-col-left p');
    const heroButtons = document.querySelector('.ar-hero-col-left .tp-btn-gold')?.parentElement || document.querySelector('.tp-hero-buttons');
    const heroFounderCard = document.querySelector('.ar-hero-floating-card');

    if (heroTitle || heroDesc || heroFounderCard) {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (heroBadge) {
        markProcessed(heroBadge);
        heroTl.fromTo(heroBadge, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7, clearProps: 'all' }, 0.05);
      }
      if (heroTitle) {
        markProcessed(heroTitle);
        heroTl.fromTo(heroTitle, { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out', clearProps: 'all' }, 0.1);
      }
      if (heroDesc) {
        markProcessed(heroDesc);
        heroTl.fromTo(heroDesc, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8, clearProps: 'all' }, '-=0.5');
      }
      if (heroButtons) {
        markProcessed(heroButtons);
        heroTl.fromTo(heroButtons, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.75, clearProps: 'all' }, '-=0.5');
      }
      if (heroFounderCard) {
        markProcessed(heroFounderCard);
        heroTl.fromTo(heroFounderCard, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.85, clearProps: 'all' }, '-=0.6');
      }
    }

    // B. Staggered Grids: Service Grids, Testimonials Grids, Team Grids, Pricing Grids
    document.querySelectorAll('.tp-service-grid').forEach((grid) => {
      animateGrid(grid, '.tp-service-item', { y: 40, duration: 0.8, stagger: 0.1 });
    });

    document.querySelectorAll('.tp-testimonial-grid-8, .tp-testimonial-grid').forEach((grid) => {
      animateGrid(grid, '.tp-testimonial-card', { y: 35, duration: 0.8, stagger: 0.1 });
    });

    document.querySelectorAll('.pricing-grid').forEach((grid) => {
      animateGrid(grid, '.pricing-card', { y: 40, duration: 0.8, stagger: 0.12 });
    });

    document.querySelectorAll('.tp-about-grid').forEach((grid) => {
      animateGrid(grid, '.tp-about-img-wrap, .tp-about-desc-box', { y: 35, duration: 0.85, stagger: 0.15 });
    });

    // C. Section Subtitles, Titles, and Large Headings
    const sectionHeadings = document.querySelectorAll(
      '.tp-section-subtitle, .tp-section-title-large, .tp-section-title, .tp-section-title-wrapper'
    );
    sectionHeadings.forEach((heading) => {
      animateEntrance(heading, { y: 28, duration: 0.8 });
    });

    // D. Individual Standalone Cards & Sections
    const standaloneCards = document.querySelectorAll(
      '.tp-service-item, .tp-testimonial-card, .tp-featured-case-section, .tp-case-study-hero, .case-study-card, .tp-project-item, .tp-award-item, .call-back-inner, .tp-form-box, .tp-contact-info-wrap'
    );
    standaloneCards.forEach((card) => {
      animateEntrance(card, { y: 35, duration: 0.8 });
    });

    // E. PureCounter Numbers Animation with ScrollTrigger
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
    }, 2500);

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
