// Config
const SITE = {
  name: 'Masterwash Laundromat',
  address: '11/60 Queenspark Drive, Parklands, Christchurch 8083',
  hours: 'Open 24 hours, 7 days',
  phone: '022 311 9700',
  email: 'hellomasterwash@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=61593936634754',
};

const PAGES = [
  ['index', 'Home'],
  ['services', 'Services'],
  ['how-it-works', 'How it works'],
  ['find-us', 'Find us'],
  ['about', 'About'],
  ['contact', 'Contact'],
];

const currentPage = (location.pathname.split('/').pop() || 'index').replace('.html', '') || 'index';

// Header
function renderHeader() {
  const links = PAGES.map(([page, title]) => {
    const active = page === currentPage ? ' class="active"' : '';
    return `<a href="${page}.html"${active}>${title}</a>`;
  }).join('');

  document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <header class="site-header">
      <a href="index.html" class="brand">
        <img src="images/logo.jpg" alt="${SITE.name}">
      </a>
      <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav id="site-nav">${links}</nav>
    </header>`,
  );
}

// Footer
function renderFooter() {
  const phoneLink = SITE.phone.replace(/\s/g, '');

  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <footer class="site-footer">
      <div class="cols">
        <div>
          <h4>${SITE.name}</h4>
          <p>Self-service laundromat.</p>
        </div>
        <div>
          <h4>Visit</h4>
          <p>${SITE.address}</p>
          <p>${SITE.hours}</p>
        </div>
        <div>
          <h4>Contact</h4>
          <a href="tel:${phoneLink}">${SITE.phone}</a>
          <a href="mailto:${SITE.email}">${SITE.email}</a>
          <a href="${SITE.facebook}" target="_blank" rel="noopener">Facebook</a>
        </div>
      </div>
      <small>&copy; ${new Date().getFullYear()} ${SITE.name}</small>
    </footer>`,
  );
}

// Menu
function initMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');

  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? 'Close' : 'Menu';
  };

  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });
}

// Loader
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  let seen = false;
  try {
    seen = sessionStorage.getItem('seen');
  } catch (e) {}

  if (seen) {
    loader.remove();
    document.body.classList.remove('loading');
    return;
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      try {
        sessionStorage.setItem('seen', '1');
      } catch (e) {}
    }, 700);
  });
}

// Reveal
function initReveal() {
  document.querySelectorAll('.stagger > *').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 90}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting));
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

// Models
function initModels() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.src = e.target.dataset.src;
        observer.unobserve(e.target);
      });
    },
    { rootMargin: '300px 0px' },
  );

  document.querySelectorAll('model-viewer[data-src]').forEach((m) => observer.observe(m));
}

// Showcase
function initShowcase() {
  const machine = document.getElementById('machine');
  if (!machine) return;

  const steps = document.querySelectorAll('.step');
  const isMobile = window.matchMedia('(max-width: 800px)').matches;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        steps.forEach((s) => s.classList.remove('active'));
        e.target.classList.add('active');
        machine.cameraOrbit = e.target.dataset.orbit;
      });
    },
    { rootMargin: isMobile ? '-62% 0px -22% 0px' : '-45% 0px -45% 0px' },
  );

  steps.forEach((s) => observer.observe(s));
}

// Init
renderHeader();
renderFooter();
initMenu();
initLoader();
initReveal();
initModels();
initShowcase();