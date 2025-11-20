/* ==========================================
   ANIMATIONS.JS - Advanced Animations
   Scroll reveal, parallax, magnetic buttons, theme toggle
   ========================================== */

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================
   Theme Toggle
   ========================================== */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const loaderLogo = document.getElementById('loaderLogo');
    const headerLogo = document.getElementById('headerLogo');

    // Function to update logos based on theme
    function updateLogos(theme) {
        const logoSrc = theme === 'light' ? 'whitemode.png' : 'logo.png';
        if (loaderLogo) loaderLogo.src = logoSrc;
        if (headerLogo) headerLogo.src = logoSrc;
    }

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply initial theme
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateLogos(savedTheme);
    } else if (!systemPrefersDark) {
        document.documentElement.setAttribute('data-theme', 'light');
        updateLogos('light');
    }

    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateLogos(newTheme);

        // Track theme change in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                'theme': newTheme
            });
        }
    });
}

/* ==========================================
   Parallax Hero Text
   ========================================== */
function initParallax() {
    if (prefersReducedMotion) return;

    const heroTitle = document.querySelector('#home .hero-title');
    const homeSection = document.getElementById('home');

    if (!heroTitle || !homeSection) return;

    // Parallax on scroll within section
    homeSection.addEventListener('scroll', () => {
        const scrolled = homeSection.scrollTop;
        const parallaxSpeed = 0.3;

        heroTitle.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });

    // Also add subtle mouse parallax effect
    homeSection.addEventListener('mousemove', (e) => {
        const rect = homeSection.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const moveX = (mouseX - centerX) / centerX * 10;
        const moveY = (mouseY - centerY) / centerY * 10;

        heroTitle.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    // Reset on mouse leave
    homeSection.addEventListener('mouseleave', () => {
        heroTitle.style.transform = 'translate(0, 0)';
    });
}

/* ==========================================
   Magnetic Button Hover
   ========================================== */
function initMagneticButtons() {
    if (prefersReducedMotion) return;

    // Select all buttons that should have magnetic effect
    const magneticElements = document.querySelectorAll('.submit-btn, .cookie-btn, [data-nav="contact"][style*="padding"]');

    magneticElements.forEach(btn => {
        btn.classList.add('magnetic-btn');

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            // Magnetic pull strength
            const pullStrength = 0.3;

            btn.style.transform = `translate(${deltaX * pullStrength}px, ${deltaY * pullStrength}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // Also add magnetic effect to nav links in side nav
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            const pullStrength = 0.15;

            link.style.transform = `translate(${deltaX * pullStrength}px, ${deltaY * pullStrength}px)`;
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translate(0, 0)';
        });
    });
}

/* ==========================================
   Image Load Blur-to-Sharp Effect
   ========================================== */
function initImageLoadEffect() {
    if (prefersReducedMotion) return;

    // Override the default image load animation in projects.js
    // This is handled by modifying the createProjectCard function
    // We'll add a mutation observer to catch new images

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    const images = node.querySelectorAll ? node.querySelectorAll('img') : [];
                    images.forEach(applyBlurEffect);

                    if (node.tagName === 'IMG') {
                        applyBlurEffect(node);
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Apply to existing images
    document.querySelectorAll('.project-image img').forEach(applyBlurEffect);
}

function applyBlurEffect(img) {
    if (img.dataset.blurApplied) return;
    img.dataset.blurApplied = 'true';

    // Remove default animation and apply blur effect
    img.style.animation = 'none';
    img.style.opacity = '0';
    img.style.filter = 'blur(20px)';
    img.style.transform = 'scale(1.05)';
    img.style.transition = 'opacity 0.6s ease, filter 0.6s ease, transform 0.6s ease';

    // When image loads, remove blur
    if (img.complete) {
        setTimeout(() => {
            img.style.opacity = '1';
            img.style.filter = 'blur(0)';
            img.style.transform = 'scale(1)';
        }, 50);
    } else {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
            img.style.filter = 'blur(0)';
            img.style.transform = 'scale(1)';
        });
    }
}

/* ==========================================
   Scroll Reveal Animations
   ========================================== */
function initScrollReveal() {
    if (prefersReducedMotion) return;

    // Create intersection observer for reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optionally stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements that should reveal on scroll
    const revealElements = document.querySelectorAll('.reveal-item');
    revealElements.forEach(el => revealObserver.observe(el));

    // Also set up observer for dynamically added content
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (node.classList && node.classList.contains('reveal-item')) {
                        revealObserver.observe(node);
                    }
                    const revealChildren = node.querySelectorAll ? node.querySelectorAll('.reveal-item') : [];
                    revealChildren.forEach(child => revealObserver.observe(child));
                }
            });
        });
    });

    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/* ==========================================
   Section Transition Reveal
   ========================================== */
function initSectionReveal() {
    if (prefersReducedMotion) return;

    // Watch for section changes and trigger staggered animations
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const section = mutation.target;
                if (section.classList.contains('section') && section.classList.contains('active')) {
                    triggerSectionReveal(section);
                }
            }
        });
    });

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section, { attributes: true });
    });

    // Initial reveal for active section
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        setTimeout(() => triggerSectionReveal(activeSection), 100);
    }
}

function triggerSectionReveal(section) {
    // Find all cards/items in this section and add staggered reveal
    const items = section.querySelectorAll('.project-card, .reveal-item');

    items.forEach((item, index) => {
        // Reset state
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        // Stagger the reveal (max 10 items with delays)
        const delay = Math.min(index, 9) * 80;

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, delay + 200); // Add base delay for section transition
    });

    // Also reveal the hero title
    const heroTitle = section.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        heroTitle.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 100);
    }
}

/* ==========================================
   About Section Cards Reveal
   ========================================== */
function initAboutReveal() {
    if (prefersReducedMotion) return;

    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    // Observe the about section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Find all grid items in about section
                const gridItems = aboutSection.querySelectorAll('[style*="border: 1px solid"]');
                const skillTags = aboutSection.querySelectorAll('[style*="border-radius: 50px"]');

                gridItems.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100 + 300);
                });

                skillTags.forEach((tag, index) => {
                    tag.style.opacity = '0';
                    tag.style.transform = 'scale(0.8)';
                    tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

                    setTimeout(() => {
                        tag.style.opacity = '1';
                        tag.style.transform = 'scale(1)';
                    }, index * 80 + 600);
                });
            }
        });
    }, { threshold: 0.3 });

    observer.observe(aboutSection);
}

/* ==========================================
   Initialize All Animations
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initParallax();
    initMagneticButtons();
    initImageLoadEffect();
    initScrollReveal();
    initSectionReveal();
    initAboutReveal();
});

// Re-initialize magnetic buttons after dynamic content loads
window.addEventListener('load', () => {
    setTimeout(initMagneticButtons, 1000);
});
