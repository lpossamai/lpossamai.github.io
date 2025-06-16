// Modern portfolio website functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initializeTheme();

  // Initialize navigation
  initializeNavigation();

  // Initialize mobile menu
  initializeMobileMenu();

  // Initialize smooth scrolling
  initializeSmoothScrolling();

  // Initialize animations on scroll
  initializeScrollAnimations();
});

/* ===== THEME FUNCTIONALITY ===== */
function initializeTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.querySelector('.theme-toggle-icon');

  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  // Theme toggle event listener
  themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update theme toggle icon
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // Update theme-color meta tag
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.content = theme === 'dark' ? '#0f172a' : '#ffffff';
    }
  }
}

/* ===== NAVIGATION FUNCTIONALITY ===== */
function initializeNavigation() {
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Add scroll effect to navigation
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav?.classList.add('nav-scrolled');
    } else {
      nav?.classList.remove('nav-scrolled');
    }
  });

  // Add active link highlighting
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ===== MOBILE MENU FUNCTIONALITY ===== */
function initializeMobileMenu() {
  const mobileToggle = document.getElementById('nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile menu toggle
  mobileToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('nav-menu--open');
    mobileToggle.classList.toggle('nav-mobile-toggle--open');
  });

  // Close mobile menu when link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('nav-menu--open');
      mobileToggle?.classList.remove('nav-mobile-toggle--open');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-mobile-toggle')) {
      navMenu?.classList.remove('nav-menu--open');
      mobileToggle?.classList.remove('nav-mobile-toggle--open');
    }
  });
}

/* ===== SMOOTH SCROLLING ===== */
function initializeSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ===== SCROLL ANIMATIONS ===== */
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll('.skill-category, .project-card, .stat, .about-text, .contact-info');
  animateElements.forEach(el => {
    observer.observe(el);
  });
}

/* ===== UTILITY FUNCTIONS ===== */

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

/* ===== PERFORMANCE OPTIMIZATIONS ===== */

// Optimize scroll event listeners
const optimizedScrollHandler = throttle(() => {
  // Handle scroll-based functionality here if needed
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Preload critical resources
function preloadCriticalResources() {
  const criticalImages = [
    // Add any critical images here
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  });
}

// Initialize performance optimizations
preloadCriticalResources();

/* ===== ACCESSIBILITY ENHANCEMENTS ===== */

// Handle reduced motion preference
function handleReducedMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-normal', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
  }
}

handleReducedMotion();

// Keyboard navigation enhancement
document.addEventListener('keydown', (e) => {
  // ESC key closes mobile menu
  if (e.key === 'Escape') {
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.getElementById('nav-toggle');
    navMenu?.classList.remove('nav-menu--open');
    mobileToggle?.classList.remove('nav-mobile-toggle--open');
  }
});

// Focus management for better keyboard navigation
function enhanceFocusManagement() {
  const focusableElements = document.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );

  // Add focus indicators
  focusableElements.forEach(element => {
    element.addEventListener('focus', () => {
      element.classList.add('focused');
    });

    element.addEventListener('blur', () => {
      element.classList.remove('focused');
    });
  });
}

enhanceFocusManagement();

/* ===== ERROR HANDLING ===== */

// Global error handler
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  // You could send this to a logging service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  e.preventDefault(); // Prevent default browser behavior
});

/* ===== ANALYTICS (Optional) ===== */

// Simple page view tracking (replace with your analytics solution)
function trackPageView() {
  // Add your analytics tracking code here
  console.log('Page view tracked');
}

// Track interactions
function trackInteraction(category, action, label = '') {
  // Add your analytics tracking code here
  console.log(`Interaction tracked: ${category} - ${action} - ${label}`);
}

// Initialize analytics
trackPageView();

// Track theme toggle
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  trackInteraction('Theme', 'Toggle', currentTheme);
});

/* ===== CONTACT FORM (If you add one later) ===== */

// Contact form handler (placeholder for future use)
function initializeContactForm() {
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Handle form submission
      const formData = new FormData(contactForm);

      // Add your form submission logic here
      console.log('Form submitted:', Object.fromEntries(formData));

      // Show success message
      showNotification('Message sent successfully!', 'success');
    });
  }
}

// Simple notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Initialize contact form when DOM is ready
document.addEventListener('DOMContentLoaded', initializeContactForm);
