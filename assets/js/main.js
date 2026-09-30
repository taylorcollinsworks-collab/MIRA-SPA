/**
 * MIRA SPA — LUXURY WELLNESS EXPERIENCES
 * Core Interactive Script: Revolution Slider, Navigation, Booking System,
 * Gallery, Filter Tabs, Testimonial Carousel, & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initHeroSlider();
  initTestimonialSlider();
  initFaqAccordion();
  initServiceFilters();
  initBookingSystem();
  initScrollReveals();
  initNewsletterForm();
  initPreselectedService();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL BEHAVIOR
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE DRAWER MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  const toggleMenu = () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    drawer.classList.add('open');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    drawer.classList.remove('open');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   3. REVOLUTION SLIDER-STYLE CINEMATIC HERO SLIDER
   ========================================================================== */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider-section');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const prevBtn = slider.querySelector('.hero-arrow-prev');
  const nextBtn = slider.querySelector('.hero-arrow-next');
  const currentCount = slider.querySelector('.hero-counter-current');
  const totalCount = slider.querySelector('.hero-counter-total');
  const progressBar = slider.querySelector('.hero-progress-bar');

  if (!slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  const slideDuration = 6500; // 6.5s per slide
  let slideTimer = null;
  let progressInterval = null;
  let progressStart = 0;
  let isPaused = false;

  if (totalCount) {
    totalCount.textContent = String(totalSlides).padStart(2, '0');
  }

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) {
        slide.classList.add('active');
      }
    });

    if (currentCount) {
      currentCount.textContent = String(index + 1).padStart(2, '0');
    }

    resetProgress();
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    showSlide(currentIndex);
  };

  const resetProgress = () => {
    if (progressBar) {
      progressBar.style.width = '0%';
    }
    clearInterval(progressInterval);
    clearTimeout(slideTimer);

    if (isPaused) return;

    progressStart = Date.now();
    progressInterval = setInterval(() => {
      if (isPaused) return;
      const elapsed = Date.now() - progressStart;
      const pct = Math.min((elapsed / slideDuration) * 100, 100);
      if (progressBar) {
        progressBar.style.width = `${pct}%`;
      }
    }, 50);

    slideTimer = setTimeout(() => {
      nextSlide();
    }, slideDuration);
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
    });
  }

  // Keyboard navigation
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // Touch Swipe for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const diff = touchEndX - touchStartX;
    if (diff > 50) {
      prevSlide();
    } else if (diff < -50) {
      nextSlide();
    }
  };

  // Pause on hover
  slider.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  slider.addEventListener('mouseleave', () => {
    isPaused = false;
    resetProgress();
  });

  // Initialize first slide
  showSlide(0);
}

/* ==========================================================================
   4. TESTIMONIAL SLIDER
   ========================================================================== */
function initTestimonialSlider() {
  const container = document.querySelector('.testimonial-slider-wrap');
  if (!container) return;

  const items = container.querySelectorAll('.testimonial-item');
  const prevBtn = container.querySelector('.test-prev');
  const nextBtn = container.querySelector('.test-next');

  if (!items.length) return;

  let current = 0;
  const total = items.length;

  const updateTestimonial = (index) => {
    items.forEach((item, i) => {
      item.classList.remove('active');
      if (i === index) item.classList.add('active');
    });
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      current = (current + 1) % total;
      updateTestimonial(current);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      current = (current - 1 + total) % total;
      updateTestimonial(current);
    });
  }

  // Auto rotate testimonials
  setInterval(() => {
    current = (current + 1) % total;
    updateTestimonial(current);
  }, 7000);
}

/* ==========================================================================
   5. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.closest('.faq-item');
      const isActive = parent.classList.contains('active');

      // Close all others
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. SERVICES FILTER TABS
   ========================================================================== */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCategories = document.querySelectorAll('.service-category-block');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      if (filterVal === 'all') {
        serviceCategories.forEach(cat => cat.style.display = 'block');
      } else {
        serviceCategories.forEach(cat => {
          if (cat.getAttribute('data-category') === filterVal) {
            cat.style.display = 'block';
            cat.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            cat.style.display = 'none';
          }
        });
      }
    });
  });
}

/* ==========================================================================
   7. BOOKING SYSTEM & APPOINTMENT MODAL
   ========================================================================== */
function initBookingSystem() {
  const modal = document.querySelector('#appointment-modal');
  const openTriggers = document.querySelectorAll('.btn-book-trigger');
  const closeBtns = document.querySelectorAll('.modal-close-trigger');
  const bookingForms = document.querySelectorAll('.appointment-request-form');

  // Open modal
  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service');
      const targetAnchor = btn.getAttribute('data-anchor');

      // If user is on contact.html, allow smooth jump to booking form if preferred
      if (window.location.pathname.includes('contact') && targetAnchor) {
        const targetEl = document.querySelector(targetAnchor);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
          if (serviceName) selectServiceInDropdown(serviceName);
          return;
        }
      }

      if (modal) {
        e.preventDefault();
        openModal(modal);
        if (serviceName) {
          selectServiceInDropdown(serviceName);
        }
      }
    });
  });

  // Close modal
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(modal);
    });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  }

  // Handle all booking forms (both on-page and inside modal)
  bookingForms.forEach(form => {
    // Set min date to today
    const dateInput = form.querySelector('input[type="date"]');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      dateInput.value = today;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="full_name"]')?.value || 'Valued Guest';
      const email = form.querySelector('[name="email"]')?.value || '';
      const phone = form.querySelector('[name="phone"]')?.value || '';
      const service = form.querySelector('[name="service"]')?.value || 'Signature Treatment';
      const date = form.querySelector('[name="date"]')?.value || 'Selected Date';
      const time = form.querySelector('[name="time"]')?.value || 'Morning (9:00 AM – 12:00 PM)';
      const guests = form.querySelector('[name="guests"]')?.value || '1 Guest';

      // Generate Reference Code
      const refCode = 'MIRA-' + Math.floor(100000 + Math.random() * 900000);

      // Handle Success View
      const formContainer = form.closest('.form-panel-content') || form.parentElement;
      const successView = formContainer.querySelector('.booking-success-view');

      if (successView) {
        const refSpan = successView.querySelector('.summary-ref-code');
        const nameSpan = successView.querySelector('.summary-guest-name');
        const serviceSpan = successView.querySelector('.summary-service-name');
        const dateTimeSpan = successView.querySelector('.summary-date-time');
        const phoneSpan = successView.querySelector('.summary-phone');

        if (refSpan) refSpan.textContent = refCode;
        if (nameSpan) nameSpan.textContent = name;
        if (serviceSpan) serviceSpan.textContent = service;
        if (dateTimeSpan) dateTimeSpan.textContent = `${date} • ${time}`;
        if (phoneSpan) phoneSpan.textContent = phone || email;

        form.style.display = 'none';
        successView.style.display = 'block';

        showToast(`Request submitted! Reference: ${refCode}`);
      } else {
        alert(`Thank you, ${name}!\n\nYour appointment request (${refCode}) for ${service} has been received. Our concierge will contact you via WhatsApp or phone within 2 hours to confirm your suite.`);
        form.reset();
        if (modal && modal.classList.contains('open')) {
          closeModal(modal);
        }
      }
    });
  });
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Reset form views inside modal after closing
  setTimeout(() => {
    const form = modal.querySelector('.appointment-request-form');
    const successView = modal.querySelector('.booking-success-view');
    if (form) {
      form.reset();
      form.style.display = 'block';
    }
    if (successView) {
      successView.style.display = 'none';
    }
  }, 400);
}

function selectServiceInDropdown(serviceName) {
  const dropdowns = document.querySelectorAll('select[name="service"]');
  dropdowns.forEach(select => {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) ||
          select.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
        select.selectedIndex = i;
        break;
      }
    }
  });
}

/* If user visited contact.html?service=Swedish+Massage, preselect */
function initPreselectedService() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  if (serviceParam) {
    selectServiceInDropdown(serviceParam);
  }
}

/* ==========================================================================
   8. NEWSLETTER SUBSCRIPTION & CONTACT INQUIRIES
   ========================================================================== */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input && input.value) {
        showToast('Welcome to the Mira Sanctuary Circle. Check your inbox soon.');
        input.value = '';
      }
    });
  });

  const generalForms = document.querySelectorAll('.general-inquiry-form');
  generalForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for reaching out. Our concierge has received your message.');
      form.reset();
    });
  });
}

/* ==========================================================================
   9. SCROLL REVEALS
   ========================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal-fade');
  if (!reveals.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('revealed'));
  }
}

/* ==========================================================================
   10. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8955A" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 20);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4500);
}
