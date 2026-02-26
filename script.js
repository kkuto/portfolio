// ─── CONFIG ───────────────────────────────────────────────────────────────────
const JSON_URL = './projets.json';

// ─── STATE ────────────────────────────────────────────────────────────────────
let allProjects = [];
let activeFilter = 'Tout';

// ─── FETCH PROJECTS ───────────────────────────────────────────────────────────
async function loadProjects() {
  try {
    const res = await fetch(JSON_URL);
    if (!res.ok) throw new Error('Erreur réseau');
    allProjects = await res.json();
    buildFilters();
    renderProjects(allProjects);
  } catch (err) {
    document.getElementById('projects-grid').innerHTML = `
      <p class="col-span-full text-center text-red-400 font-mono text-sm">
        ⚠ Impossible de charger les projets : ${err.message}
      </p>`;
  }
}

// ─── BUILD FILTER BUTTONS ─────────────────────────────────────────────────────
function buildFilters() {
  const categories = ['Tout', ...new Set(allProjects.map(p => p.categorie))];
  const container = document.getElementById('filters');
  container.innerHTML = '';

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.dataset.filter = cat;
    btn.className = `filter-btn px-5 py-2 text-sm font-semibold tracking-widest uppercase border transition-all duration-300 ${
      cat === activeFilter
        ? 'bg-red-600 border-red-600 text-white'
        : 'bg-transparent border-neutral-700 text-neutral-400 hover:border-red-500 hover:text-red-400'
    }`;
    btn.addEventListener('click', () => applyFilter(cat));
    container.appendChild(btn);
  });
}

// ─── FILTER LOGIC ─────────────────────────────────────────────────────────────
function applyFilter(cat) {
  activeFilter = cat;

  // Update button styles
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isActive = btn.dataset.filter === cat;
    btn.className = `filter-btn px-5 py-2 text-sm font-semibold tracking-widest uppercase border transition-all duration-300 ${
      isActive
        ? 'bg-red-600 border-red-600 text-white'
        : 'bg-transparent border-neutral-700 text-neutral-400 hover:border-red-500 hover:text-red-400'
    }`;
  });

  const filtered = cat === 'Tout' ? allProjects : allProjects.filter(p => p.categorie === cat);
  renderProjects(filtered);
}

// ─── RENDER CARDS ─────────────────────────────────────────────────────────────
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');

  // Fade out
  grid.style.opacity = '0';
  grid.style.transform = 'translateY(12px)';

  setTimeout(() => {
    if (projects.length === 0) {
      grid.innerHTML = `<p class="col-span-full text-center text-neutral-500 font-mono text-sm py-16">Aucun projet dans cette catégorie.</p>`;
    } else {
      grid.innerHTML = projects.map((p, i) => cardHTML(p, i)).join('');
    }

    // Fade in
    grid.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    grid.style.opacity = '1';
    grid.style.transform = 'translateY(0)';
  }, 200);
}

// ─── CARD TEMPLATE ────────────────────────────────────────────────────────────
function cardHTML(project, index) {
  return `
    <article class="project-card group relative overflow-hidden border border-neutral-800 bg-neutral-950 transition-all duration-500 hover:border-red-600 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]"
             style="animation-delay: ${index * 80}ms">
      <!-- Image -->
      <div class="relative overflow-hidden h-52">
        <img
          src="${escapeHTML(project.image_url)}"
          alt="${escapeHTML(project.titre)}"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent"></div>
        <!-- Category badge -->
        <span class="absolute top-4 left-4 px-3 py-1 text-xs font-bold tracking-widest uppercase bg-red-600/90 text-white">
          ${escapeHTML(project.categorie)}
        </span>
      </div>

      <!-- Content -->
      <div class="p-6">
        <h3 class="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-red-400 transition-colors duration-300">
          ${escapeHTML(project.titre)}
        </h3>
        <p class="text-neutral-400 text-sm leading-relaxed mb-6">
          ${escapeHTML(project.description)}
        </p>
        <a href="${escapeHTML(project.lien_demo)}"
           target="_blank"
           rel="noopener noreferrer"
           class="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-red-500 border border-red-500/30 px-4 py-2 transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:text-white">
          Voir le projet
          <svg class="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>
    </article>`;
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── SMOOTH SCROLL NAV ────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ─── NAVBAR SCROLL EFFECT ─────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) {
    nav.classList.add('backdrop-blur-xl', 'bg-black/80', 'border-b', 'border-neutral-800');
  } else {
    nav.classList.remove('backdrop-blur-xl', 'bg-black/80', 'border-b', 'border-neutral-800');
  }
});

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = 'Message envoyé ✓';
  btn.classList.add('bg-green-700', 'border-green-700');
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Envoyer le message';
    btn.classList.remove('bg-green-700', 'border-green-700');
    btn.disabled = false;
    this.reset();
  }, 3000);
});

// ─── MOBILE MENU ──────────────────────────────────────────────────────────────
document.getElementById('menu-toggle')?.addEventListener('click', () => {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
});

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadProjects);
