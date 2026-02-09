window.onload = () => {
    // DOM Elements
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');
    const hamburger = document.querySelector('.nav-toggle');
    const currentYear = document.getElementById('current-year');
    
    // Set current year in footer
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Mobile Navigation Toggle
    const toggleNav = () => {
        navMenu.classList.toggle('is-active');
        hamburger.classList.toggle('is-active');
        
        // Toggle aria-expanded for accessibility
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
    };
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('is-active');
            hamburger.classList.remove('is-active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close mobile menu when clicking nav items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('is-active');
                hamburger.classList.remove('is-active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Lazy loading images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    
                    // Load the image if it's still not loaded
                    if (!img.complete) {
                        img.onload = () => {
                            img.classList.add('loaded');
                        };
                        img.onerror = () => {
                            console.warn('Failed to load image:', img.src);
                        };
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.classList.add('loaded');
        });
    }
    
    // Add hover effect to project cards on touch devices
    const isTouchDevice = () => {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    };
    
    if (isTouchDevice()) {
        document.querySelectorAll('.box.project-text').forEach(box => {
            box.addEventListener('touchstart', function() {
                this.classList.add('is-touched');
            }, { passive: true });
            
            box.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('is-touched');
                }, 150);
            }, { passive: true });
        });
    }
    
    // Add scroll-based animation triggers
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.box, .certification-box, .testimonial-box');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };
    
    // Initial check on load
    animateOnScroll();
    
    // Check on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            animateOnScroll();
        }, 100);
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            navMenu.classList.remove('is-active');
            hamburger.classList.remove('is-active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Initialize hamburger button accessibility
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('role', 'button');
    
    // Event Listeners
    hamburger.addEventListener('click', toggleNav);
    
    // Close menu on resize if switching to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('is-active');
            hamburger.classList.remove('is-active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Performance optimization: preload critical images
    const preloadImages = () => {
        const criticalImages = [
            'assets/img/marcio_profile.png',
            'assets/img/linkedin.png',
            'assets/img/github.png'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    };
    
    // Preload after page load
    setTimeout(preloadImages, 1000);
};
