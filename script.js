/**
 * Gagana Developer Portfolio - Main Interactive Script
 * Pure Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark Mode)
  // Default Appearance Mode: Light Theme (per instructions)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to 'light'
  const savedTheme = localStorage.getItem('gagana_portfolio_theme') || 'light';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('gagana_portfolio_theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        `Current theme: ${theme}. Click to switch to ${theme === 'light' ? 'dark' : 'light'} theme.`
      );
    }
  }

  // -------------------------------------------------------------------------
  // 1b. Accent Palette Manager (Electric Sunset, Cyber Violet, Emerald, Azure)
  // -------------------------------------------------------------------------
  const paletteToggleBtn = document.getElementById('palette-toggle-btn');
  const paletteDropdown = document.getElementById('palette-dropdown');
  const paletteChoiceBtns = document.querySelectorAll('.palette-choice-btn');

  const paletteNames = {
    sunset: 'Electric Sunset',
    cyber: 'Cyber Violet',
    emerald: 'Emerald Tech',
    sapphire: 'Ocean Azure'
  };

  const savedPalette = localStorage.getItem('gagana_portfolio_palette') || 'sunset';
  setPalette(savedPalette, false);

  if (paletteToggleBtn && paletteDropdown) {
    paletteToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = paletteDropdown.classList.contains('show');
      if (isOpen) {
        closePaletteDropdown();
      } else {
        openPaletteDropdown();
      }
    });

    document.addEventListener('click', (e) => {
      if (!paletteDropdown.contains(e.target) && !paletteToggleBtn.contains(e.target)) {
        closePaletteDropdown();
      }
    });
  }

  function openPaletteDropdown() {
    if (paletteDropdown && paletteToggleBtn) {
      paletteDropdown.classList.add('show');
      paletteDropdown.setAttribute('aria-hidden', 'false');
      paletteToggleBtn.setAttribute('aria-expanded', 'true');
    }
  }

  function closePaletteDropdown() {
    if (paletteDropdown && paletteToggleBtn) {
      paletteDropdown.classList.remove('show');
      paletteDropdown.setAttribute('aria-hidden', 'true');
      paletteToggleBtn.setAttribute('aria-expanded', 'false');
    }
  }

  paletteChoiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const palette = btn.getAttribute('data-palette');
      if (palette) {
        setPalette(palette, true);
        closePaletteDropdown();
      }
    });
  });

  function setPalette(palette, showNotification = true) {
    htmlRoot.setAttribute('data-palette', palette);
    localStorage.setItem('gagana_portfolio_palette', palette);

    paletteChoiceBtns.forEach(btn => {
      if (btn.getAttribute('data-palette') === palette) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (showNotification) {
      const title = paletteNames[palette] || palette;
      showToast(`Applied ${title} palette!`);
    }
  }

  // -------------------------------------------------------------------------
  // 2. Mobile Drawer Navigation
  // -------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (mobileDrawer && drawerBackdrop) {
      mobileDrawer.classList.add('open');
      drawerBackdrop.classList.add('active');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      drawerBackdrop.setAttribute('aria-hidden', 'false');
      if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (mobileDrawer && drawerBackdrop) {
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('active');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      drawerBackdrop.setAttribute('aria-hidden', 'true');
      if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // -------------------------------------------------------------------------
  // 3. Active Navigation Spy & Smooth Scrolling
  // -------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const observedSections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 120;

    observedSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // -------------------------------------------------------------------------
  // 4. Skills Category Filtering
  // -------------------------------------------------------------------------
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillGroups = document.querySelectorAll('.skill-group-wrapper');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');

      // Update active tab styling
      skillTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter groups
      skillGroups.forEach(group => {
        const category = group.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          group.style.display = 'block';
          group.style.opacity = '1';
        } else {
          group.style.display = 'none';
          group.style.opacity = '0';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 5. Project Filtering Tabs
  // -------------------------------------------------------------------------
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-project-filter');

      // Update active filter button
      projectFilterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter project cards
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || cardCategory.includes(filterValue)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 6. Copy to Clipboard Functionality
  // -------------------------------------------------------------------------
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-clipboard');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for non-https or restricted environments
          const tempInput = document.createElement('textarea');
          tempInput.value = textToCopy;
          tempInput.style.position = 'fixed';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        showToast(`Copied "${textToCopy}" to clipboard!`);
      } catch (err) {
        showToast(`Copied: ${textToCopy}`);
      }
    });
  });

  // -------------------------------------------------------------------------
  // 7. Interactive Contact Drafter / Mailto Composer
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('sender-name')?.value.trim() || '';
      const email = document.getElementById('sender-email')?.value.trim() || '';
      const subject = document.getElementById('msg-subject')?.value.trim() || 'Portfolio Inquiry';
      const message = document.getElementById('msg-body')?.value.trim() || '';

      const fullSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`);
      const fullBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent via Gagana's Developer Portfolio`
      );

      const mailtoUrl = `mailto:gaganagagana13877@gmail.com?subject=${fullSubject}&body=${fullBody}`;

      showToast('Opening default email client...');
      window.location.href = mailtoUrl;
    });
  }

  // -------------------------------------------------------------------------
  // 8. Printable Resume Modal
  // -------------------------------------------------------------------------
  const resumeModal = document.getElementById('resume-modal');
  const resumeOpenBtns = [
    document.getElementById('resume-open-btn'),
    document.getElementById('hero-resume-trigger'),
    document.getElementById('drawer-resume-btn')
  ];
  const closeModalBtn = document.getElementById('close-modal-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');

  function openResumeModal() {
    if (resumeModal) {
      resumeModal.classList.add('open');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeDrawer();
    }
  }

  function closeResumeModal() {
    if (resumeModal) {
      resumeModal.classList.remove('open');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  resumeOpenBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', openResumeModal);
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeResumeModal);

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResumeModal();
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Handle ESC key for modals, drawers, and dropdowns
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeResumeModal();
      closeDrawer();
      closePaletteDropdown();
    }
  });

  // -------------------------------------------------------------------------
  // 9. Toast Notifications
  // -------------------------------------------------------------------------
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // -------------------------------------------------------------------------
  // 10. Live Time Display (Udupi, Karnataka - IST)
  // -------------------------------------------------------------------------
  const liveTimeText = document.getElementById('live-time-text');

  function updateLocalTime() {
    if (!liveTimeText) return;

    try {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat([], options);
      const istTime = formatter.format(new Date());
      liveTimeText.textContent = `Udupi, IN · ${istTime} IST`;
    } catch (e) {
      liveTimeText.textContent = `Udupi, Karnataka (IST)`;
    }
  }

  updateLocalTime();
  setInterval(updateLocalTime, 1000);

  // -------------------------------------------------------------------------
  // 11. Dynamic Current Year in Footer
  // -------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
