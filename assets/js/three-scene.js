/* ==========================================================================
   THREE.JS 3D WEBGL HERO CANVAS (LUXURY METALLIC GOLD & NAVY THEME)
   High-performance 60fps Interactive morphing 3D geometric mesh & particle field
   tuned for soft light backgrounds with rich metallic gold reflections.
   ========================================================================== */

export function initHeroThreeScene() {
  const canvas = document.getElementById('hero-webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const parent = canvas.parentElement;
  if (!parent) return;

  let width = parent.clientWidth || 480;
  let height = parent.clientHeight || 380;

  // Scene setup
  const scene = new THREE.Scene();

  // Camera setup
  const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
  camera.position.z = 5.6;

  // Renderer setup with 60fps optimizations
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting tuned for light theme
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambientLight);

  // Warm metallic gold point light
  const pointLightGold = new THREE.PointLight(0xbe8c33, 2.8, 30);
  pointLightGold.position.set(4, 5, 4);
  scene.add(pointLightGold);

  // Deep navy rim light for sculptural contrast
  const pointLightNavy = new THREE.PointLight(0x011b39, 2.2, 30);
  pointLightNavy.position.set(-5, -4, 3);
  scene.add(pointLightNavy);

  // Group to rotate together
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // 1. High-end Sculptural Torus Knot
  const geomKnot = new THREE.TorusKnotGeometry(1.05, 0.25, 140, 24, 2, 3);
  
  // Custom luxury metallic gold physical material with ambient background transparency
  const matKnot = new THREE.MeshPhysicalMaterial({
    color: 0xbe8c33,
    emissive: 0x1a1002,
    roughness: 0.28,
    metalness: 0.85,
    clearcoat: 0.9,
    clearcoatRoughness: 0.12,
    wireframe: false,
    transparent: true,
    opacity: 0.88
  });
  const knotMesh = new THREE.Mesh(geomKnot, matKnot);
  mainGroup.add(knotMesh);

  // Wireframe accent overlay for architectural depth
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x011b39,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });
  const wireMesh = new THREE.Mesh(geomKnot, wireMat);
  wireMesh.scale.set(1.003, 1.003, 1.003);
  mainGroup.add(wireMesh);

  // Floating ambient particle dust
  const particleCount = 45;
  const particleGeom = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 8;
    positions[i + 1] = (Math.random() - 0.5) * 6;
    positions[i + 2] = (Math.random() - 0.5) * 6;
  }
  particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xbe8c33,
    size: 0.04,
    transparent: true,
    opacity: 0.5
  });
  const particles = new THREE.Points(particleGeom, particleMat);
  scene.add(particles);

  // Responsive 3D Positioning
  function updateGroupPosition() {
    mainGroup.position.set(0, 0, 0);
    const currentW = parent.clientWidth || 480;
    if (currentW >= 480) {
      mainGroup.scale.set(0.95, 0.95, 0.95);
    } else if (currentW >= 360) {
      mainGroup.scale.set(0.82, 0.82, 0.82);
    } else {
      mainGroup.scale.set(0.7, 0.7, 0.7);
    }
  }

  updateGroupPosition();

  // Mouse Interaction coordinates
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let isVisible = true;

  const handleMouseMove = (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  // Pause render loop when canvas is off-screen for 60fps buttery performance
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.05 });
  observer.observe(canvas);

  // Smooth 60fps Render Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Smooth inertia mouse tracking
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Organic continuous rotation + mouse reaction
    mainGroup.rotation.x = elapsedTime * 0.22 + targetY * 0.45;
    mainGroup.rotation.y = elapsedTime * 0.35 + targetX * 0.55;

    particles.rotation.y = elapsedTime * 0.05;

    // Dynamically orbit point light with mouse
    pointLightGold.position.x = Math.sin(elapsedTime * 0.7) * 4 + targetX * 2;
    pointLightGold.position.y = Math.cos(elapsedTime * 0.5) * 4 - targetY * 2;

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler with debounce for performance
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = parent.clientWidth || 480;
      height = parent.clientHeight || 380;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      updateGroupPosition();
    }, 100);
  }, { passive: true });
}
