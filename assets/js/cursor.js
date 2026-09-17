/* ==========================================================================
   MAGNETIC INTERACTIVE CUSTOM CURSOR
   Replicates codeanddesigns.com custom agency pointer experience
   ========================================================================== */

export function initCustomCursor() {
  // Disabled per user instruction: eliminate stray floating gold circles and pointer artifacts
  return;

  const cursorText = document.createElement('span');
  cursorText.className = 'custom-cursor-text';
  cursorText.textContent = 'View Demo';
  follower.appendChild(cursorText);

  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Smooth lerp loop for follower
  function renderFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover states for links and buttons
  const interactiveElements = document.querySelectorAll('a, button, .tp-btn-gold, .card-action-btn-white, .call-back-btn, .tp-award-item, input, textarea');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  // Project cards with "View Demo" label
  const projectCards = document.querySelectorAll('.tp-project-item, .not-hide-cursor');
  projectCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      const customText = card.getAttribute('data-cursor') || 'View Demo';
      cursorText.textContent = customText;
      document.body.classList.add('cursor-project-hover');
    });
    card.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-project-hover');
    });
  });
}
