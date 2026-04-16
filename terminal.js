// Modern portfolio website functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initializeTheme();

  // Initialize navigation
  initializeNavigation();

  // Initialize mobile menu
  initializeMobileMenu();

  // Initialize bottom navigation (mobile)
  initializeBottomNav();

  // Initialize smooth scrolling
  initializeSmoothScrolling();

  // Initialize animations on scroll
  initializeScrollAnimations();

  // Initialize rotating hero console
  initializeHeroConsole();

  // Initialize external article feed
  initializeDevToFeed();
});

/* ===== THEME FUNCTIONALITY ===== */
function initializeTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const bottomThemeToggle = document.getElementById('bottom-theme-toggle');
  const themeState = document.querySelector('.theme-toggle-state');
  const themeIcon = document.querySelector('.theme-toggle-icon');
  const bottomThemeIcon = document.getElementById('bottom-theme-icon');
  const bottomThemeLabel = document.getElementById('bottom-theme-label');

  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  // Theme toggle event listener (desktop)
  themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // Theme toggle event listener (mobile bottom nav)
  bottomThemeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (themeState) {
      themeState.textContent = theme === 'dark' ? 'DARK' : 'LIGHT';
    }

    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☾' : '☼';
    }

    if (bottomThemeIcon) {
      bottomThemeIcon.textContent = theme === 'dark' ? '☾' : '☼';
    }

    if (bottomThemeLabel) {
      bottomThemeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }

    const themeLabel = `Toggle theme, current theme ${theme}`;
    themeToggle?.setAttribute('aria-label', themeLabel);
    bottomThemeToggle?.setAttribute('aria-label', themeLabel);

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.content = theme === 'dark' ? '#000000' : '#f5f7f2';
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

/* ===== BOTTOM NAVIGATION (Mobile) ===== */
function initializeBottomNav() {
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
  const sections = document.querySelectorAll('section[id]');

  // Smooth scroll for bottom nav items
  bottomNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 60;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }

      // Update active state immediately for better UX feedback
      bottomNavItems.forEach(navItem => navItem.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Update active state on scroll
  const updateActiveNavItem = () => {
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        bottomNavItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
          }
        });
      }
    });
  };

  // Throttled scroll listener for performance
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(updateActiveNavItem);
  });

  // Initial active state
  updateActiveNavItem();
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

  const animateElements = document.querySelectorAll('.skill-category, .blog-card, .operator-panel, .about-copy, .contact-content');
  animateElements.forEach(el => {
    observer.observe(el);
  });
}

/* ===== HERO CONSOLE FUNCTIONALITY ===== */
function initializeHeroConsole() {
  const consolePanel = document.querySelector('.hero-visual');
  const tabs = Array.from(document.querySelectorAll('[data-terminal-tab]'));
  const pages = Array.from(document.querySelectorAll('[data-terminal-page]'));
  if (!consolePanel || tabs.length === 0 || pages.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = Math.max(0, tabs.findIndex(tab => tab.classList.contains('is-active')));
  let rotationTimer;

  function showPage(nextIndex) {
    activeIndex = nextIndex;
    const viewName = tabs[activeIndex].dataset.terminalTab;

    tabs.forEach(tab => {
      const isActive = tab.dataset.terminalTab === viewName;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    pages.forEach(page => {
      const isActive = page.dataset.terminalPage === viewName;
      page.classList.toggle('is-active', isActive);
      page.hidden = !isActive;
    });
  }

  function rotatePage() {
    showPage((activeIndex + 1) % tabs.length);
  }

  function startRotation() {
    if (prefersReducedMotion || rotationTimer) return;
    rotationTimer = window.setInterval(rotatePage, 4200);
  }

  function stopRotation() {
    if (!rotationTimer) return;
    window.clearInterval(rotationTimer);
    rotationTimer = undefined;
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      stopRotation();
      showPage(index);
      startRotation();
    });
  });

  consolePanel.addEventListener('mouseenter', stopRotation);
  consolePanel.addEventListener('mouseleave', startRotation);
  showPage(activeIndex);
  startRotation();
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
  return true;
}

// Track interactions
function trackInteraction(category, action, label = '') {
  return Boolean(category && action && label !== undefined);
}

// Initialize analytics
trackPageView();

// Track theme toggle (desktop)
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  trackInteraction('Theme', 'Toggle', currentTheme);
});

// Track theme toggle (mobile bottom nav)
document.getElementById('bottom-theme-toggle')?.addEventListener('click', () => {
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

/* ===== DEV.TO BLOG FEED ===== */

const DEVTO_USERNAME = 'lpossamai';
const DEVTO_API_URL = `https://dev.to/api/articles?username=${DEVTO_USERNAME}&per_page=6`;

async function initializeDevToFeed() {
  const feedContainer = document.getElementById('devto-feed');
  if (!feedContainer) return;

  try {
    const response = await fetch(DEVTO_API_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }

    const articles = await response.json();

    if (articles.length === 0) {
      feedContainer.innerHTML = `
        <div class="blog-error">
          <p>No articles found. Check back soon!</p>
        </div>
      `;
      return;
    }

    // Render articles
    feedContainer.innerHTML = articles.map(article => createArticleCard(article)).join('');

  } catch (error) {
    console.error('Error fetching articles:', error);
    feedContainer.innerHTML = `
      <div class="blog-error">
        <p>Unable to load articles right now.</p>
        <a href="https://dev.to/${DEVTO_USERNAME}" target="_blank" class="btn btn-secondary" style="margin-top: 1rem;">
          Visit article profile
        </a>
      </div>
    `;
  }
}

function createArticleCard(article) {
  const publishedDate = new Date(article.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const publicTitle = sanitizePublicText(article.title || 'Technical article');
  const publicDescription = sanitizePublicText(article.description || '');
  const coverImage = article.cover_image || article.social_image;
  const imageHtml = coverImage
    ? `<img src="${coverImage}" alt="${escapeHtml(publicTitle)}" class="blog-card-image" loading="lazy">`
    : `<div class="blog-card-placeholder">TXT</div>`;

  const readingTime = article.reading_time_minutes || 1;
  const reactions = article.positive_reactions_count || 0;
  const comments = article.comments_count || 0;

  const excerpt = publicDescription
    ? escapeHtml(publicDescription).substring(0, 150) + (publicDescription.length > 150 ? '...' : '')
    : 'Click to read more...';

  return `
    <article class="blog-card">
      <a href="${article.url}" target="_blank" rel="noopener noreferrer">
        ${imageHtml}
      </a>
      <div class="blog-card-content">
        <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="blog-card-title">
          ${escapeHtml(publicTitle)}
        </a>
        <p class="blog-card-excerpt">${excerpt}</p>
        <div class="blog-card-meta">
          <span class="blog-card-date">
            <span>date</span>
            <span>${publishedDate}</span>
          </span>
          <div class="blog-card-stats">
            <span class="blog-card-stat" title="Reactions">
              <span>up</span>
              <span>${reactions}</span>
            </span>
            <span class="blog-card-stat" title="Comments">
              <span>cm</span>
              <span>${comments}</span>
            </span>
            <span class="blog-card-stat" title="Reading time">
              <span>min</span>
              <span>${readingTime} min</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  `;
}

function sanitizePublicText(text) {
  const replacements = [
    [/\bAmazon Web Services\b/gi, 'public cloud'],
    [/\bAmazon\b/gi, 'cloud provider'],
    [/\bAWS\b/g, 'cloud platform'],
    [/\bAzure\b/g, 'cloud platform'],
    [/\bMicrosoft\b/gi, 'cloud provider'],
    [/\bCloudFront\b/g, 'edge network'],
    [/\bEC2\b/g, 'virtual machines'],
    [/\bECS\b/g, 'container service'],
    [/\bEKS\b/g, 'managed Kubernetes'],
    [/\bFargate\b/g, 'serverless containers'],
    [/\bS3\b/g, 'object storage'],
    [/\bWAF\b/g, 'web firewall'],
    [/\bGitHub\b/g, 'code platform'],
    [/\bGitLab\b/g, 'CI platform'],
    [/\bOpenAI\b/g, 'model provider'],
    [/\bPinecone\b/g, 'vector database'],
    [/\bCohere\b/g, 'reranking provider']
  ];

  return replacements.reduce((value, [pattern, replacement]) => {
    return value.replace(pattern, replacement);
  }, String(text));
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
