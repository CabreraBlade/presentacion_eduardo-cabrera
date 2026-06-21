/* ============================================================
   NAVBAR — scroll effect + mobile toggle
============================================================ */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ============================================================
   SMOOTH ACTIVE NAV LINK
============================================================ */
const sections = document.querySelectorAll('section[id]');

const observerNav = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observerNav.observe(s));

/* ============================================================
   SCROLL REVEAL ANIMATION
============================================================ */
const revealTargets = [
  '.hero-content',
  '.hero-photo-wrap',
  '.about-text',
  '.about-visual',
  '.folder-card',
  '.why-card',
  '.contact-form-wrap',
  '.contact-info-wrap',
  '.section-title',
  '.section-label',
  '.section-subtitle',
];

revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i * 0.08) + 's';
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   PHOTO FALLBACK (hide broken <img>, show placeholder)
============================================================ */
const photoMap = [
  { imgId: 'heroPhoto',    placeholderId: 'heroPlaceholder' },
  { imgId: 'aboutPhoto',   placeholderId: 'aboutPlaceholder' },
  { imgId: 'contactPhoto', placeholderId: 'contactPlaceholder' },
];

photoMap.forEach(({ imgId, placeholderId }) => {
  const img  = document.getElementById(imgId);
  const ph   = document.getElementById(placeholderId);
  if (!img || !ph) return;

  const hide = () => { img.style.display = 'none'; ph.style.display = 'block'; };
  const show = () => { img.style.display = 'block'; ph.style.display = 'none'; };

  if (!img.src || img.src === window.location.href) { hide(); return; }
  img.addEventListener('error', hide);
  img.addEventListener('load',  show);
  if (img.complete && img.naturalWidth > 0) show();
  else if (img.complete) hide();
});

/* Folder images */
document.querySelectorAll('.folder-img').forEach(img => {
  const ph = img.nextElementSibling;
  if (!ph) return;
  const hide = () => { img.style.display = 'none'; ph.style.display = 'flex'; };
  const show = () => { img.style.display = 'block'; ph.style.display = 'none'; };
  img.addEventListener('error', hide);
  img.addEventListener('load',  show);
  if (img.complete && img.naturalWidth > 0) show();
  else hide();
});

/* ============================================================
   CONTACT FORM VALIDATION & SUBMIT
============================================================ */
const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  const required = form.querySelectorAll('[required]');

  const validate = (field) => {
    const group = field.closest('.form-group');
    if (!group) return true;

    let valid = true;

    if (field.type === 'email') {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    } else {
      valid = field.value.trim().length > 0;
    }

    group.classList.toggle('has-error', !valid);
    field.classList.toggle('error', !valid);
    return valid;
  };

  required.forEach(field => {
    field.addEventListener('blur',  () => validate(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validate(field);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let allValid = true;
    required.forEach(field => { if (!validate(field)) allValid = false; });
    if (!allValid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    await new Promise(r => setTimeout(r, 1200));

    form.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
    required.forEach(f => f.closest('.form-group')?.classList.remove('has-error'));

    formSuccess.classList.add('visible');
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      Enviar Mensaje`;

    setTimeout(() => formSuccess.classList.remove('visible'), 6000);
  });
}

/* ============================================================
   FOLDER CARD HOVER — keyboard accessible
============================================================ */
document.querySelectorAll('.folder-card').forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

/* ============================================================
   ANIMATE STAT COUNTERS
============================================================ */
const animateCounter = (el, target, suffix = '') => {
  const duration = 1600;
  const start    = performance.now();
  const from     = 0;

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (target - from) * ease) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const strong = entry.target.querySelector('strong');
    if (!strong || strong.dataset.animated) return;

    const text   = strong.textContent.trim();
    const num    = parseInt(text);
    const suffix = text.replace(/[0-9]/g, '');
    strong.dataset.animated = 'true';
    animateCounter(strong, num, suffix);
    statObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(el => statObserver.observe(el));
