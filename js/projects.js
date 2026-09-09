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
    title: 'MR Environment for Olfactive and Thermal Device',
    category: 'Mixed Reality development',
    year: 'May 2026 - Aug 2026',
    shortDescription:
      'A Mixed Reality experience for Meta Quest 3 that bridges virtual object interaction with real-world olfactory and thermal feedback.',
    description:
      'A Mixed Reality experience developed in Unity 6 for Meta Quest 3, designed as the interactive environment for an olfactive and thermal feedback device. The application allows users to interact naturally with virtual objects through hand tracking and poke interactions, with the environment designed to trigger corresponding physical sensations such as smells and temperature changes.The project features a dynamic object selection and spawning system, world-space UI, distance-based interaction, adaptive UI positioning, multilingual support using Unity Localization, and XR interaction systems built with the Meta XR SDK and OpenXR. The software architecture was designed to communicate with external sensory hardware, creating a bridge between virtual interactions and physical sensory feedback.',
    technologies: ['Unity', 'C#', 'Meta Building Blocks', 'Quest 3'],
    contribution:
      'Developed the Unity-based MR environment with interactive object spawning, hand/poke interactions, adaptive UI, and multilingual support. Designed the application architecture to support integration with the olfactive and thermal feedback device for immersive multisensory experiences.',
    images: [
      { src: 'public/assets/project 01/first test.png', alt: 'First Test of the mixed reality environment' },
      { src: 'public/assets/project 01/result.jpg', alt: 'Final Result of the MR environment' },
      { src: 'public/assets/project 01/testing.jpeg', alt: 'Testing the MR environment' },
    ],
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

    const isVideo = img.src.match(/\.(mp4|webm|ogg)$/i);
    let el;
    if (isVideo) {
      el = document.createElement('video');
      el.src = img.src;
      el.muted = true;
      el.loop = true;
      el.autoplay = true;
      el.playsInline = true;
    } else {
      el = document.createElement('img');
      el.src = img.src;
      el.alt = img.alt;
      el.loading = 'lazy';
      el.onerror = function () {
        this.parentNode.innerHTML = `<div class="gallery-img-placeholder">${escHtml(img.alt)}</div>`;
      };
    }

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
let currentProject = null;
let currentImageIdx = 0;

function updateModalMedia(project, imageIdx) {
  currentProject = project;
  currentImageIdx = imageIdx;

  const img = document.getElementById('modal-img');
  const vid = document.getElementById('modal-vid');
  const chosen = project.images[imageIdx] || project.images[0];

  const isVideo = chosen.src.match(/\.(mp4|webm|ogg)$/i);
  if (isVideo) {
    if (img) img.style.display = 'none';
    if (img) img.src = '';
    if (vid) {
      vid.style.display = 'block';
      vid.src = chosen.src;
    }
  } else {
    if (vid) {
      vid.style.display = 'none';
      vid.src = '';
      vid.pause();
    }
    if (img) {
      img.style.display = 'block';
      img.src = chosen.src;
      img.alt = chosen.alt;
      img.onerror = function () { this.style.display = 'none'; };
    }
  }

  const prevBtn = document.getElementById('modal-prev');
  const nextBtn = document.getElementById('modal-next');
  if (prevBtn) prevBtn.style.display = imageIdx > 0 ? 'flex' : 'none';
  if (nextBtn) nextBtn.style.display = imageIdx < project.images.length - 1 ? 'flex' : 'none';
}

function openModal(project, imageIdx) {
  const modal   = document.getElementById('modal');
  const eyebrow = document.getElementById('modal-eyebrow');
  const title   = document.getElementById('modal-title');
  const desc    = document.getElementById('modal-desc');
  const tags    = document.getElementById('modal-tags');
  const contrib = document.getElementById('modal-contrib');
  const links   = document.getElementById('modal-links');

  updateModalMedia(project, imageIdx);

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
  document.getElementById('modal-vid')?.pause();
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

document.getElementById('modal-prev')?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (currentProject && currentImageIdx > 0) {
    updateModalMedia(currentProject, currentImageIdx - 1);
  }
});

document.getElementById('modal-next')?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (currentProject && currentImageIdx < currentProject.images.length - 1) {
    updateModalMedia(currentProject, currentImageIdx + 1);
  }
});

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
