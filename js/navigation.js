/* ==========================================
   NAVIGATION.JS - Menu & Page Transitions
   Handles hamburger menu and smooth section transitions
   ========================================== */

// Get navigation elements
const hamburger = document.getElementById('hamburger');
const sideNav = document.getElementById('sideNav');
const navLinks = document.querySelectorAll('[data-nav]');
let currentSection = 'home';

// Toggle hamburger menu
hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    sideNav.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
});

// Navigate between sections with smooth transitions
function navigate(target, updateHash = true) {
    if (target === currentSection) return;

    // Validate target section exists
    if (!document.getElementById(target)) {
        target = 'home';
    }

    // Update URL hash (always use hash-based URLs for SPA compatibility)
    if (updateHash) {
        window.history.pushState(null, '', `#${target}`);
    }

    // Track page view in Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': target,
            'page_location': window.location.href
        });
    }

    // Add leaving state to current section
    const currentSectionEl = document.getElementById(currentSection);
    currentSectionEl.classList.add('leaving');

    // Wait for leave animation, then switch
    setTimeout(() => {
        currentSectionEl.classList.remove('active');
        currentSectionEl.classList.remove('leaving');

        // Show new section
        const newSection = document.getElementById(target);
        newSection.classList.add('active');

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-nav') === target) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        currentSection = target;

        // Scroll to top
        newSection.scrollTop = 0;
    }, 400); // Half of transition time for overlap

    // Close menu
    hamburger.classList.remove('active');
    sideNav.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
}

// Add click handlers to all navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-nav');
        navigate(target);
    });
    
    // Add keyboard support
    link.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const target = link.getAttribute('data-nav');
            navigate(target);
        }
    });
});
// Back to top button
const backToTop = document.getElementById('backToTop');

document.querySelectorAll('.section').forEach(section => {
    section.addEventListener('scroll', () => {
        if (section.scrollTop > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
});

backToTop.addEventListener('click', () => {
    document.querySelector('.section.active').scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1); // Remove the #
    const target = hash || 'home';
    if (target !== currentSection) {
        navigate(target, false); // Don't update hash again
    }
});

// Handle direct navigation via URL hash on page load
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.slice(1); // Remove the #

    if (hash) {
        // Navigate to the hashed section if it exists
        if (document.getElementById(hash)) {
            setTimeout(() => {
                navigate(hash, false); // Don't update hash again
            }, 100);
        } else {
            // Invalid hash, go to home
            window.history.replaceState(null, '', '#home');
        }
    } else {
        // No hash, set default to #home
        window.history.replaceState(null, '', '#home');
    }

    // Update copyright year automatically
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
