/* ============================================
   APEXIAR — Shared Site Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Navigation Toggle ---
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive);
      mobileNav.setAttribute('aria-hidden', !isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
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
      '.about__stat',
      '.showcase-bento__card'
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

  // --- Mark decorative SVGs as aria-hidden ---
  document.querySelectorAll('.feature-card__icon svg, .ecosystem__card-icon svg, .bento__bell-icon svg').forEach(svg => {
    svg.setAttribute('aria-hidden', 'true');
  });

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

  // --- Stagger animation for showcase bento cards ---
  const showcaseBentoCards = document.querySelectorAll('.showcase-bento__card');
  showcaseBentoCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
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

  // --- Video reel text slide sync ---
  const reelVideo = document.querySelector('.video-reel__bg');
  const reelSlides = document.querySelectorAll('.video-reel__slide');

  if (reelVideo && reelSlides.length > 0) {
    // [start, end] in seconds for each slide
    const slideRanges = [[0.5, 5], [6, 11.5], [12, 17.5]];
    let currentSlide = -1;

    reelVideo.addEventListener('timeupdate', () => {
      const t = reelVideo.currentTime;
      let activeSlide = -1;

      for (let i = 0; i < slideRanges.length; i++) {
        if (t >= slideRanges[i][0] && t <= slideRanges[i][1]) {
          activeSlide = i;
          break;
        }
      }

      if (activeSlide !== currentSlide) {
        reelSlides.forEach(s => s.classList.remove('video-reel__slide--active'));
        if (activeSlide >= 0) {
          reelSlides[activeSlide].classList.add('video-reel__slide--active');
        }
        currentSlide = activeSlide;
      }
    });
  }

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

  // --- Reusable Particle System ---
  const createParticleSystem = (container, options = {}) => {
    if (!container) return;

    const {
      maxParticles = 60,
      spawnInterval = [80, 200],  // [min, range] ms
      initialBurst = 40,
      burstDelay = 60,
      sizeRange = [1.5, 4],
      durationRange = [5, 7],
      delayRange = [0, 1.5],
      bottomRange = [0, 50],
      colors = ['#F5C242', '#B8860B', '#CD7F32', '#E8922F', '#FFD666', '#FBBF24']
    } = options;

    let activeParticles = 0;
    let spawnTimer = null;
    let paused = false;

    const createParticle = () => {
      if (paused || activeParticles >= maxParticles) return;

      const particle = document.createElement('div');
      particle.classList.add('particle');

      particle.style.left = Math.random() * 100 + '%';
      particle.style.bottom = Math.random() * bottomRange[1] + bottomRange[0] + '%';

      const size = Math.random() * sizeRange[1] + sizeRange[0];
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';

      const duration = Math.random() * durationRange[1] + durationRange[0];
      particle.style.animationDuration = duration + 's';
      particle.style.animationDelay = Math.random() * delayRange[1] + delayRange[0] + 's';

      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.background = color;
      particle.style.boxShadow = `0 0 ${size * 3}px ${color}`;

      container.appendChild(particle);
      activeParticles++;

      setTimeout(() => {
        particle.remove();
        activeParticles--;
      }, (duration + delayRange[1] + 1) * 1000);
    };

    const spawnLoop = () => {
      createParticle();
      spawnTimer = setTimeout(spawnLoop, Math.random() * spawnInterval[1] + spawnInterval[0]);
    };

    // Pause when container is off-screen
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        paused = !entry.isIntersecting;
        if (!paused && !spawnTimer) spawnLoop();
        if (paused && spawnTimer) {
          clearTimeout(spawnTimer);
          spawnTimer = null;
        }
      });
    }, { threshold: 0 });

    visibilityObserver.observe(container.parentElement || container);

    // Start
    spawnLoop();

    // Initial burst
    for (let i = 0; i < initialBurst; i++) {
      setTimeout(createParticle, i * burstDelay);
    }
  };

  // --- Hero Particles ---
  createParticleSystem(document.getElementById('heroParticles'), {
    maxParticles: 60,
    spawnInterval: [80, 200],
    initialBurst: 40,
    burstDelay: 60,
    sizeRange: [1.5, 4],
    durationRange: [5, 7],
    bottomRange: [0, 50]
  });

  // --- Bento Showcase Particles ---
  createParticleSystem(document.getElementById('bentoParticles'), {
    maxParticles: 30,
    spawnInterval: [150, 350],
    initialBurst: 15,
    burstDelay: 120,
    sizeRange: [1, 3.5],
    durationRange: [6, 8],
    delayRange: [0, 2],
    bottomRange: [0, 30],
    colors: ['#F5C242', '#B8860B', '#CD7F32', '#E8922F', '#FFD666']
  });

  // --- Cursor-following glow on .glow-track elements ---
  document.querySelectorAll('.glow-track').forEach(el => {
    const light = document.createElement('div');
    light.className = 'glow-track__light';
    el.appendChild(light);

    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - 60;
      const y = e.clientY - rect.top - 60;
      light.style.left = x + 'px';
      light.style.top = y + 'px';
    });
  });
});
