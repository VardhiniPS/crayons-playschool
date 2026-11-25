/* ═══════════════════════════════════════════
   CRAYONS PLAY SCHOOL – Main JavaScript
   ═══════════════════════════════════════════ */

// ── Navbar scroll state ──────────────────────
const navbar    = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    backToTop.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    backToTop.classList.remove('visible');
  }

  // Active nav link on scroll
  updateActiveNavLink();
});

// ── Mobile hamburger ─────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

// Close mobile menu when link clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ── Active nav link update ───────────────────
function updateActiveNavLink () {
  const sections = document.querySelectorAll('section[id], div[id]');
  const links    = document.querySelectorAll('.nav-link');
  let currentId  = '';

  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top <= 100) currentId = section.id;
  });

  links.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href && href === `#${currentId}`) link.classList.add('active');
  });
}

// ── Scroll Reveal ────────────────────────────
const revealElements = document.querySelectorAll(
  '.why-card, .facility-card, .gallery-item, .notice-item, .event-card, .about-content, .about-visual, .contact-info-panel, .contact-form'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// ── Contact Form – Web3Forms ─────────────────
async function handleFormSubmit (e) {
  e.preventDefault();

  const form    = e.target;
  const btn     = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  const error   = document.getElementById('formError');

  // Reset messages
  success.style.display = 'none';
  error.style.display   = 'none';

  // Show loading state
  btn.textContent = '⏳ Sending...';
  btn.disabled    = true;

  // Collect form data
  const accessKey = document.getElementById('web3formsKey').value.trim();
  const childName = document.getElementById('childName').value.trim();
  const data = {
    access_key : accessKey,
    subject    : `Admission Enquiry – ${childName}`,
    from_name  : 'Crayons Preschool Website',
    parentName : document.getElementById('parentName').value.trim(),
    childName  : childName,
    phone      : document.getElementById('phone').value.trim(),
    childAge   : document.getElementById('childAge').value,
    session    : document.getElementById('session').value || 'Not specified',
    message    : document.getElementById('message').value.trim() || 'No additional message.'
  };

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body    : JSON.stringify(data)
    });
    const result = await response.json();

    if (response.ok && result.success) {
      // ✅ Success
      success.style.display = 'block';
      btn.textContent = '✅ Sent!';
      form.reset();

      setTimeout(() => {
        success.style.display = 'none';
        btn.textContent = '🚀 Send Enquiry';
        btn.disabled    = false;
      }, 5000);
    } else {
      throw new Error(result.message || 'Server error');
    }
  } catch (err) {
    // ❌ Error
    error.style.display = 'block';
    btn.textContent     = '🚀 Send Enquiry';
    btn.disabled        = false;
  }
}

// ── Smooth hover on stat numbers ─────────────
document.querySelectorAll('.stat-num').forEach(num => {
  const target = parseInt(num.textContent);
  if (!isNaN(target)) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCount(num, 0, target, 1200);
        observer.disconnect();
      }
    });
    observer.observe(num);
  }
});

function animateCount (el, start, end, duration) {
  const range = end - start;
  let startTime = null;
  const original = el.textContent;

  function step (timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const val = Math.floor(progress * range + start);
    el.textContent = val + (original.includes('+') ? '+' : original.includes('★') ? '★' : '');
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ── Gallery lightbox (simple) ─────────────────
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const label = item.querySelector('.gi-label')?.textContent || 'Photo';
    const emoji = item.querySelector('.gi-emoji')?.textContent || '📸';
    showLightbox(emoji, label);
  });
});

function showLightbox (emoji, label) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn .2s ease;
  `;
  overlay.innerHTML = `
    <div style="text-align:center; color:#fff;">
      <div style="font-size: 8rem; margin-bottom: 1rem;">${emoji}</div>
      <h3 style="font-size: 1.5rem; font-weight: 800; letter-spacing: .05em;">${label}</h3>
      <p style="opacity:.5; margin-top:.5rem; font-size:.88rem;">Click anywhere to close</p>
    </div>
  `;
  overlay.addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);
}

// ── Inject a quick fadeIn keyframe for lightbox ─
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }`;
document.head.appendChild(style);

console.log('%c🎨 Crayons Play School', 'color:#FF6B6B; font-size:1.5rem; font-weight:900;');
console.log('%cBuilt with ❤️ for little learners.', 'color:#A770EF; font-size:.9rem;');
