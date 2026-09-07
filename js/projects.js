/* ============================================================
   projects.js — project data & card rendering
   ============================================================
   To add a project: append an object to the `projects` array.
   Images are stored at:  assets/images/projects/<folder>/
   Use placeholder paths until you add real images.
   ============================================================ */

const projects = [
  {
    id: 'project-01',
    title: 'Neon Drift',
    category: 'GAME DEVELOPMENT',
    year: '2024',
    shortDescription:
      'A synthwave-inspired racing game built in Unreal Engine 5, featuring procedurally generated track segments, real-time neon lighting, and a custom vehicle physics system.',
    description:
      'Neon Drift is a high-speed arcade racing game set in a retro-futuristic city. The game uses Unreal Engine 5\'s Lumen global illumination to render neon-saturated environments in real time. Track segments are generated procedurally at runtime, ensuring infinite replay value. A custom vehicle physics controller was written from scratch in C++ to achieve the tight, responsive handling the game requires.',
    technologies: ['Unreal Engine 5', 'C++', 'Lumen GI', 'Nanite', 'Blueprints', 'HLSL'],
    contribution:
      'I designed and implemented the procedural track generation system, wrote the vehicle physics controller, and authored all real-time shaders including the bloom, chromatic aberration, and neon glow effects.',
    images: [
      { src: 'assets/images/projects/project-01/01.jpg', alt: 'Neon Drift — in-game racing view, neon city at night' },
      { src: 'assets/images/projects/project-01/02.jpg', alt: 'Neon Drift — vehicle close-up with glow shader' },
      { src: 'assets/images/projects/project-01/03.jpg', alt: 'Neon Drift — overhead track view showing procedural geometry' },
    ],
    github: 'https://github.com/yourusername/neon-drift',
    demo: '',
  },
  {
    id: 'project-02',
    title: 'Spectra',
    category: 'MIXED REALITY',
    year: '2023',
    shortDescription:
      'An augmented reality art installation for HoloLens 2 that overlays generative particle systems onto real-world surfaces, reacting to ambient sound in real time.',
    description:
      'Spectra transforms any physical space into a living canvas. Using HoloLens 2\'s spatial mapping, the installation detects real-world geometry and anchors dynamic particle simulations to surfaces. A microphone pipeline feeds real-time FFT audio data into a custom compute shader that drives particle behavior — louder, lower frequencies produce slower, heavier flows; high-pitched transients create explosive bursts.',
    technologies: ['Unity', 'C#', 'HoloLens 2', 'MRTK3', 'Compute Shaders', 'HLSL', 'Spatial Audio'],
    contribution:
      'I built the spatial anchoring system, wrote the GPU particle compute shaders, and implemented the audio-reactive FFT pipeline that drives visual behaviour.',
    images: [
      { src: 'assets/images/projects/project-02/01.jpg', alt: 'Spectra — particle system overlaid on gallery wall' },
      { src: 'assets/images/projects/project-02/02.jpg', alt: 'Spectra — close-up of audio-reactive particle burst' },
      { src: 'assets/images/projects/project-02/03.jpg', alt: 'Spectra — visitor interacting with the installation' },
    ],
    github: 'https://github.com/yourusername/spectra',
    demo: 'https://vimeo.com/yourvideo',
  },
  {
    id: 'project-03',
    title: 'Void Engine',
    category: 'COMPUTER GRAPHICS',
    year: '2023',
    shortDescription:
      'A from-scratch real-time renderer written in C++ using OpenGL, featuring physically based rendering, HDR, deferred shading, and real-time shadow mapping.',
    description:
      'Void Engine is a learning-driven real-time 3D renderer written entirely from scratch in C++ with OpenGL 4.6. The project implements a full deferred rendering pipeline, physically based materials with IBL (image-based lighting), cascaded shadow maps, SSAO, HDR tonemapping, and a basic scene graph. It was built to develop a deep understanding of the full graphics pipeline from vertex processing to final image output.',
    technologies: ['C++', 'OpenGL 4.6', 'GLSL', 'PBR / IBL', 'Shadow Mapping', 'SSAO', 'HDR'],
    contribution:
      'Solo project — I designed the full architecture, implemented every rendering technique, and wrote all GLSL shaders.',
    images: [
      { src: 'assets/images/projects/project-03/01.jpg', alt: 'Void Engine — PBR material demo scene' },
      { src: 'assets/images/projects/project-03/02.jpg', alt: 'Void Engine — shadow mapping render' },
      { src: 'assets/images/projects/project-03/03.jpg', alt: 'Void Engine — SSAO and HDR comparison' },
    ],
    github: 'https://github.com/yourusername/void-engine',
    demo: '',
  },
];

/* ── Render all cards ── */
function renderProjects() {
  const list = document.getElementById('projects-list');
  if (!list) return;

  projects.forEach((project) => {
    const card = createCard(project);
    list.appendChild(card);
  });
}

/* ── Build one card ── */
function createCard(project) {
  const article = document.createElement('article');
  article.className = 'project-card';
  article.setAttribute('role', 'listitem');
  article.id = project.id;

  /* ── Top bar ── */
  const top = document.createElement('div');
  top.className = 'project-card-top';

  const info = document.createElement('div');
  info.innerHTML = `
    <div class="project-meta">
      <span class="project-cat mono">${escHtml(project.category)}</span>
      <span class="project-year mono">${escHtml(project.year)}</span>
    </div>
    <h3 class="project-title">${escHtml(project.title)}</h3>
  `;

  const actions = document.createElement('div');
  actions.className = 'project-actions';
  if (project.github) {
    actions.appendChild(makeLink(project.github, 'GITHUB ↗', false));
  }
  if (project.demo) {
    actions.appendChild(makeLink(project.demo, 'DEMO ↗', true));
  }

  top.appendChild(info);
  top.appendChild(actions);

  /* ── Short description ── */
  const desc = document.createElement('p');
  desc.className = 'project-desc';
  desc.textContent = project.shortDescription;

  /* ── Gallery ── */
  const gallerySection = createGallery(project);

  /* ── Tech tags ── */
  const foot = document.createElement('div');
  foot.className = 'project-card-foot';
  project.technologies.forEach((t) => {
    const tag = document.createElement('span');
    tag.className = 'tech-tag';
    tag.textContent = t;
    foot.appendChild(tag);
  });

  article.appendChild(top);
  article.appendChild(desc);
  article.appendChild(gallerySection);
  article.appendChild(foot);

  return article;
}

/* ── Gallery with drag + touch scrolling ── */
function createGallery(project) {
  const wrap = document.createElement('div');
  wrap.className = 'gallery-wrap';

  const outer = document.createElement('div');
  outer.className = 'gallery-track-outer';
  outer.setAttribute('aria-label', `Image gallery for ${project.title}`);

  const track = document.createElement('div');
  track.className = 'gallery-track';

  project.images.forEach((img, idx) => {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'gallery-img-wrap';
    imgWrap.setAttribute('role', 'button');
    imgWrap.setAttribute('tabindex', '0');
    imgWrap.setAttribute('aria-label', `Open image ${idx + 1}: ${img.alt}`);

    const el = document.createElement('img');
    el.src = img.src;
    el.alt = img.alt;
    el.loading = 'lazy';
    el.onerror = function () {
      this.parentNode.innerHTML = `<div class="gallery-img-placeholder">${escHtml(img.alt)}</div>`;
    };

    imgWrap.appendChild(el);
    imgWrap.addEventListener('click', () => openModal(project, idx));
    imgWrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(project, idx); }
    });

    track.appendChild(imgWrap);
  });

  outer.appendChild(track);
  setupDrag(outer, track);
  setupTouchScroll(outer, track);

  /* Prev / Next buttons */
  const btnPrev = document.createElement('button');
  btnPrev.className = 'gallery-btn gallery-btn-prev';
  btnPrev.setAttribute('aria-label', 'Scroll gallery left');
  btnPrev.innerHTML = '&#8592;';

  const btnNext = document.createElement('button');
  btnNext.className = 'gallery-btn gallery-btn-next';
  btnNext.setAttribute('aria-label', 'Scroll gallery right');
  btnNext.innerHTML = '&#8594;';

  const imgW = () => track.children[0]?.offsetWidth + 16 || 300;
  btnPrev.addEventListener('click', () => { outer.scrollLeft -= imgW(); });
  btnNext.addEventListener('click', () => { outer.scrollLeft += imgW(); });

  wrap.appendChild(outer);
  wrap.appendChild(btnPrev);
  wrap.appendChild(btnNext);

  return wrap;
}

/* Mouse-drag scroll */
function setupDrag(outer, _track) {
  let isDown = false, startX = 0, scrollLeft = 0;

  outer.addEventListener('mousedown', (e) => {
    isDown = true;
    outer.style.cursor = 'grabbing';
    startX = e.pageX - outer.offsetLeft;
    scrollLeft = outer.scrollLeft;
  });
  outer.addEventListener('mouseleave', () => { isDown = false; outer.style.cursor = 'grab'; });
  outer.addEventListener('mouseup',    () => { isDown = false; outer.style.cursor = 'grab'; });
  outer.addEventListener('mousemove',  (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - outer.offsetLeft;
    outer.scrollLeft = scrollLeft - (x - startX);
  });
}

/* Touch scroll (native, just enable smooth) */
function setupTouchScroll(outer, _track) {
  outer.style.overflowX = 'auto';
  outer.style.scrollSnapType = 'x mandatory';
  outer.style.scrollBehavior = 'smooth';
  outer.style.webkitOverflowScrolling = 'touch';
  if (outer.firstChild && outer.firstChild.children) {
    Array.from(outer.firstChild.children).forEach((c) => {
      c.style.scrollSnapAlign = 'start';
    });
  }
}

/* ── Modal ── */
function openModal(project, imageIdx) {
  const modal   = document.getElementById('modal');
  const img     = document.getElementById('modal-img');
  const eyebrow = document.getElementById('modal-eyebrow');
  const title   = document.getElementById('modal-title');
  const desc    = document.getElementById('modal-desc');
  const tags    = document.getElementById('modal-tags');
  const contrib = document.getElementById('modal-contrib');
  const links   = document.getElementById('modal-links');

  const chosen = project.images[imageIdx] || project.images[0];

  img.src = chosen.src;
  img.alt = chosen.alt;
  img.onerror = function () { this.style.display = 'none'; };

  eyebrow.textContent = `${project.category} · ${project.year}`;
  title.textContent   = project.title;
  desc.textContent    = project.description;

  tags.innerHTML = '';
  project.technologies.forEach((t) => {
    const tag = document.createElement('span');
    tag.className = 'tech-tag';
    tag.textContent = t;
    tags.appendChild(tag);
  });

  contrib.textContent = project.contribution;

  links.innerHTML = '';
  if (project.github) links.appendChild(makeLink(project.github, 'GITHUB ↗', false, 'modal-link'));
  if (project.demo)   links.appendChild(makeLink(project.demo,   'DEMO ↗',   true,  'modal-link primary'));

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* Close on backdrop click */
document.getElementById('modal-bg')?.addEventListener('click', closeModal);

/* Close on Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('modal')?.classList.contains('is-open')) {
    closeModal();
  }
});

document.getElementById('modal-close')?.addEventListener('click', closeModal);

/* ── Helpers ── */
function makeLink(href, label, isPrimary, extraClass = '') {
  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.className = `project-link-btn${isPrimary ? ' primary' : ''} ${extraClass}`.trim();
  a.textContent = label;
  return a;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', renderProjects);
