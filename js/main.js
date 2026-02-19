document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,                    // De duur van de scroll (hoger = trager/vloeiender)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // De versnellingscurve
        orientation: 'vertical',          // Scrollrichting
        smoothWheel: true,                // Zacht scrollen voor muiswiel
        wheelMultiplier: 1,               // Snelheid van het muiswiel
        touchMultiplier: 2,               // Snelheid op touchscreens
        infinite: false,                  // Geen oneindige scroll
    });

    // Request Animation Frame loop for Lenis
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Clear anchor links handling with Lenis
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return; // Skip if just #

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                lenis.scrollTo(targetElement, {
                    duration: 1.5 // Snelheid voor anker-links zoals gevraagd
                });
            }
        });
    });

    // Scroll Effect (Header)
    const header = document.getElementById('main-header');

    if (header) {
        // Use Lenis scroll event for better integration
        lenis.on('scroll', (e) => {
            if (e.scroll > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Open/Sluit Menu
    const menuTrigger = document.querySelector('.menu-trigger');
    const menuClose = document.querySelector('.menu-close');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');

    if (menuTrigger && fullscreenMenu && menuClose) {
        menuTrigger.addEventListener('click', () => {
            fullscreenMenu.classList.add('active');
            lenis.stop(); // Stop scroll when menu is open
        });

        menuClose.addEventListener('click', () => {
            fullscreenMenu.classList.remove('active');
            lenis.start(); // Resume scroll when menu is closed
        });
    }

    // Afbeeldingen wisselen op hover
    const menuLinks = document.querySelectorAll('.menu-nav a');
    const menuImages = document.querySelectorAll('.menu-image');

    menuLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const imageId = link.dataset.image;
            menuImages.forEach(img => {
                img.classList.remove('active');
                if (img.dataset.id === imageId) {
                    img.classList.add('active');
                }
            });
        });
    });
    // Scroll Reveal Animation (Generic)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length > 0) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        // Calculate index for stagger effect based on siblings in the same container
                        const parent = element.parentElement;
                        const siblings = Array.from(parent.children).filter(child => child.classList.contains('scroll-reveal'));
                        const index = siblings.indexOf(element);

                        // Add staggered delay based on index (0.1s increment)
                        if (index !== -1) {
                            element.style.transitionDelay = `${index * 0.1}s`;
                        }

                        element.classList.add('revealed');
                        observer.unobserve(element);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            revealElements.forEach(el => observer.observe(el));
        } else {
            // Fallback for older browsers or if disabled
            revealElements.forEach(el => el.classList.add('revealed'));
        }
    }
});
