/* ==========================================
   LIGHTBOX.JS - Image Viewer with Navigation
   Full-screen image viewer with prev/next navigation
   ========================================== */

// Get lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentProjectIndex = 0;
let currentProjects = [];

// Get all unique projects from a section (exclude duplicates)
function getProjectsFromSection(sectionId) {
    const section = document.getElementById(sectionId);
    const cards = Array.from(section.querySelectorAll('.project-card'));
    // Get only first half (original items, not duplicates)
    const uniqueCards = cards.slice(0, Math.floor(cards.length / 2));
    return uniqueCards.map(card => ({
        img: card.getAttribute('data-lightbox'),
        title: card.getAttribute('data-title')
    }));
}

// Display a project in the lightbox
function showProject(index) {
    if (currentProjects.length === 0) return;
    
    // Loop around if out of bounds
    currentProjectIndex = (index + currentProjects.length) % currentProjects.length;
    const project = currentProjects[currentProjectIndex];
    
    lightboxImg.src = project.img;
    lightboxTitle.textContent = project.title;
    lightboxCounter.textContent = `${currentProjectIndex + 1} / ${currentProjects.length}`;
    
    // Remove zoom class when changing images
    lightboxImg.classList.remove('zoomed');
}

// Open lightbox when clicking a project card
document.querySelectorAll('.project-card[data-lightbox]').forEach((card, index) => {
    card.addEventListener('click', () => {
        // Find which section we're in
        const section = card.closest('.section');
        const sectionId = section.id;
        
        // Get all projects from this section
        currentProjects = getProjectsFromSection(sectionId);
        
        // Find the index in the unique items
        const allCards = Array.from(section.querySelectorAll('.project-card'));
        const cardIndex = allCards.indexOf(card);
        const uniqueIndex = cardIndex % (allCards.length / 2);
        
        currentProjectIndex = uniqueIndex;
        showProject(currentProjectIndex);
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Track lightbox open in Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'lightbox_open', {
                'event_category': 'Engagement',
                'event_label': currentProjects[currentProjectIndex].title
            });
        }
    });
});

// Previous button
lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showProject(currentProjectIndex - 1);
});

// Next button
lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showProject(currentProjectIndex + 1);
});

// Close button
lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.classList.remove('zoomed');
});

// Close when clicking background
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.classList.remove('zoomed');
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.classList.remove('zoomed');
    } else if (e.key === 'ArrowLeft') {
        showProject(currentProjectIndex - 1);
    } else if (e.key === 'ArrowRight') {
        showProject(currentProjectIndex + 1);
    }
});

// Image zoom on click
lightboxImg.addEventListener('click', (e) => {
    e.stopPropagation();
    lightboxImg.classList.toggle('zoomed');

    // Track zoom interaction in Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'image_zoom', {
            'event_category': 'Engagement',
            'event_label': lightboxTitle.textContent
        });
    }
});

// Touch/Swipe gestures for mobile
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Only handle horizontal swipes (ignore vertical)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0) {
            // Swipe right - previous image
            showProject(currentProjectIndex - 1);
        } else {
            // Swipe left - next image
            showProject(currentProjectIndex + 1);
        }
    }
}
