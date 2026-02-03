/**
 * DoctorCon 2026 - Main JavaScript
 * Warm, welcoming interactions with parallax and reveal effects
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initRevealAnimations();
  initSmoothScroll();
  initParallax();
  initHeaderScroll();
});

/**
 * Mobile Menu Toggle - Dropdown Curtain Style
 */
function initMobileMenu() {
  const button = document.querySelector('.menu-button');
  const drawer = document.querySelector('.mobile-drawer');
  const header = document.querySelector('.site-header');
  const overlay = document.querySelector('.menu-overlay');

  if (!button || !drawer) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    button.classList.add('is-open');
    drawer.classList.add('is-open');
    if (header) header.classList.add('menu-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    button.classList.remove('is-open');
    drawer.classList.remove('is-open');
    if (header) header.classList.remove('menu-open');
    if (overlay) overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  button.addEventListener('click', () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close drawer when clicking a link
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });

  // Close when clicking overlay
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }
}

/**
 * Reveal Animations on Scroll
 */
function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered delay for child elements
          setTimeout(() => {
            entry.target.classList.add('active');
          }, index * 50);
        }
      });
    },
    { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/**
 * Parallax Effects - Universal for all hero/banner sections
 */
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax], .hero-background, .hero-banner .hero-background');
  
  if (!parallaxElements.length) return;

  // Throttle function for performance
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  function updateParallax() {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const parentRect = el.parentElement?.getBoundingClientRect();
      const isVisible = (parentRect?.top || rect.top) < window.innerHeight && (parentRect?.bottom || rect.bottom) > 0;
      
      if (isVisible) {
        // Get parallax speed from data attribute or use default
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
        
        // Calculate offset based on scroll position relative to element
        const elementTop = el.parentElement?.offsetTop || el.offsetTop;
        const relativeScroll = scrolled - elementTop;
        const yOffset = relativeScroll * speed;
        
        // Apply transform to images/videos inside
        const media = el.querySelector('img, video');
        if (media) {
          media.style.transform = `translateY(${yOffset}px) scale(1.1)`;
        } else {
          el.style.transform = `translateY(${yOffset}px)`;
        }
      }
    });
  }

  window.addEventListener('scroll', throttle(updateParallax, 16));
  window.addEventListener('resize', throttle(updateParallax, 100));
  
  // Initial call
  updateParallax();
}

/**
 * Header Scroll Behavior - Hide/Show Floating Pill
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 80;
  let isMenuOpen = false;

  // Check if mobile menu is open
  const menuButton = document.querySelector('.menu-button');
  if (menuButton) {
    const observer = new MutationObserver(() => {
      isMenuOpen = menuButton.classList.contains('is-open');
    });
    observer.observe(menuButton, { attributes: true, attributeFilter: ['class'] });
  }

  function handleScroll() {
    const currentScroll = window.pageYOffset;

    // Don't hide header if menu is open
    if (isMenuOpen) {
      header.classList.remove('is-hidden');
      lastScroll = currentScroll;
      return;
    }

    // Add scrolled class
    if (currentScroll > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    // Hide/show header on scroll direction
    if (currentScroll > scrollThreshold) {
      if (currentScroll > lastScroll + 5) {
        // Scrolling down - hide header
        header.classList.add('is-hidden');
      } else if (currentScroll < lastScroll - 5) {
        // Scrolling up - show header
        header.classList.remove('is-hidden');
      }
    } else {
      // Near top - always show
      header.classList.remove('is-hidden');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Counter Animation (for stats)
 */
function animateCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-counter'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        updateCounter();
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}

/**
 * Video Handling (pause when not visible)
 */
function initVideoHandling() {
  const videos = document.querySelectorAll('.hero-media video');
  
  if (!videos.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {}); // Catch autoplay restrictions
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.2 });

  videos.forEach(video => observer.observe(video));
}

// Initialize video handling
document.addEventListener('DOMContentLoaded', initVideoHandling);
document.addEventListener('DOMContentLoaded', animateCounters);
