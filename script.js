/* ============================================
   APEXAIR — Shared Site Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Navigation Toggle ---
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Navbar background on scroll ---
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.style.background = 'rgba(10,10,15,0.95)';
    } else {
      navbar.style.background = 'rgba(10,10,15,0.8)';
    }

    lastScroll = scrollY;
  }, { passive: true });

  // --- Scroll-triggered fade-in animations ---
  const animateElements = () => {
    // Select elements to animate
    const selectors = [
      '.feature-card',
      '.step',
      '.cta-section__inner',
      '.section-title',
      '.section-subtitle',
      '.bento__card',
      '.ecosystem__card',
      '.about__stat'
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (!el.classList.contains('fade-in')) {
          el.classList.add('fade-in');
        }
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });
  };

  animateElements();

  // --- Stagger animation for feature cards ---
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  // --- Stagger animation for bento cards ---
  const bentoCards = document.querySelectorAll('.bento__card');
  bentoCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.15}s`;
  });

  // --- Stagger animation for ecosystem cards ---
  const ecoCards = document.querySelectorAll('.ecosystem__card');
  ecoCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  // --- Stagger animation for about stats ---
  const aboutStats = document.querySelectorAll('.about__stat');
  aboutStats.forEach((stat, i) => {
    stat.style.transitionDelay = `${i * 0.1}s`;
  });

  // --- Smooth scroll for anchor links (fallback) ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Subtle parallax on hero glow ---
  const heroGlow = document.querySelector('.hero__glow');
  const heroVortex = document.querySelector('.hero__vortex');

  if (heroGlow && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      heroGlow.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y}px)`;
      if (heroVortex) {
        heroVortex.style.transform = `translateX(calc(-50% + ${x * 0.5}px))`;
      }
    }, { passive: true });
  }

  // --- Floating Particles ---
  const particleContainer = document.getElementById('heroParticles');
  if (particleContainer) {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      // Random position centered around the beam
      const centerX = 50;
      const spread = 30;
      const x = centerX + (Math.random() - 0.5) * spread;
      particle.style.left = x + '%';
      particle.style.bottom = Math.random() * 40 + '%';

      // Random size
      const size = Math.random() * 3 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';

      // Random duration and delay
      const duration = Math.random() * 6 + 5;
      particle.style.animationDuration = duration + 's';
      particle.style.animationDelay = Math.random() * 2 + 's';

      // Random color from gold palette
      const colors = ['#F5C242', '#B8860B', '#CD7F32', '#E8922F', '#FFD666'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.boxShadow = `0 0 ${size * 2}px ${particle.style.background}`;

      particleContainer.appendChild(particle);

      // Cleanup after animation
      setTimeout(() => {
        particle.remove();
      }, (duration + 2) * 1000);
    };

    // Spawn particles continuously
    const spawnParticles = () => {
      createParticle();
      setTimeout(spawnParticles, Math.random() * 400 + 200);
    };
    spawnParticles();

    // Initial burst
    for (let i = 0; i < 20; i++) {
      setTimeout(createParticle, i * 100);
    }
  }
});
