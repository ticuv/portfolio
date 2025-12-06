/* ==========================================
   ADVANCED-ANIMATIONS.JS
   Parallax scrolling and magnetic cursor effects
   ========================================== */

// ==========================================
// Parallax Scrolling for Hero Section
// ==========================================
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        // Only apply parallax while hero is in view
        if (scrolled < heroHeight) {
            const parallaxSpeed = 0.5;
            const yPos = -(scrolled * parallaxSpeed);
            hero.style.transform = `translateY(${yPos}px)`;
        }

        ticking = false;
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
}

// ==========================================
// Magnetic Cursor Effect (Desktop only)
// ==========================================
function initMagneticCursor() {
    // Only enable on desktop
    if (window.innerWidth < 1024) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Create custom cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor with smooth follow
    function animateCursor() {
        const diffX = mouseX - cursorX;
        const diffY = mouseY - cursorY;

        cursorX += diffX * 0.1;
        cursorY += diffY * 0.1;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Magnetic effect on hover
    const magneticElements = document.querySelectorAll('.hero__cta, .floating-cta, .work__item, .filter-btn, .sort-btn');

    magneticElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
        });

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const elCenterX = rect.left + rect.width / 2;
            const elCenterY = rect.top + rect.height / 2;

            const diffX = e.clientX - elCenterX;
            const diffY = e.clientY - elCenterY;

            const magnetStrength = 0.3;
            const translateX = diffX * magnetStrength;
            const translateY = diffY * magnetStrength;

            el.style.transform = `translate(${translateX}px, ${translateY}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

// ==========================================
// Image Reveal Animation on Scroll
// ==========================================
function initImageReveal() {
    const images = document.querySelectorAll('.work__item-image');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    img.classList.remove('loading');
                    observer.unobserve(img);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '50px'
        }
    );

    images.forEach((img) => {
        img.classList.add('loading');
        observer.observe(img);

        // When image actually loads, mark as loaded
        if (img.complete) {
            img.classList.add('loaded');
            img.classList.remove('loading');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
                img.classList.remove('loading');
            });
        }
    });
}

// ==========================================
// Smooth Scroll Snap for Sections
// ==========================================
function initSmoothScrollSnap() {
    const sections = document.querySelectorAll('section');

    let isScrolling = false;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        isScrolling = true;

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            isScrolling = false;

            // Find closest section
            let closestSection = null;
            let closestDistance = Infinity;

            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                const distance = Math.abs(rect.top);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestSection = section;
                }
            });

            // Snap to closest section if it's close enough
            if (closestSection && closestDistance < 100) {
                closestSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 150);
    }, { passive: true });
}

// ==========================================
// CTA Button Hover Animation Enhancement
// ==========================================
function initCTAHoverEffect() {
    const ctaButtons = document.querySelectorAll('.hero__cta, .floating-cta, .form__button');

    ctaButtons.forEach((btn) => {
        btn.addEventListener('mouseenter', function(e) {
            const x = e.offsetX;
            const y = e.offsetY;

            const ripple = document.createElement('span');
            ripple.className = 'cta-ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ==========================================
// Initialize All Animations
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initMagneticCursor();
    initImageReveal();
    initCTAHoverEffect();

    // Re-initialize image reveal when new projects are loaded
    const observer = new MutationObserver(() => {
        initImageReveal();
    });

    const workGrids = document.querySelectorAll('.work__grid');
    workGrids.forEach((grid) => {
        observer.observe(grid, { childList: true });
    });
});

// Disable magnetic cursor on resize if screen becomes too small
window.addEventListener('resize', () => {
    if (window.innerWidth < 1024) {
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) cursor.remove();
    }
});
