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

    // A. Hero Section Master Entrance Timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (document.querySelector('.tp-hero-badge')) {
      heroTl.from('.tp-hero-badge', { y: -20, opacity: 0, duration: 0.7, delay: 0.1 });
    }

    if (document.querySelector('.tp-hero-title')) {
      heroTl.from('.tp-hero-title', { y: 40, opacity: 0, duration: 0.95, ease: 'power4.out' }, '-=0.4');
    }

    if (document.querySelector('.ar-hero-col-left p')) {
      heroTl.from('.ar-hero-col-left p', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5');
    }

    if (document.querySelector('.tp-hero-buttons')) {
      heroTl.from('.tp-hero-buttons', { y: 25, opacity: 0, duration: 0.8 }, '-=0.5');
    }

    if (document.querySelector('.ar-canvas-wrapper')) {
      heroTl.from('.ar-canvas-wrapper', { scale: 0.88, opacity: 0, duration: 1.1, ease: 'power2.out' }, '-=0.8');
    }

    if (document.querySelector('.ar-hero-floating-card')) {
      heroTl.from('.ar-hero-floating-card', { y: 35, opacity: 0, duration: 0.9 }, '-=0.7');
    }

    // B. Global Section Header ScrollTriggers
    const sectionHeaders = document.querySelectorAll('.tp-section-subtitle, .tp-section-title, .tp-section-title-large, .tp-section-title-wrapper');
    sectionHeaders.forEach((headerEl) => {
      gsap.from(headerEl, {
        scrollTrigger: {
          trigger: headerEl,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 35,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out'
      });
    });

    // C. Service Cards Staggered Reveal
    const serviceItems = document.querySelectorAll('.tp-service-item');
    serviceItems.forEach((item, idx) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 45,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      });
    });

    // D. Testimonials Grid Staggered Reveal
    const testimonialGrids = document.querySelectorAll('.tp-testimonial-grid-8, .tp-testimonial-grid');
    testimonialGrids.forEach((grid) => {
      const cards = grid.querySelectorAll('.tp-testimonial-card');
      if (cards.length) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: grid,
            start: 'top 82%',
            toggleActions: 'play none none none'
          },
          y: 40,
          opacity: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out'
        });
      }
    });

    // E. Team Cards Reveal (About Us Page)
    const teamCards = document.querySelectorAll('.tp-about-section .tp-testimonial-card, .tp-about-grid');
    if (teamCards.length) {
      gsap.from(teamCards, {
        scrollTrigger: {
          trigger: teamCards[0],
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }

    // F. Featured Spotlight Case Studies
    const caseCards = document.querySelectorAll('.tp-featured-case-section, .tp-case-study-hero, .case-study-card');
    caseCards.forEach((c) => {
      gsap.from(c, {
        scrollTrigger: {
          trigger: c,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out'
      });
    });

    // G. PureCounter Animation with GSAP ScrollTrigger
    const counters = document.querySelectorAll('.purecounter');
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target') || counter.textContent, 10);
      if (isNaN(target)) return;

      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        onUpdate: () => {
          counter.textContent = Math.round(obj.val);
        }
      });
    });

  } else {
    // High-performance IntersectionObserver Fallback
    const fallbackElements = document.querySelectorAll('.tp-service-item, .tp-testimonial-card, .tp-section-title, .tp-section-title-large, .tp-hero-more-info, .purecounter');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('lux-active', 'fade-up-active');
          if (entry.target.classList.contains('purecounter')) {
            const target = parseInt(entry.target.getAttribute('data-target') || entry.target.textContent, 10);
            if (!isNaN(target)) {
              let cur = 0;
              const step = Math.ceil(target / 40);
              const timer = setInterval(() => {
                cur += step;
                if (cur >= target) {
                  entry.target.textContent = target;
                  clearInterval(timer);
                } else {
                  entry.target.textContent = cur;
                }
              }, 30);
            }
          }
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

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
