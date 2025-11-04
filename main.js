// ===========================
// LITTLE GENIUS - ADVANCED SINGLE PAGE APP
// Professional Robotix Education Hub
// ===========================

class LittleGeniusApp {
  constructor() {
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    this.scrollObserver = null;
    this.intersectionObserver = null;
    this.isScrolling = false;
    this.scrollTimeout = null;
    this.init();
  }

  init() {
    this.setupScrollListener();
    this.setupIntersectionObserver();
    this.setupNavigation();
    this.setupMenuToggle();
    this.setupFormHandlers();
    this.setupCTAButtons();
    this.setupSmoothScroll();
    this.setupPerformanceMonitoring();
    console.log('🚀 Little Genius App Initialized Successfully!');
  }

  // ===========================
  // NAVIGATION SYSTEM
  // ===========================

  setupNavigation() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
      link.addEventListener('mouseenter', () => this.handleNavHover(link));
    });

    // Highlight active nav on scroll
    document.addEventListener('scroll', () => this.updateActiveNavLink());
  }

  handleNavClick(e) {
    e.preventDefault();
    
    const link = e.target;
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (!targetSection) return;

    // Remove active from all links
    this.navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Close mobile menu if open
    const navContainer = document.querySelector('.nav-container');
    if (navContainer && navContainer.classList.contains('active')) {
      navContainer.classList.remove('active');
      document.getElementById('menuToggle').classList.remove('active');
    }

    // Smooth scroll with callback
    this.smoothScrollTo(targetSection, 100);
  }

  handleNavHover(link) {
    // Add visual feedback on hover
    link.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  }

  updateActiveNavLink() {
    if (this.isScrolling) return;

    const scrollPosition = window.scrollY + 150;

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const sectionId = section.getAttribute('id');
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        this.navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }

  smoothScrollTo(element, offset = 100) {
    this.isScrolling = true;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });

    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 1000);
  }

  // ===========================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ===========================

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: [0, 0.15, 0.3],
      rootMargin: '0px 0px -100px 0px'
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.intersectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
      '.about-card, .product-card, .course-card, .stat-card, .info-card, .feature-card, .faq-item'
    );
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      this.intersectionObserver.observe(el);
    });
  }

  animateElement(element) {
    // Add staggered animation
    const delay = element.dataset.delay || 0;
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, delay);
  }

  // ===========================
  // MOBILE MENU TOGGLE
  // ===========================

  setupMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const navContainer = document.querySelector('.nav-container');

    if (!menuToggle || !navContainer) return;

    menuToggle.addEventListener('click', () => {
      const isActive = navContainer.classList.toggle('active');
      menuToggle.classList.toggle('active');

      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'hidden' : 'auto';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header')) {
        navContainer.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // ===========================
  // CTA BUTTONS WITH RIPPLE EFFECT
  // ===========================

  setupCTAButtons() {
    const buttons = document.querySelectorAll('.cta-button:not(.btn-submit)');

    buttons.forEach(button => {
      button.addEventListener('click', (e) => this.handleCTAClick(e, button));
      button.addEventListener('mouseenter', (e) => this.createRipple(e, button));
    });
  }

  handleCTAClick(e, button) {
    this.createRipple(e, button);
    
    const targetId = button.getAttribute('href') || '#create';
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      setTimeout(() => {
        this.smoothScrollTo(targetSection, 100);
      }, 300);
    }
  }

  createRipple(e, button) {
    // Remove previous ripples
    const previousRipple = button.querySelector('.ripple');
    if (previousRipple) previousRipple.remove();

    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = (e.clientX || e.pageX) - rect.left - size / 2;
    const y = (e.clientY || e.pageY) - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  // ===========================
  // FORM HANDLING & VALIDATION
  // ===========================

  setupFormHandlers() {
    const enrollmentForm = document.getElementById('enrollmentForm');
    const contactForm = document.getElementById('contactForm');

    if (enrollmentForm) {
      enrollmentForm.addEventListener('submit', (e) => this.handleFormSubmit(e, enrollmentForm, 'enrollment'));
    }

    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e, contactForm, 'contact'));
    }

    // Real-time form validation
    document.querySelectorAll('form').forEach(form => {
      form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', () => this.validateFormField(input));
        input.addEventListener('change', () => this.validateFormField(input));
      });
    });
  }

  handleFormSubmit(e, form, formType) {
    e.preventDefault();

    if (!this.validateForm(form)) {
      this.showNotification('⚠️ Please fill out all required fields correctly.', 'error');
      return;
    }

    // Disable submit button
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Processing...';

    // Simulate form submission
    setTimeout(() => {
      this.showNotification(
        formType === 'enrollment' 
          ? '✅ Registration submitted! We\'ll contact you within 24 hours.'
          : '✅ Message sent! Thank you for reaching out.',
        'success'
      );

      // Reset form
      form.reset();
      form.querySelectorAll('input, select, textarea').forEach(field => {
        field.style.borderColor = '';
        field.style.backgroundColor = '';
      });

      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      // Scroll to top after delay
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    }, 1500);
  }

  validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');

    fields.forEach(field => {
      if (!this.validateFormField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateFormField(field) {
    const value = field.value.trim();
    let isValid = true;

    // Email validation
    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
    }

    // Phone validation
    if (field.type === 'tel') {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      isValid = value === '' || phoneRegex.test(value);
    }

    // Required fields
    if (field.hasAttribute('required')) {
      isValid = isValid && value !== '';
    }

    // Visual feedback
    if (field.hasAttribute('required') && value === '') {
      field.style.borderColor = '#ff1744';
      field.style.backgroundColor = '#ffe6e6';
      isValid = false;
    } else if (field.type === 'email' && value !== '' && !isValid) {
      field.style.borderColor = '#ff9100';
      field.style.backgroundColor = '#fff3e0';
    } else {
      field.style.borderColor = '';
      field.style.backgroundColor = '';
    }

    return isValid;
  }

  // ===========================
  // SCROLL LISTENER FOR ANIMATIONS
  // ===========================

  setupScrollListener() {
    let scrollTimeout;
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);

      const header = document.querySelector('.header');
      const scrollTop = window.scrollY;

      // Add shadow to header when scrolling
      if (scrollTop > 50) {
        header.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
      } else {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }

      // Detect scroll direction
      if (scrollTop > lastScrollTop) {
        // Scrolling down
        header.style.transform = 'translateY(0)';
      } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
  }

  // ===========================
  // SMOOTH SCROLL POLYFILL
  // ===========================

  setupSmoothScroll() {
    if (!('scrollBehavior' in document.documentElement.style)) {
      // Polyfill for browsers that don't support smooth scroll
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href !== '#') {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
              element.scrollIntoView({ behavior: 'auto' });
            }
          }
        });
      });
    }
  }

  // ===========================
  // NOTIFICATION SYSTEM
  // ===========================

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 10000;
      animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      ${type === 'success' 
        ? 'background: linear-gradient(135deg, #00c853 0%, #00a84d 100%); color: white;' 
        : type === 'error'
        ? 'background: linear-gradient(135deg, #ff1744 0%, #d81b60 100%); color: white;'
        : 'background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%); color: white;'}
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ===========================
  // PERFORMANCE MONITORING
  // ===========================

  setupPerformanceMonitoring() {
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        // Log only in development
        if (process.env.NODE_ENV === 'development' || true) {
          console.log(`📊 Page Load Time: ${pageLoadTime}ms`);
          console.log(`✅ All resources loaded successfully`);
        }
      });
    }
  }

  // ===========================
  // UTILITY METHODS
  // ===========================

  debounce(func, wait) {
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

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// ===========================
// INITIALIZE APP
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  window.littleGeniusApp = new LittleGeniusApp();
});

// ===========================
// ADD STYLES FOR NOTIFICATIONS
// ===========================

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.7);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .notification {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    .notification {
      top: 70px !important;
      right: 10px !important;
      left: 10px !important;
    }
  }
`;
document.head.appendChild(style);

// ===========================
// ANALYTICS TRACKING (Optional)
// ===========================

window.trackEvent = function(eventName, eventData = {}) {
  const event = {
    name: eventName,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    ...eventData
  };

  // Send to your analytics service
  console.log('📊 Event Tracked:', event);
};

// Track page navigation
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    window.trackEvent('navigation_click', {
      target: link.getAttribute('href')
    });
  });
});

// Track form submissions
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', () => {
    window.trackEvent('form_submission', {
      formId: form.getAttribute('id')
    });
  });
});

console.log('🚀 Little Genius Robotix - Advanced JavaScript Loaded!');
console.log('💡 Tip: Type littleGeniusApp in console for debugging');
