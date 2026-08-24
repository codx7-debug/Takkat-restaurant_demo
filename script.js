/* =============================================
   TAKKAT RESTAURANT - JavaScript
   Cart, Tabs, Navbar, Scroll Animations
   ============================================= */

// =================== CART STATE ===================
let cart = {};

function addToCart(btn, name, price) {
  if (cart[name]) {
    cart[name].qty++;
  } else {
    cart[name] = { price, qty: 1 };
  }

  // Animate button
  btn.textContent = '✓';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = '+';
    btn.classList.remove('added');
  }, 700);

  renderCart();
  showCart();
}

function removeFromCart(name) {
  delete cart[name];
  renderCart();
}

function renderCart() {
  const itemsEl   = document.getElementById('cart-items');
  const countEl   = document.getElementById('cart-count');
  const totalEl   = document.getElementById('total-price');
  const widget    = document.getElementById('cart-widget');

  const keys = Object.keys(cart);
  const totalQty = keys.reduce((s, k) => s + cart[k].qty, 0);
  const totalPrice = keys.reduce((s, k) => s + cart[k].price * cart[k].qty, 0);

  countEl.textContent = totalQty;

  if (totalQty === 0) {
    widget.style.display = 'none';
    itemsEl.innerHTML = '<div class="cart-empty">لا يوجد عناصر في السلة</div>';
    totalEl.textContent = '0 د.إ';
    return;
  }

  widget.style.display = 'block';
  totalEl.textContent = totalPrice + ' د.إ';

  itemsEl.innerHTML = keys.map(name => `
    <div class="cart-item">
      <span class="cart-item-name">${name}</span>
      <span class="cart-item-qty">×${cart[name].qty}</span>
      <span class="cart-item-price">${cart[name].price * cart[name].qty} د.إ</span>
      <button class="cart-item-remove" onclick="removeFromCart('${name.replace(/'/g, "\\'")}')">✕</button>
    </div>
  `).join('');
}

function showCart() {
  const panel = document.getElementById('cart-panel');
  panel.classList.add('open');
}

function toggleCart() {
  const panel = document.getElementById('cart-panel');
  panel.classList.toggle('open');
}

// Close cart when clicking outside
document.addEventListener('click', (e) => {
  const widget = document.getElementById('cart-widget');
  const panel  = document.getElementById('cart-panel');
  if (widget && !widget.contains(e.target)) {
    panel.classList.remove('open');
  }
});

// =================== MENU TABS ===================
const tabs = document.querySelectorAll('.menu-tab');
const cards = document.querySelectorAll('.menu-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Activate tab
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const cat = tab.dataset.cat;

    // Filter cards
    cards.forEach((card, i) => {
      const match = cat === 'featured'
        ? card.dataset.cat === 'featured'
        : card.dataset.cat === cat;

      if (match) {
        card.classList.remove('hidden');
        card.style.animationDelay = (i % 6) * 0.07 + 's';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// =================== NAVBAR SCROLL ===================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

function updateNav() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link on scroll
  const sections = ['home', 'menu', 'about', 'reviews', 'contact'];
  let current = 'home';

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) {
      current = id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNav, { passive: true });

// =================== HAMBURGER / MOBILE MENU ===================
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobile-menu');
const mobLinks     = document.querySelectorAll('.mob-link');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// =================== SMOOTH SCROLL (nav links) ===================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.offsetTop - (parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--navbar-h')) || 72);
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// =================== SCROLL REVEAL ===================
function initReveal() {
  const elements = document.querySelectorAll(
    '.stats-bar, .menu-section .section-header, .menu-tabs, .menu-card, ' +
    '.about-content, .about-image-wrap, .feature, ' +
    '.review-card, .contact-card, .review-cta'
  );

  elements.forEach((el, i) => {
    el.classList.add('reveal');
    // stagger children groups
    if (el.classList.contains('menu-card') || el.classList.contains('review-card') ||
        el.classList.contains('contact-card') || el.classList.contains('feature')) {
      el.style.transitionDelay = (i % 5) * 0.08 + 's';
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// =================== OPEN HOURS BADGE ===================
function updateHoursBadge() {
  const badge = document.getElementById('hero-badge');
  const openBadge = document.querySelector('.open-badge');
  const now = new Date();
  const hour = now.getHours();
  // Restaurant open all day until midnight (0:00)
  const isOpen = hour < 24; // always open except 00:00-store-open time (simplified)

  // If it's between midnight and some opening hour (let's say 9am), mark as closed
  const isClosed = hour >= 0 && hour < 9;

  if (isClosed) {
    if (badge) {
      badge.style.background = 'hsla(0, 60%, 40%, 0.2)';
      badge.style.borderColor = 'hsla(0, 60%, 40%, 0.4)';
      badge.style.color = 'hsl(0, 70%, 65%)';
      badge.innerHTML = '<span class="badge-dot" style="background:hsl(0,70%,55%)"></span> مغلق حالياً · يفتح الصباح';
    }
    if (openBadge) {
      openBadge.textContent = 'مغلق الآن';
      openBadge.style.background = 'hsla(0, 60%, 40%, 0.25)';
      openBadge.style.borderColor = 'hsla(0, 60%, 40%, 0.5)';
      openBadge.style.color = 'hsl(0, 70%, 65%)';
    }
  }
}

// =================== INIT ===================
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  updateNav();
  updateHoursBadge();
  renderCart(); // Initialize empty cart state
});
