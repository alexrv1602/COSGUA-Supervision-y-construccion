/* ==========================================================================
   COSGUA SUPERVISIÓN Y CONSTRUCCIÓN - INTERACTIVE ENGINE & PRO ANIMATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initScrollReveal();
  initCardTiltEffects();
  initStatsCounter();
  initProjectFilter();
  initBudgetCalculator();
  initModalLightbox();
  initContactForm();
});

/* 1. Header Scroll Blur & Shrink */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

/* 2. Mobile Navigation Menu */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/* 3. Pro Scroll Reveal Animation Engine */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* 4. Interactive Card Glow & Mouse Movement */
function initCardTiltEffects() {
  const cards = document.querySelectorAll('.service-card, .hero-visual-card, .timeline-step, .calc-wrapper');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* 5. Animated Stats Counter */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let started = false;

  const checkScroll = () => {
    const section = document.querySelector('.hero-stats-grid');
    if (!section) return;
    const pos = section.getBoundingClientRect().top;
    const winHeight = window.innerHeight;

    if (pos < winHeight && !started) {
      started = true;
      statNumbers.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 1800;
        const stepTime = 25;
        const steps = duration / stepTime;
        const inc = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += inc;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          const formatted = target % 1 === 0 ? Math.floor(current).toLocaleString('es-GT') : current.toFixed(1);
          counter.textContent = `${prefix}${formatted}${suffix}`;
        }, stepTime);
      });
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll();
}

/* 6. Filterable Project Gallery */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* 7. Interactive Budget & Supervision Calculator */
function initBudgetCalculator() {
  const typeSelect = document.getElementById('calc-type');
  const areaInput = document.getElementById('calc-area');
  const levelSelect = document.getElementById('calc-level');
  const scopeSelect = document.getElementById('calc-scope');
  
  const displayPrice = document.getElementById('calc-display-price');
  const displayDuration = document.getElementById('calc-display-duration');
  const whatsappBtn = document.getElementById('calc-whatsapp-btn');

  function calculate() {
    if (!typeSelect || !areaInput || !displayPrice) return;

    const area = parseFloat(areaInput.value) || 0;
    const baseRates = {
      residencial: 45,
      comercial: 65,
      industrial: 80,
      infraestructura: 110
    };

    const levelMultipliers = {
      basica: 0.035,
      integral: 0.055,
      auditoria_bim: 0.075
    };

    const scopeMultipliers = {
      supervision_obra: 1.0,
      construccion_supervisada: 2.4
    };

    const selectedType = typeSelect.value;
    const selectedLevel = levelSelect.value;
    const selectedScope = scopeSelect.value;

    const estimatedProjectValue = area * (baseRates[selectedType] || 50) * 100;
    const supervisionFee = estimatedProjectValue * (levelMultipliers[selectedLevel] || 0.05) * (scopeMultipliers[selectedScope] || 1.0);
    
    let estimatedMonths = Math.ceil(area / 350) + 2;
    if (estimatedMonths < 3) estimatedMonths = 3;

    const formattedFee = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(supervisionFee);
    
    displayPrice.textContent = area > 0 ? formattedFee : '$0.00';
    if (displayDuration) displayDuration.textContent = area > 0 ? `${estimatedMonths} Meses Estimados de Ejecución` : '3-6 Meses Estimados';

    if (whatsappBtn) {
      const typeText = typeSelect.options[typeSelect.selectedIndex].text;
      const levelText = levelSelect.options[levelSelect.selectedIndex].text;
      const msg = `Hola Cosgua Supervisión y Construcción, me interesa cotizar una obra con los siguientes datos:%0A- Tipo: ${encodeURIComponent(typeText)}%0A- Área: ${area} m²%0A- Nivel: ${encodeURIComponent(levelText)}%0A- Estimado: ${encodeURIComponent(formattedFee)}`;
      whatsappBtn.href = `https://wa.me/50250000000?text=${msg}`;
    }
  }

  [typeSelect, areaInput, levelSelect, scopeSelect].forEach(el => {
    if (el) {
      el.addEventListener('input', calculate);
      el.addEventListener('change', calculate);
    }
  });

  calculate();
}

/* 8. Lightbox Modal */
function initModalLightbox() {
  const modal = document.getElementById('project-modal');
  const modalClose = document.querySelector('.modal-close');
  const projectCards = document.querySelectorAll('.project-card');

  const modalTitle = document.getElementById('modal-project-title');
  const modalTag = document.getElementById('modal-project-tag');
  const modalImage = document.getElementById('modal-project-img');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalSpecs = document.getElementById('modal-project-specs');

  if (!modal) return;

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.project-title')?.textContent || 'Proyecto';
      const tag = card.querySelector('.project-tag')?.textContent || 'Categoría';
      const imgSrc = card.querySelector('.project-img')?.src || '';
      const desc = card.getAttribute('data-desc') || '';
      const specs = card.getAttribute('data-specs') || '';

      if (modalTitle) modalTitle.textContent = title;
      if (modalTag) modalTag.textContent = tag;
      if (modalImage) modalImage.src = imgSrc;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalSpecs) modalSpecs.innerHTML = specs;

      modal.classList.add('active');
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* 9. Contact Form Simulation */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name')?.value || '';

    feedback.style.display = 'block';
    feedback.textContent = `¡Gracias, ${name}! Hemos recibido su mensaje. Un ingeniero de Cosgua se comunicará en breve.`;
    form.reset();

    setTimeout(() => {
      feedback.style.display = 'none';
    }, 5000);
  });
}
