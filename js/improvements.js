/* ==========================================
   IMPROVEMENTS.JS - UX Enhancements
   Better hover effects, loading, and interactions
   ========================================== */

// ==========================================
// 1. BETTER PROJECT HOVER EFFECTS
// ==========================================
function initProjectHoverEffects() {
    const workItems = document.querySelectorAll('.work__item');

    workItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';

            const image = this.querySelector('.work__item-image');
            if (image) {
                image.style.transform = 'scale(1.05)';
            }

            const overlay = this.querySelector('.work__item-overlay');
            if (overlay) {
                overlay.style.opacity = '1';
            }
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';

            const image = this.querySelector('.work__item-image');
            if (image) {
                image.style.transform = 'scale(1)';
            }

            const overlay = this.querySelector('.work__item-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    });
}

// ==========================================
// 2. ENHANCED LOADING ANIMATION
// ==========================================
function initLoadingAnimation() {
    // Create loading overlay
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-logo">
                <img src="logo.png" alt="Loading...">
            </div>
            <div class="loader-bar">
                <div class="loader-progress"></div>
            </div>
        </div>
    `;

    document.body.prepend(loader);

    // Simulate loading progress
    const progress = loader.querySelector('.loader-progress');
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
        } else {
            width += Math.random() * 15;
            if (width > 100) width = 100;
            progress.style.width = width + '%';
        }
    }, 100);

    // Hide loader when page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            progress.style.width = '100%';
            setTimeout(() => {
                loader.classList.add('loaded');
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 300);
        }, 500);
    });
}

// ==========================================
// 3. FLOATING CTA ENHANCEMENTS
// ==========================================
function initFloatingCTA() {
    const cta = document.getElementById('floatingCta');
    if (!cta) return;

    window.addEventListener('scroll', () => {
        const heroSection = document.querySelector('.hero');
        const heroBottom = heroSection ? heroSection.offsetHeight : 800;
        const currentScroll = window.pageYOffset;

        // Show CTA after hero section, hide on hero section
        if (currentScroll > heroBottom) {
            cta.classList.add('show');
        } else {
            cta.classList.remove('show');
        }
    }, { passive: true });

    // Smooth scroll to contact section
    cta.addEventListener('click', (e) => {
        e.preventDefault();
        const contact = document.getElementById('contact');
        if (contact) {
            contact.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ==========================================
// 4. BACK TO TOP BUTTON ENHANCEMENT
// ==========================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        // Add rotation animation
        backToTop.style.transform = 'rotate(360deg)';

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        setTimeout(() => {
            backToTop.style.transform = '';
        }, 600);
    });
}

// ==========================================
// 5. IMAGE LAZY LOADING WITH BLUR-UP
// ==========================================
function initLazyImages() {
    const images = document.querySelectorAll('.work__item-image, .about__profile-image');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // Add blur effect initially
                img.style.filter = 'blur(10px)';
                img.style.transition = 'filter 0.3s ease';

                // Load image
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }

                img.addEventListener('load', () => {
                    img.style.filter = 'blur(0)';
                });

                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    images.forEach(img => {
        // If image hasn't loaded yet, observe it
        if (!img.complete) {
            imageObserver.observe(img);
        }
    });
}

// ==========================================
// 6. SCROLL PROGRESS BAR
// ==========================================
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset;

        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

        progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
}

// ==========================================
// 7. MOBILE TOUCH IMPROVEMENTS
// ==========================================
function initMobileImprovements() {
    // Prevent double-tap zoom on buttons
    const buttons = document.querySelectorAll('button, .btn, .hero__cta');
    buttons.forEach(button => {
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            button.click();
        }, { passive: false });
    });

    // Improve mobile menu close on outside tap
    const nav = document.querySelector('.nav');
    const navLinks = document.getElementById('navLinks');

    if (nav && navLinks) {
        document.addEventListener('touchstart', (e) => {
            if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const toggle = document.getElementById('navToggle');
                if (toggle) toggle.classList.remove('active');
            }
        }, { passive: true });
    }
}

// ==========================================
// 8. ACTIVE NAV LINK HIGHLIGHTING
// ==========================================
function initActiveNavHighlight() {
    const navLinks = document.querySelectorAll('.nav__link');

    // Add smooth transition
    navLinks.forEach(link => {
        link.style.transition = 'color 0.3s ease, border-bottom 0.3s ease';
    });
}

// ==========================================
// 9. PERFORMANCE OPTIMIZATIONS
// ==========================================
function deferNonCriticalCSS() {
    // Defer font loading
    const fontLink = document.querySelector('link[href*="fonts.googleapis"]');
    if (fontLink) {
        fontLink.media = 'print';
        fontLink.onload = function() {
            this.media = 'all';
        };
    }
}

// ==========================================
// INITIALIZE ALL IMPROVEMENTS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initProjectHoverEffects();
    initFloatingCTA();
    initBackToTop();
    initLazyImages();
    initScrollProgress();
    initMobileImprovements();
    initActiveNavHighlight();
    deferNonCriticalCSS();
});

// Loading animation disabled per user request
