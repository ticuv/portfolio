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
    hamburger.classList.toggle('active');
    sideNav.classList.toggle('active');
});

// Navigate between sections with smooth transitions
function navigate(target) {
    if (target === currentSection) return;
    
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
}

// Add click handlers to all navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-nav');
        navigate(target);
    });
});
