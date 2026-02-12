/**
 * DoctorCon 2026 - Main JavaScript
 * Warm, welcoming interactions with parallax and reveal effects
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initDesktopDropdowns();
  initRevealAnimations();
  initSmoothScroll();
  initParallax();
  initHeaderScroll();
  initImageLightbox();
  initSponsorPanel();
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

  // Mobile accordion submenus
  const navGroups = document.querySelectorAll('.mobile-nav-group');
  navGroups.forEach(group => {
    const toggle = group.querySelector('.mobile-nav-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      // Close other open groups
      navGroups.forEach(other => {
        if (other !== group) other.classList.remove('is-open');
      });
      group.classList.toggle('is-open');
    });
  });
}

/**
 * Desktop Dropdown Menus - Hover with click fallback
 */
function initDesktopDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  if (!dropdowns.length) return;

  dropdowns.forEach(dropdown => {
    let timeout;

    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      dropdown.classList.add('is-open');
    });

    dropdown.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => {
        dropdown.classList.remove('is-open');
      }, 150);
    });

    // Click fallback for touch devices
    const trigger = dropdown.querySelector('.nav-link');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth >= 1170) {
          e.preventDefault();
          dropdowns.forEach(d => {
            if (d !== dropdown) d.classList.remove('is-open');
          });
          dropdown.classList.toggle('is-open');
        }
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      dropdowns.forEach(d => d.classList.remove('is-open'));
    }
  });
}

/**
 * Image Lightbox / Zoom Viewer
 */
function initImageLightbox() {
  const zoomables = document.querySelectorAll('.image-zoomable');
  if (!zoomables.length) return;

  // Create lightbox element
  const lightbox = document.createElement('div');
  lightbox.className = 'image-lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close">
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
    <img src="" alt="Zoomed image" draggable="false">
    <div class="lightbox-controls">
      <button data-action="zoom-out" aria-label="Zoom out">−</button>
      <button data-action="reset" aria-label="Reset zoom">⟲</button>
      <button data-action="zoom-in" aria-label="Zoom in">+</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  let scale = 1;
  let translateX = 0, translateY = 0;
  let isDragging = false;
  let startX, startY;

  function updateTransform() {
    lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Image';
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  zoomables.forEach(el => {
    el.addEventListener('click', () => {
      const img = el.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Zoom controls
  lightbox.querySelectorAll('.lightbox-controls button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      if (action === 'zoom-in') scale = Math.min(scale + 0.5, 5);
      if (action === 'zoom-out') scale = Math.max(scale - 0.5, 0.5);
      if (action === 'reset') { scale = 1; translateX = 0; translateY = 0; }
      updateTransform();
    });
  });

  // Mouse wheel zoom
  lightbox.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    scale = Math.max(0.5, Math.min(scale + delta, 5));
    updateTransform();
  }, { passive: false });

  // Drag to pan
  lightboxImg.addEventListener('mousedown', (e) => {
    if (scale <= 1) return;
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    lightbox.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    lightbox.style.cursor = 'grab';
  });

  // Touch zoom (pinch)
  let lastTouchDist = 0;
  lightbox.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      lastTouchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    } else if (e.touches.length === 1 && scale > 1) {
      isDragging = true;
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
    }
  }, { passive: true });

  lightbox.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (dist - lastTouchDist) * 0.01;
      scale = Math.max(0.5, Math.min(scale + delta, 5));
      lastTouchDist = dist;
      updateTransform();
    } else if (isDragging && e.touches.length === 1) {
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;
      updateTransform();
    }
  }, { passive: false });

  lightbox.addEventListener('touchend', () => {
    isDragging = false;
    lastTouchDist = 0;
  });
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

/**
 * Sponsor Panel – Mobile slide-out drawer
 * Shows a fixed side tab that slides open a sponsor/ad sidebar on mobile.
 * On desktop (>=1024px) the inline sidebar is visible so the trigger hides.
 */
function initSponsorPanel() {
  const trigger = document.querySelector('.sponsor-panel-trigger');
  const overlay = document.querySelector('.sponsor-panel-overlay');
  const drawer = document.querySelector('.sponsor-panel-drawer');
  const closeBtn = document.querySelector('.sponsor-panel-close');

  if (!trigger || !drawer) return;

  function openPanel() {
    overlay?.classList.add('is-open');
    drawer.classList.add('is-open');
    trigger.classList.remove('nudge');
    document.body.style.overflow = 'hidden';
  }

  function closePanel() {
    overlay?.classList.remove('is-open');
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
    // Restart nudge after closing, with a delay
    setTimeout(() => {
      if (window.innerWidth < 1024) {
        trigger.classList.add('nudge');
      }
    }, 15000);
  }

  trigger.addEventListener('click', openPanel);
  overlay?.addEventListener('click', closePanel);
  closeBtn?.addEventListener('click', closePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closePanel();
    }
  });

  // Start nudge animation after a delay (non-annoying)
  setTimeout(() => {
    if (window.innerWidth < 1024) {
      trigger.classList.add('nudge');
    }
  }, 5000);

  // Stop nudge on desktop resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      trigger.classList.remove('nudge');
    }
  });
}
