// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Update URL without jumping
            history.pushState(null, null, this.getAttribute('href'));
            // Close mobile menu if open
            const toggle = document.getElementById('navToggle');
            const links = document.getElementById('navLinks');
            if (toggle && links) {
                toggle.classList.remove('active');
                links.classList.remove('active');
            }
        }
    });
});

// Smooth scroll on page load if URL has hash
window.addEventListener('load', () => {
    if (window.location.hash) {
        // Prevent default jump
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 0);
    }
});

// Scroll spy - update URL as user scrolls through sections
const sections = document.querySelectorAll('section[id]');
const navLinkElements = document.querySelectorAll('.nav__link');

let scrollTimeout;

function updateActiveSection() {
    const scrollPosition = window.scrollY + 100; // Offset for fixed nav

    let currentSection = null;

    // Find which section we're currently in
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    // Update URL and nav links if section changed
    if (currentSection) {
        const newHash = `#${currentSection}`;

        // Update URL without adding to history
        if (window.location.hash !== newHash) {
            history.replaceState(null, null, newHash);
        }

        // Update active nav link
        navLinkElements.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === newHash) {
                link.classList.add('active');
            }
        });
    } else if (window.scrollY < 100) {
        // At the top of the page, remove hash
        if (window.location.hash) {
            history.replaceState(null, null, window.location.pathname);
        }
        navLinkElements.forEach(link => link.classList.remove('active'));
    }
}

// Throttle scroll events for performance
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveSection, 50);
}, { passive: true });

// Initial check on load
window.addEventListener('load', updateActiveSection);

// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}
