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

                // Close menu if open
                if (fullscreenMenu && fullscreenMenu.classList.contains('active')) {
                    fullscreenMenu.classList.remove('active');
                    lenis.start();
                }

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

    // Reveal On Scroll Animation (Specific for contact section)
    const revealOnScrollElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealOnScrollElements.length > 0) {
        if ('IntersectionObserver' in window) {
            const observer2 = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer2.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            revealOnScrollElements.forEach(el => observer2.observe(el));
        } else {
            // Fallback for older browsers or if disabled
            revealOnScrollElements.forEach(el => el.classList.add('is-visible'));
        }
    }

    // 3. Contact Reservation Popup Modal
    const showReservationPopup = () => {
        // Check if already shown in this session
        if (sessionStorage.getItem('reservationPopupShown')) {
            return;
        }

        // Determine language from html lang attribute
        const htmlLang = document.documentElement.lang.toLowerCase();
        let lang = 'nl';
        if (htmlLang.startsWith('de')) {
            lang = 'de';
        } else if (htmlLang.startsWith('en')) {
            lang = 'en';
        }

        // Define translations
        const contentData = {
            nl: {
                title: 'Reserveren?',
                text: 'Bel naar <a href="tel:+31111671785" class="modal-link">+31 (0)111 671 785</a> of mail naar <a href="mailto:info@landenzee.nl" class="modal-link">info@landenzee.nl</a>.',
                btnCall: 'BEL ONS',
                btnMail: 'E-MAIL ONS'
            },
            de: {
                title: 'Reservieren?',
                text: 'Rufen Sie uns an unter <a href="tel:+31111671785" class="modal-link">+31 (0)111 671 785</a> oder schreiben Sie eine E-Mail an <a href="mailto:info@landenzee.nl" class="modal-link">info@landenzee.nl</a>.',
                btnCall: 'ANRUFEN',
                btnMail: 'E-MAIL SENDEN'
            },
            en: {
                title: 'Reservations?',
                text: 'Call us at <a href="tel:+31111671785" class="modal-link">+31 (0)111 671 785</a> or email us at <a href="mailto:info@landenzee.nl" class="modal-link">info@landenzee.nl</a>.',
                btnCall: 'CALL US',
                btnMail: 'EMAIL US'
            }
        };

        const t = contentData[lang];

        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'custom-modal-overlay';
        overlay.id = 'booking-modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'booking-modal-title');

        // Create modal structure
        overlay.innerHTML = `
            <div class="custom-modal-card">
                <button class="custom-modal-close" id="booking-modal-close" aria-label="Sluit pop-up">&times;</button>
                <div class="custom-modal-content">
                    <h2 class="custom-modal-title" id="booking-modal-title">${t.title}</h2>
                    <p class="custom-modal-text">${t.text}</p>
                    <div class="custom-modal-actions">
                        <a href="tel:+31111671785" class="modal-btn btn-call">${t.btnCall}</a>
                        <a href="mailto:info@landenzee.nl" class="modal-btn btn-mail">${t.btnMail}</a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const closeBtn = overlay.querySelector('#booking-modal-close');

        // Function to close modal
        const closeModal = () => {
            overlay.classList.remove('active');
            sessionStorage.setItem('reservationPopupShown', 'true');
            if (typeof lenis !== 'undefined') {
                lenis.start();
            }
            // Remove from DOM after transition completes
            setTimeout(() => {
                overlay.remove();
            }, 400);
        };

        // Event listeners
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                closeModal();
            }
        });

        // Show modal with a 2-second delay
        setTimeout(() => {
            overlay.classList.add('active');
            if (typeof lenis !== 'undefined') {
                lenis.stop();
            }
        }, 2000);
    };

    // Trigger popup
    showReservationPopup();
});
