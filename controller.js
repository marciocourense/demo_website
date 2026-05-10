window.onload = () => {
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');
    const hamburger = document.querySelector('.nav-toggle');
    const currentYear = document.getElementById('current-year');

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    const navBar = document.querySelector('.nav-bar');

    if (navMenu && hamburger) {
        const collapseBreakpoint = 880;

        const toggleNav = (e) => {
            if (e) e.stopPropagation();
            const open = navMenu.classList.toggle('is-active');
            hamburger.classList.toggle('is-active', open);
            hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
            hamburger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        };

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('is-active');
                hamburger.classList.remove('is-active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'Abrir menu');
            }
        });

        navItems.forEach((item) => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= collapseBreakpoint) {
                    navMenu.classList.remove('is-active');
                    hamburger.classList.remove('is-active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });

        hamburger.setAttribute('aria-label', 'Abrir menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.addEventListener('click', toggleNav);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navMenu.classList.remove('is-active');
                hamburger.classList.remove('is-active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > collapseBreakpoint) {
                navMenu.classList.remove('is-active');
                hamburger.classList.remove('is-active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const targetElement = document.querySelector(href);
            if (!targetElement) return;

            e.preventDefault();
            const headerOffset = navBar ? navBar.offsetHeight : 72;
            const top = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset - 8;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        if (!img.complete) {
                            img.onload = () => img.classList.add('loaded');
                            img.onerror = () => console.warn('Failed to load image:', img.src);
                        }
                        observer.unobserve(img);
                    }
                });
            },
            { rootMargin: '60px 0px', threshold: 0.06 }
        );

        lazyImages.forEach((img) => imageObserver.observe(img));
    } else {
        lazyImages.forEach((img) => img.classList.add('loaded'));
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ('IntersectionObserver' in window && !prefersReduced) {
        const revealObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-revealed');
                    obs.unobserve(entry.target);
                });
            },
            { rootMargin: '-40px 0px -8% 0px', threshold: 0.08 }
        );

        document.querySelectorAll('.fade-in-section').forEach((el) => {
            el.classList.add('await-reveal');
            revealObserver.observe(el);
        });
    } else {
        document.querySelectorAll('.fade-in-section').forEach((el) => el.classList.add('is-revealed'));
    }

    setTimeout(() => {
        ['assets/img/baltazar-portrait.jpg', 'assets/img/capa-delirio-realidade.jpg'].forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, 600);
};
