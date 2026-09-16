/* ==========================================================================
   CODE & DESIGNS - INTERACTIVE ANIMATIONS & SCROLL EFFECTS
   Counter increments, sticky header, hover reveal previews, scroll triggers
   ========================================================================== */

export function initScrollAnimations() {
  // 1. Sticky Header Controller
  const header = document.querySelector('.tp-header-area');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('sticky-active');
      } else {
        header.classList.remove('sticky-active');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Animated PureCounter Numbers
  const counters = document.querySelectorAll('.purecounter');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target') || el.textContent, 10);
            const duration = 1800; // ms
            const frameRate = 1000 / 60;
            const totalFrames = Math.round(duration / frameRate);
            let frame = 0;

            const counterTimer = setInterval(() => {
              frame++;
              const progress = frame / totalFrames;
              // easeOutQuart
              const currentCount = Math.round(target * (1 - Math.pow(1 - progress, 4)));
              el.textContent = currentCount;

              if (frame >= totalFrames) {
                el.textContent = target;
                clearInterval(counterTimer);
              }
            }, frameRate);

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

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function renderPreviewFollow() {
      if (isHovering) {
        previewX += (targetX - previewX) * 0.12;
        previewY += (targetY - previewY) * 0.12;
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

  // 4. Stagger Fade-Up Intersection Observer
  const fadeElements = document.querySelectorAll('.tp_fade_anim, .fade-up-init');
  if (fadeElements.length) {
    const fadeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-up-active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    fadeElements.forEach((el) => fadeObserver.observe(el));
  }
}
