

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) navLinks.classList.remove('open');
});

const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAs.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

const revealSelectors = [
  '.mini-card',
  '.exp-card',
  '.project-card',
  '.acad-item',
  '.ach-list li',
  '.github-contrib-card',
  '.hero-stats-bar',
  '.c-link',
];

const revealEls = document.querySelectorAll(revealSelectors.join(', '));

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('cName').value.trim();
    const email   = document.getElementById('cEmail').value.trim();
    const subject = document.getElementById('cSubject').value.trim();
    const message = document.getElementById('cMessage').value.trim();

    if (!name || !email || !subject || !message) {
      formStatus.textContent = '⚠ Please fill in all fields.';
      formStatus.className = 'form-status error';
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      formStatus.textContent = '⚠ Please enter a valid email address.';
      formStatus.className = 'form-status error';
      return;
    }

    const mailto = `mailto:msrajguru7@gmail.com`
      + `?subject=${encodeURIComponent(subject)}`
      + `&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

    window.location.href = mailto;

    formStatus.textContent = '✓ Opening your email client…';
    formStatus.className = 'form-status success';

    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
      contactForm.reset();
    }, 4000);
  });
}