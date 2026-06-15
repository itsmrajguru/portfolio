

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

    formStatus.textContent = 'Sending message...';
    formStatus.className = 'form-status';

    fetch("https://formsubmit.co/ajax/msrajguru7@gmail.com", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        subject: subject,
        message: message
      })
    })
    .then(response => response.json())
    .then(data => {
      if(data.success === "true" || data.success === true) {
        formStatus.textContent = '✓ Message sent successfully!';
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        formStatus.textContent = `⚠ ${data.message || 'Something went wrong. Please try again.'}`;
        formStatus.className = 'form-status error';
      }
    })
    .catch(error => {
      formStatus.textContent = '⚠ Failed to send message. Please check your connection.';
      formStatus.className = 'form-status error';
    })
    .finally(() => {
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 7000);
    });
  });
}