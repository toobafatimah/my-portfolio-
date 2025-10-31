document.addEventListener('DOMContentLoaded', () => {
  // Theme: toggle + persistence
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const knob = document.getElementById('themeKnob');
  const toggleBtnMobile = document.getElementById('themeToggleMobile');
  const knobMobile = document.getElementById('themeKnobMobile');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const getStoredTheme = () => {
    try { return localStorage.getItem('theme'); } catch (_) { return null; }
  };
  const setStoredTheme = (val) => { try { localStorage.setItem('theme', val); } catch (_) {} };
  const isDark = () => root.classList.contains('dark');
  const setMetaTheme = () => {
    if (!metaTheme) return;
    metaTheme.setAttribute('content', isDark() ? '#0b0b0f' : '#ec4899');
  };
  const updateSwitchUI = () => {
    const dark = isDark();
    if (toggleBtn) toggleBtn.setAttribute('aria-checked', String(dark));
    if (toggleBtnMobile) toggleBtnMobile.setAttribute('aria-checked', String(dark));
    // Desktop knob
    if (knob) {
      if (dark) {
        knob.style.left = 'auto';
        knob.style.right = '0.25rem';
        knob.style.backgroundColor = '#ffffff';
      } else {
        knob.style.right = 'auto';
        knob.style.left = '0.25rem';
        knob.style.backgroundColor = '#ffffff';
      }
    }
    // Mobile knob
    if (knobMobile) {
      if (dark) {
        knobMobile.style.left = 'auto';
        knobMobile.style.right = '0.25rem';
        knobMobile.style.backgroundColor = '#ffffff';
      } else {
        knobMobile.style.right = 'auto';
        knobMobile.style.left = '0.25rem';
        knobMobile.style.backgroundColor = '#ffffff';
      }
    }
  };
  const applyTheme = (dark) => {
    root.classList.toggle('dark', dark);
    setMetaTheme();
    updateSwitchUI();
  };
  // Initialize UI/meta based on current class (set before paint in HTML)
  setMetaTheme();
  updateSwitchUI();
  // Toggle handler
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const nextDark = !isDark();
      applyTheme(nextDark);
      setStoredTheme(nextDark ? 'dark' : 'light');
    });
  }
  if (toggleBtnMobile) {
    toggleBtnMobile.addEventListener('click', () => {
      const nextDark = !isDark();
      applyTheme(nextDark);
      setStoredTheme(nextDark ? 'dark' : 'light');
    });
  }
  // Respect system changes if user didn't choose
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  if (!getStoredTheme()) {
    mql.addEventListener?.('change', (e) => applyTheme(e.matches));
  }

  const preloader = document.getElementById('preloader');
  const MIN_DURATION = 3000;
  const startTime = Date.now();
  const restore = () => {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  };
  if (preloader) {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const hide = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_DURATION - elapsed);
      window.setTimeout(() => {
        preloader.style.opacity = '0';
        window.setTimeout(() => {
          preloader.remove();
          restore();
          document.dispatchEvent(new Event('app:ready'));
        }, 450);
      }, remaining);
    };
    window.addEventListener('load', hide, { once: true });
    window.setTimeout(() => { if (document.body.contains(preloader)) hide(); }, 6000);
  } else {
    window.addEventListener('load', () => document.dispatchEvent(new Event('app:ready')), { once: true });
  }

  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const presetHeroHidden = () => {
    const hero = document.querySelector('section:first-of-type');
    if (!hero) return;
    const overline = hero.querySelector('p.text-pink-600') || hero.querySelector('p');
    const h1 = hero.querySelector('h1');
    const sub = hero.querySelector('p.text-xl, p.text-2xl') || hero.querySelectorAll('p')[1];
    const ctas = hero.querySelectorAll('div.flex.flex-wrap a');
    const socials = hero.querySelectorAll('div.flex.items-center.gap-3 a');
    const imgEl = hero.querySelector('img');
    if (window.gsap) {
      if (overline) gsap.set(overline, { opacity: 0, y: 12 });
      if (h1) gsap.set(h1, { opacity: 0, y: 24 });
      if (sub) gsap.set(sub, { opacity: 0, y: 16 });
      if (ctas.length) gsap.set(ctas, { opacity: 0, y: 14 });
      if (socials.length) gsap.set(socials, { opacity: 0, y: 10 });
      if (imgEl) gsap.set(imgEl, { opacity: 0, scale: 0.95 });
    } else {
      [overline, h1, sub, ...ctas, ...socials].forEach(el => { if (el) el.style.opacity = '0'; });
      if (imgEl) imgEl.style.opacity = '0';
    }
  };
  presetHeroHidden();

  // Sticky header behavior
  const header = document.querySelector('header');
  const navBar = document.getElementById('navBar');
  const onScroll = () => {
    const scrolled = window.scrollY > 10;
    if (header) header.classList.toggle('shadow-soft', scrolled);
    if (navBar) navBar.classList.toggle('translate-y-[-2px]', scrolled);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu interactions
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn && mobileMenu && window.gsap) {
    const overlay = mobileMenu.querySelector('div.absolute');
    const panel = mobileMenu.querySelector('nav');
    const closeBtn = document.getElementById('mobileCloseBtn');
    const toCloseIcon = () => {
      mobileBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M6 6l12 12M18 6l-12 12"/></svg>';
    };
    const toHamburger = () => {
      mobileBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/></svg>';
    };
    const openMenu = () => {
      mobileMenu.classList.remove('hidden');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      mobileBtn.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      const links = panel.querySelectorAll('a');
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.set(panel, { y: -12, opacity: 0, scale: 0.98, transformOrigin: 'top center' })
        .set(overlay, { opacity: 0 })
        .to(overlay, { opacity: 1, duration: 0.28 }, 0)
        .to(panel, { y: 0, opacity: 1, scale: 1, duration: 0.34 }, 0.02);
      if (links.length) {
        tl.from(links, { y: 10, opacity: 0, duration: 0.34, stagger: 0.06 }, '-=0.08');
      }
      if (closeBtn) {
        tl.fromTo(closeBtn, { scale: 0.9, opacity: 0, rotate: -90 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.28, ease: 'back.out(1.8)' }, 0.08);
      }
      toCloseIcon();
    };
    const closeMenu = () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.in' }, onComplete: () => {
        mobileMenu.classList.add('hidden');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }});
      tl.to(panel, { y: -10, opacity: 0, scale: 0.98, duration: 0.26 })
        .to(overlay, { opacity: 0, duration: 0.24 }, '-=0.18');
      toHamburger();
    };
    let open = false;
    mobileBtn.addEventListener('click', () => { open ? closeMenu() : openMenu(); open = !open; });
    overlay?.addEventListener('click', () => { if (open) { closeMenu(); open = false; } });
    closeBtn?.addEventListener('click', () => { if (open) { closeMenu(); open = false; } });
    mobileMenu.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => { if (open) { closeMenu(); open = false; } });
    });
  }

  // GSAP Animations
  if (window.gsap) {
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const initHero = () => {
      const hero = document.querySelector('section:first-of-type');
      if (!hero) return;
      const overline = hero.querySelector('p.text-pink-600') || hero.querySelector('p');
      const h1 = hero.querySelector('h1');
      const sub = hero.querySelector('p.text-xl, p.text-2xl') || hero.querySelectorAll('p')[1];
      const ctas = hero.querySelectorAll('div.flex.flex-wrap a');
      const socials = hero.querySelectorAll('div.flex.items-center.gap-3 a');
      const imgEl = hero.querySelector('img');
      const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      if (overline) heroTl.to(overline, { y: 0, opacity: 1, duration: 0.5 });
      if (h1) heroTl.to(h1, { y: 0, opacity: 1, duration: 0.7 }, '-=0.1');
      if (sub) heroTl.to(sub, { y: 0, opacity: 1, duration: 0.6 }, '-=0.2');
      if (ctas.length) heroTl.to(ctas, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, '-=0.2');
      if (socials.length) heroTl.to(socials, { y: 0, opacity: 1, duration: 0.4, stagger: 0.06 }, '-=0.3');
      if (imgEl && imgEl.getAttribute('src')) heroTl.to(imgEl, { scale: 1, opacity: 1, duration: 0.8 }, '-=0.5');
      const topBadge = hero.querySelector('button.absolute.-top-4');
      const bottomBadge = hero.querySelector('button.absolute.-bottom-4');
      if (topBadge) {
        gsap.to(topBadge, { y: -6, repeat: -1, yoyo: true, ease: 'sine.inOut', duration: 1.6 });
        gsap.from(topBadge, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'back.out(1.7)' });
      }
      if (bottomBadge) {
        gsap.to(bottomBadge, { y: 6, repeat: -1, yoyo: true, ease: 'sine.inOut', duration: 1.8 });
        gsap.from(bottomBadge, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'back.out(1.7)' });
      }
      const imgFrame = hero.querySelector('div.relative[class*="rounded-[32px]"]') ||
                       hero.querySelector('div.relative[class*="rounded-"]');
      if (imgFrame) {
        hero.addEventListener('mousemove', (e) => {
          const rect = hero.getBoundingClientRect();
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(imgFrame, { rotateY: relX * 6, rotateX: -relY * 6, transformPerspective: 600, duration: 0.3, ease: 'power2.out' });
        });
        hero.addEventListener('mouseleave', () => {
          gsap.to(imgFrame, { rotateX: 0, rotateY: 0, duration: 0.4, ease: 'power2.out' });
        });
      }
      if (imgEl && imgEl.getAttribute('src')) {
        gsap.to(imgEl, {
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
          scale: 1.03
        });
      }
    };

    document.addEventListener('app:ready', initHero, { once: true });

    const headerLogoChip = document.querySelector('header a[href="#home"] div.rounded-full');
    if (headerLogoChip) {
      gsap.from(headerLogoChip, { opacity: 0, y: -6, duration: 0.5, ease: 'power2.out' });
    }
    // Navbar animations
    const navLinks = document.querySelectorAll('header nav a');
    if (navLinks.length) {
      gsap.from(navLinks, { y: -10, opacity: 0, duration: 0.5, ease: 'power2.out', stagger: 0.06, delay: 0.05 });
      navLinks.forEach((link) => {
        link.style.position = 'relative';
        const underline = document.createElement('span');
        underline.className = 'nav-underline';
        Object.assign(underline.style, {
          position: 'absolute', left: '10%', right: '10%', bottom: '-6px', height: '2px',
          background: 'linear-gradient(90deg, #ec4899, #8b5cf6)', borderRadius: '2px',
          transform: 'scaleX(0)', transformOrigin: 'center',
        });
        link.appendChild(underline);
        link.addEventListener('mouseenter', () => {
          gsap.to(link, { y: -2, duration: 0.18, ease: 'power3.out' });
          gsap.to(underline, { scaleX: 1, duration: 0.22, ease: 'power3.out' });
        });
        link.addEventListener('mouseleave', () => {
          gsap.to(link, { y: 0, duration: 0.22, ease: 'power3.out' });
          gsap.to(underline, { scaleX: 0, duration: 0.24, ease: 'power3.inOut' });
        });
      });
    }

    // Logo and CTA hover
    const logoChip = document.querySelector('header a[href="#home"] div.rounded-full');
    if (logoChip) {
      logoChip.style.willChange = 'transform';
      logoChip.addEventListener('mouseenter', () => gsap.to(logoChip, { rotate: 3, scale: 1.04, duration: 0.22, ease: 'power2.out' }));
      logoChip.addEventListener('mouseleave', () => gsap.to(logoChip, { rotate: 0, scale: 1, duration: 0.25, ease: 'power2.out' }));
    }
    const cta = document.querySelector('header a[href="#contact"].inline-flex');
    if (cta) {
      cta.style.willChange = 'transform';
      cta.addEventListener('mouseenter', () => gsap.to(cta, { y: -2, boxShadow: '0 10px 18px -10px rgba(236,72,153,0.45)', duration: 0.22, ease: 'power2.out' }));
      cta.addEventListener('mouseleave', () => gsap.to(cta, { y: 0, boxShadow: '0 10px 25px -10px rgba(0,0,0,0)', duration: 0.25, ease: 'power2.out' }));
    }
    if (document.querySelector('.quick-services .qcard')) {
      gsap.from('.quick-services .qcard', { y: 18, opacity: 0, duration: 0.6, delay: 0.25, stagger: 0.08, ease: 'power2.out' });
    }

    // Services cards
    gsap.from('.service-card', {
      scrollTrigger: { trigger: '#services', start: 'top 80%' },
      y: 24,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out'
    });

    // Portfolio items
    gsap.from('.portfolio-item', {
      scrollTrigger: { trigger: '#portfolio', start: 'top 80%' },
      y: 24,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power2.out'
    });

    // Skills: animate bar widths when section enters
    const animateSkills = () => {
      const bars = document.querySelectorAll('#skills .skill-bar');
      bars.forEach((bar) => {
        const target = parseInt(bar.getAttribute('data-target') || '0', 10);
        const knob = bar.parentElement.querySelector('.skill-knob');
        const tl = gsap.timeline();
        tl.fromTo(bar, { width: '0%' }, { width: target + '%', duration: 1.2, ease: 'power2.out' });
        if (knob) tl.fromTo(knob, { left: '0%' }, { left: target + '%', duration: 1.2, ease: 'power2.out' }, '<');
      });
      gsap.from('#skills [class*="rounded-[22px]"]', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out'
      });
    };

    if (window.ScrollTrigger) {
      ScrollTrigger.create({ trigger: '#skills', start: 'top 75%', once: true, onEnter: animateSkills });
    } else {
      // Fallback: IntersectionObserver
      const skillsEl = document.getElementById('skills');
      if (skillsEl && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, obs) => {
          if (entries.some(e => e.isIntersecting)) { animateSkills(); obs.disconnect(); }
        }, { root: null, threshold: 0.2 });
        io.observe(skillsEl);
      } else {
        // Last resort: run after load
        animateSkills();
      }
    }

    // Safety: ensure bars are filled even if no animation ran
    const ensureSkillWidths = () => {
      const bars = document.querySelectorAll('#skills .skill-bar');
      let anyZero = false;
      bars.forEach((bar) => {
        const computed = parseFloat(getComputedStyle(bar).width);
        if (!computed || computed === 0) {
          anyZero = true;
          const target = parseInt(bar.getAttribute('data-target') || '0', 10);
          bar.style.width = target + '%';
          const knob = bar.parentElement.querySelector('.skill-knob');
          if (knob) knob.style.left = target + '%';
        }
      });
      return !anyZero;
    };
    // Run after load and on first scroll as a backup
    window.setTimeout(ensureSkillWidths, 800);
    window.addEventListener('scroll', ensureSkillWidths, { once: true, passive: true });

    // Experience: reveal each item
    gsap.from('#experience .exp-item', {
      scrollTrigger: { trigger: '#experience', start: 'top 80%' },
      y: 24,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out'
    });

    // About (guard if elements exist)
    const aboutImgs = document.querySelectorAll('#about img');
    if (aboutImgs.length) {
      gsap.from(aboutImgs, {
        scrollTrigger: { trigger: '#about', start: 'top 80%' },
        x: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
    const aboutContent = document.querySelectorAll('#about h2, #about p, #about a');
    if (aboutContent.length) {
      gsap.from(aboutContent, {
        scrollTrigger: { trigger: '#about', start: 'top 80%' },
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out'
      });
    }

    // Testimonials (avoid bracket class selector)
    gsap.from('#testimonials [class*="rounded-[22px]"]', {
      scrollTrigger: { trigger: '#testimonials', start: 'top 80%' },
      y: 20,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out'
    });

    // Hover animations for cards
    const addHoverAnim = (selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        el.style.transformOrigin = 'center';
        el.style.willChange = 'transform';
        el.addEventListener('mouseenter', () => {
          gsap.to(el, { duration: 0.25, y: -6, scale: 1.03, ease: 'power3.out' });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(el, { duration: 0.3, y: 0, scale: 1, ease: 'power3.out' });
        });
      });
    };

    addHoverAnim('.service-card');
    addHoverAnim('.portfolio-item');
    addHoverAnim('#experience .exp-item');
    addHoverAnim('#about [class*="rounded-[18px]"]');
    addHoverAnim('#skills [class*="rounded-[22px]"]');
    addHoverAnim('#testimonials [class*="rounded-[22px]"]');
    addHoverAnim('#contact [class*="rounded-[18px]"]');
    addHoverAnim('#contact [class*="rounded-[22px]"]');
    // Footer hovers
    addHoverAnim('footer .social a');
    addHoverAnim('footer .flex.flex-wrap a');
    // Mobile menu link hovers
    addHoverAnim('#mobileMenu nav a');

    // Contact
    gsap.from('#contact h2, #contact p, #contact form, #contact .grid > a', {
      scrollTrigger: { trigger: '#contact', start: 'top 80%' },
      y: 18,
      opacity: 0,
      duration: 0.7,
      stagger: 0.06,
      ease: 'power2.out'
    });

    // Portfolio Lightbox (works with or without GSAP)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxOverlay = lightbox ? lightbox.querySelector('div.absolute') : null;
    const disableScroll = () => { document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden'; };
    const enableScroll = () => { document.documentElement.style.overflow = ''; document.body.style.overflow = ''; };
    const openLightbox = (src, alt) => {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = src || '';
      lightboxImg.alt = alt || 'Preview';
      lightbox.classList.remove('hidden');
      disableScroll();
      if (window.gsap && lightboxOverlay) {
        gsap.set(lightboxImg, { opacity: 0, scale: 0.96 });
        gsap.set(lightboxOverlay, { opacity: 0 });
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        tl.to(lightboxOverlay, { opacity: 1, duration: 0.2 })
          .to(lightboxImg, { opacity: 1, scale: 1, duration: 0.24 }, '-=0.05');
      }
    };
    const closeLightbox = () => {
      if (!lightbox) return;
      const finish = () => { lightbox.classList.add('hidden'); lightboxImg && (lightboxImg.src = ''); enableScroll(); };
      if (window.gsap && lightboxOverlay && lightboxImg) {
        const tl = gsap.timeline({ defaults: { ease: 'power2.in' }, onComplete: finish });
        tl.to(lightboxImg, { opacity: 0, scale: 0.96, duration: 0.18 })
          .to(lightboxOverlay, { opacity: 0, duration: 0.18 }, '-=0.12');
      } else {
        finish();
      }
    };
    // Wire up clicks on portfolio cards (images only, skip PDFs)
    document.querySelectorAll('.portfolio-item:not([data-type="pdf"])').forEach((card) => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const img = card.querySelector('img');
        if (!img) return;
        const full = img.getAttribute('data-full') || img.getAttribute('src');
        openLightbox(full, img.getAttribute('alt') || 'Preview');
      });
    });
    // Close interactions
    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxOverlay?.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox && !lightbox.classList.contains('hidden')) closeLightbox(); });
  }
  
  // Contact form handler (placeholder)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(contactForm).entries());
      console.log('Contact form submission:', data);
      alert('Thanks! Your message has been sent.');
      contactForm.reset();
    });
  }

  // PDF Modal Viewer
  (() => {
    const pdfModal = document.getElementById('pdfModal');
    const pdfTitle = document.getElementById('pdfTitle');
    const pdfFrame = document.getElementById('pdfFrame');
    const pdfClose = document.getElementById('pdfClose');
    const pdfPrev = document.getElementById('pdfPrev');
    const pdfNext = document.getElementById('pdfNext');
    const pdfOverlay = pdfModal ? pdfModal.querySelector('div.absolute') : null;
    if (!pdfModal || !pdfFrame) return;

    let baseSrc = '';
    let currentPage = 1;
    let maxPages = Infinity;

    const disableScroll = () => { document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden'; };
    const enableScroll = () => { document.documentElement.style.overflow = ''; document.body.style.overflow = ''; };
    const setFrame = () => {
      // Use minimal viewer UI and fit-to-width to reduce heavy rendering
      const params = [`page=${currentPage}`, 'zoom=page-width', 'pagemode=none', 'toolbar=0', 'navpanes=0', `ts=${Date.now()}`];
      const nextSrc = `${baseSrc}#${params.join('&')}`;
      // Smooth update to reduce jank perception
      try { pdfFrame.style.opacity = '0'; } catch (_) {}
      pdfFrame.onload = () => { try { pdfFrame.style.opacity = '1'; } catch (_) {} };
      pdfFrame.src = nextSrc;
    };
    const openPdf = (src, title, pages) => {
      baseSrc = src || '';
      currentPage = 1;
      maxPages = Number.isFinite(parseInt(pages, 10)) ? parseInt(pages, 10) : Infinity;
      if (pdfTitle) pdfTitle.textContent = title || 'Document';
      setFrame();
      pdfModal.classList.remove('hidden');
      disableScroll();
      if (window.gsap && pdfOverlay) {
        const panel = document.getElementById('pdfPanel');
        gsap.set(pdfOverlay, { opacity: 0 });
        gsap.set(panel, { opacity: 0, y: 12, scale: 0.98, transformOrigin: 'center' });
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        tl.to(pdfOverlay, { opacity: 1, duration: 0.2 })
          .to(panel, { opacity: 1, y: 0, scale: 1, duration: 0.28 }, '-=0.06');
      }
    };
    const closePdf = () => {
      const finish = () => { 
        pdfModal.classList.add('hidden'); 
        // Clear src so the same document can reload next time
        try { pdfFrame.src = 'about:blank'; } catch (_) {}
        enableScroll(); 
      };
      if (window.gsap && pdfOverlay) {
        const panel = document.getElementById('pdfPanel');
        const tl = gsap.timeline({ defaults: { ease: 'power2.in' }, onComplete: finish });
        tl.to(panel, { opacity: 0, y: 10, scale: 0.98, duration: 0.18 })
          .to(pdfOverlay, { opacity: 0, duration: 0.16 }, '-=0.12');
      } else {
        finish();
      }
    };

    // Bind portfolio PDF cards
    document.querySelectorAll('.portfolio-item[data-type="pdf"]').forEach((card) => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const src = card.getAttribute('data-src');
        const title = card.getAttribute('data-title') || 'Document';
        const pages = card.getAttribute('data-pages');
        openPdf(src, title, pages);
      });
    });

    // Controls
    pdfPrev?.addEventListener('click', () => {
      if (currentPage > 1) { currentPage -= 1; setFrame(); }
    });
    pdfNext?.addEventListener('click', () => {
      if (currentPage < maxPages) { currentPage += 1; setFrame(); }
    });
    pdfClose?.addEventListener('click', closePdf);
    pdfOverlay?.addEventListener('click', closePdf);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pdfModal.classList.contains('hidden')) closePdf(); });
    // Delegated fallback (in case direct binding fails due to dynamic DOM states)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest && e.target.closest('#pdfClose');
      if (btn && !pdfModal.classList.contains('hidden')) {
        e.preventDefault();
        closePdf();
      }
    });
  })();

  // Always-visible two-line descriptions under portfolio cards
  (function addPortfolioDescriptions() {
    const cards = document.querySelectorAll('.portfolio-item');
    cards.forEach((card, idx) => {
      if (card.querySelector('.p-desc')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'p-desc relative px-4 md:px-5 pt-3 pb-16';
      const line2 = document.createElement('p');
      line2.className = 'text-[12px] md:text-[13px] text-charcoal/60 leading-snug';
      if (idx === 0) {
        line2.textContent = 'An English language session   workshop brochure. Engaging & Unique';
      } else if (idx === 1) {
        line2.textContent = 'Social media post: clean and professional design for a corporate audience, emphasizing clarity and organization.';
      } else if (idx === 2) {
        line2.textContent = 'Modern presentation with bold visuals for copy writing lessons with a corporate.';
      } else if (idx === 3) {
        line2.textContent = 'An elegant and timeless logo designed for a writing club.';
      } else if (idx === 4) {
        line2.textContent = 'Warm and inviting brochure showcasing restaurant details and dishes of "TRATTORIA DI NONNA"';
      } else if (idx === 5) {
        line2.textContent = 'Mystery-themed poster blending cinematic visuals on a double exposure';
      } else if (idx === 6) {
        line2.textContent = 'Modern cover design for a digital marketing campaign presentation.';
      } else if (idx === 7) {
        line2.textContent = 'Vibrant presentation cover promoting a food and dining campaign.';
      } else if (idx === 8) {
        line2.textContent = 'Professional layout designed for a brand strategy report.';
      } else if (idx === 9) {
        line2.textContent = 'Bold fitness poster highlighting strength and motivation.';
      } else if (idx === 10) {
        line2.textContent = 'Elegant café logo combining rustic charm with modern style.';
      } else if (idx === 11) {
        line2.textContent = 'Eye-catching burger ad design for a food promotion campaign.';
      } else {
        line2.textContent = 'A concise two-line preview of the work and style.';
      }
      wrapper.appendChild(line2);
      card.appendChild(wrapper);
    });
  })();

// Back to Top button behavior
const backToTop = document.getElementById('backToTop');
if (backToTop && window.gsap) {
  let visible = false;
  const showBtn = () => {
    if (visible) return; visible = true;
    backToTop.classList.remove('hidden');
    gsap.fromTo(backToTop, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'power2.out' });
  };
  const hideBtn = () => {
    if (!visible) return; visible = false;
    gsap.to(backToTop, { autoAlpha: 0, scale: 0.85, duration: 0.2, ease: 'power2.out', onComplete: () => backToTop.classList.add('hidden') });
  };
  const onWinScroll = () => {
    if (window.scrollY > 300) showBtn(); else hideBtn();
  };
  window.addEventListener('scroll', onWinScroll, { passive: true });
  onWinScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  backToTop.addEventListener('mouseenter', () => {
    gsap.to(backToTop, { y: -3, boxShadow: '0 12px 20px -12px rgba(0,0,0,0.25)', duration: 0.2, ease: 'power2.out' });
  });
  backToTop.addEventListener('mouseleave', () => {
    gsap.to(backToTop, { y: 0, boxShadow: '0 10px 25px -10px rgba(0,0,0,0.08)', duration: 0.22, ease: 'power2.out' });
  });
}

});
