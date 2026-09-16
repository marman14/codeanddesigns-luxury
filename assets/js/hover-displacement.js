/* ==========================================================================
   WEBGL IMAGE DISPLACEMENT / DISTORTION HOVER EFFECT
   Replicates codeanddesigns.com data-displacement project card transitions
   ========================================================================== */

export function initProjectHoverDisplacement() {
  const projectItems = document.querySelectorAll('.tp-project-item');
  if (!projectItems.length) return;

  projectItems.forEach((item) => {
    const thumb = item.querySelector('.tp-project-thumb');
    const img = thumb ? thumb.querySelector('img') : null;
    if (!thumb || !img) return;

    // Interactive 3D tilt & dynamic scale on hover
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      thumb.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    item.addEventListener('mouseleave', () => {
      thumb.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      thumb.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    item.addEventListener('mouseenter', () => {
      thumb.style.transition = 'none';
    });
  });
}
