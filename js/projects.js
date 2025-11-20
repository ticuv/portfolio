/* ==========================================
   PROJECTS.JS - Dynamic Project Loading
   Loads projects from JSON and creates multiple marquee rows
   ========================================== */

// Configuration
const MARQUEE_ROWS = 1; // CHANGED: Set to 1 to show only the first row. Change back to 3 later!
const ITEMS_PER_ROW = 6; // How many items to show per row

// Load projects from JSON
async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        
        // Initialize each section
        initializeSection('posters', data.posters);
        initializeSection('3d', data['3d']);
        initializeSection('generative', data.generative);
        initializeSection('logos', data.logos);
        
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Initialize a section with multiple marquee rows
function initializeSection(sectionId, projects) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // Clear existing content (keep title and scroll hint)
    const existingMarquee = section.querySelector('.project-marquee');
    if (existingMarquee) {
        existingMarquee.remove();
    }
    
    const existingContainer = section.querySelector('.multi-marquee-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // Create container for multiple rows
    const container = document.createElement('div');
    container.className = 'multi-marquee-container';
    container.style.cssText = 'margin-top: 3rem; display: flex; flex-direction: column; gap: 2rem;';
    
    // Distribute projects across rows
    // If MARQUEE_ROWS is 1, it takes all projects and puts them in one row
    const projectsPerRow = Math.ceil(projects.length / MARQUEE_ROWS);
    
    for (let row = 0; row < MARQUEE_ROWS; row++) {
        // If we only have 1 row, we want to use all projects, not slice them
        let rowProjects;
        if (MARQUEE_ROWS === 1) {
            rowProjects = projects;
        } else {
            rowProjects = projects.slice(row * projectsPerRow, (row + 1) * projectsPerRow);
        }

        if (rowProjects.length === 0) continue;
        
        const marqueeRow = createMarqueeRow(rowProjects, row, sectionId);
        container.appendChild(marqueeRow);
    }
    
    section.appendChild(container);
}

// Create a single marquee row
function createMarqueeRow(projects, rowIndex, sectionId) {
    const wrapper = document.createElement('div');
    wrapper.className = 'project-marquee';
    wrapper.style.cssText = 'overflow: hidden; width: 100%; cursor: grab; touch-action: pan-y;';

    const track = document.createElement('div');
    track.className = 'project-marquee-track';
    track.style.cssText = `
        display: flex;
        width: fit-content;
        gap: 2rem;
        will-change: transform;
    `;

    // Duplicate projects for seamless loop
    let allProjects = [...projects, ...projects];
    if (projects.length < 4) {
         allProjects = [...allProjects, ...projects, ...projects];
    }

    allProjects.forEach((project, index) => {
        const card = createProjectCard(project, sectionId);
        track.appendChild(card);
    });

    wrapper.appendChild(track);

    // Animation state
    let position = 0;
    let targetPosition = 0;
    let isAutoScrolling = true;
    let isDragging = false;
    let startX = 0;
    let startPosition = 0;
    let hasMoved = false;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;

    const autoSpeed = 0.5;
    const direction = rowIndex % 2 === 0 ? -1 : 1;

    // Main animation loop
    function update() {
        // Auto scroll when not dragging
        if (isAutoScrolling && !isDragging) {
            position += autoSpeed * direction;
        }

        // Apply momentum after drag
        if (!isDragging && Math.abs(velocity) > 0.1) {
            position += velocity;
            velocity *= 0.95; // Friction
        } else if (!isDragging) {
            velocity = 0;
        }

        // Loop the position
        const trackWidth = track.scrollWidth / 2;
        if (trackWidth > 0) {
            if (position <= -trackWidth) {
                position += trackWidth;
            } else if (position >= 0 && direction === 1) {
                position -= trackWidth;
            } else if (position > 0 && direction === -1) {
                position -= trackWidth;
            }
        }

        track.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(update);
    }

    // Start the animation loop
    requestAnimationFrame(update);

    // Pause on hover (desktop)
    wrapper.addEventListener('mouseenter', () => {
        if (!isDragging) isAutoScrolling = false;
    });

    wrapper.addEventListener('mouseleave', () => {
        if (!isDragging) isAutoScrolling = true;
    });

    // Get X position from event
    function getX(e) {
        if (e.type.includes('touch')) {
            return e.touches[0] ? e.touches[0].clientX : e.changedTouches[0].clientX;
        }
        return e.clientX;
    }

    // Drag start
    function onDragStart(e) {
        isDragging = true;
        hasMoved = false;
        isAutoScrolling = false;
        velocity = 0;

        startX = getX(e);
        startPosition = position;
        lastX = startX;
        lastTime = Date.now();

        wrapper.style.cursor = 'grabbing';
    }

    // Drag move
    function onDragMove(e) {
        if (!isDragging) return;

        const currentX = getX(e);
        const diff = currentX - startX;

        // Track velocity for momentum
        const now = Date.now();
        const dt = now - lastTime;
        if (dt > 0) {
            velocity = (currentX - lastX) / dt * 16; // Normalize to ~60fps
        }
        lastX = currentX;
        lastTime = now;

        // Mark as moved if threshold exceeded
        if (Math.abs(diff) > 5) {
            hasMoved = true;
        }

        position = startPosition + diff;
    }

    // Drag end
    function onDragEnd(e) {
        if (!isDragging) return;

        isDragging = false;
        wrapper.style.cursor = 'grab';

        // Set flag to prevent lightbox opening
        if (hasMoved) {
            wrapper.setAttribute('data-just-dragged', 'true');
            setTimeout(() => {
                wrapper.removeAttribute('data-just-dragged');
            }, 100);
        }

        // Resume auto scroll after momentum settles
        setTimeout(() => {
            if (!isDragging) {
                isAutoScrolling = true;
            }
        }, 1000);
    }

    // Mouse events
    wrapper.addEventListener('mousedown', onDragStart);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);

    // Touch events
    wrapper.addEventListener('touchstart', onDragStart, { passive: true });
    wrapper.addEventListener('touchmove', (e) => {
        if (isDragging && hasMoved) {
            e.preventDefault();
        }
        onDragMove(e);
    }, { passive: false });
    wrapper.addEventListener('touchend', onDragEnd);
    wrapper.addEventListener('touchcancel', onDragEnd);

    return wrapper;
}

// Create a project card
function createProjectCard(project, sectionId) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-lightbox', project.image);
    card.setAttribute('data-title', project.title);
    card.setAttribute('data-section', sectionId);
    card.style.cssText = `
        flex-shrink: 0;
        width: 400px;
        cursor: pointer;
        position: relative;
        transition: transform 0.3s ease;
    `;
    
    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'project-image';
    imageContainer.style.cssText = `
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
        background: var(--bg-secondary);
        position: relative;
    `;
    
    // Create image with lazy loading
    const img = document.createElement('img');
    img.src = project.thumbnail || project.image;
    img.alt = project.title;
    img.loading = 'lazy';
    img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
        opacity: 0;
        animation: imageLoad 0.5s ease forwards;
    `;
    
    imageContainer.appendChild(img);
    
    // Create title
    const title = document.createElement('p');
    title.className = 'project-title';
    title.textContent = project.title;
    title.style.cssText = `
        margin-top: 1rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
        text-align: center;
    `;
    
    // Add hover effect
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        img.style.transform = 'scale(1.08)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        img.style.transform = 'scale(1)';
    });
    
    // Add "View" overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        content: 'View';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--text-primary);
        font-size: 1rem;
        font-weight: 500;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.8);
        padding: 0.75rem 1.5rem;
        border-radius: 50px;
        backdrop-filter: blur(10px);
        z-index: 10;
    `;
    overlay.textContent = 'View';
    
    card.addEventListener('mouseenter', () => {
        overlay.style.opacity = '1';
    });
    
    card.addEventListener('mouseleave', () => {
        overlay.style.opacity = '0';
    });
    
    card.appendChild(imageContainer);
    card.appendChild(overlay);
    card.appendChild(title);
    
    return card;
}

// Initialize lightbox functionality for dynamically created cards
function initializeLightboxForDynamicCards() {
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card[data-lightbox]');
        if (!card) return;

        // Check if parent marquee was just dragged - don't open lightbox
        const marquee = card.closest('.project-marquee');
        if (marquee && marquee.getAttribute('data-just-dragged') === 'true') {
            return;
        }

        const sectionId = card.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        
        // Get all cards from this section
        const allCards = Array.from(section.querySelectorAll('.project-card[data-lightbox]'));
        
        // Remove duplicates (each project appears twice for marquee loop)
        const uniqueCards = [];
        const seenUrls = new Set();
        
        allCards.forEach(c => {
            const url = c.getAttribute('data-lightbox');
            if (!seenUrls.has(url)) {
                seenUrls.add(url);
                uniqueCards.push(c);
            }
        });
        
        // Find index in unique cards
        const clickedUrl = card.getAttribute('data-lightbox');
        const clickedIndex = uniqueCards.findIndex(c => c.getAttribute('data-lightbox') === clickedUrl);
        
        // Store projects for lightbox
        window.currentProjects = uniqueCards.map(c => ({
            img: c.getAttribute('data-lightbox'),
            title: c.getAttribute('data-title')
        }));
        
        window.currentProjectIndex = clickedIndex;
        
        // Show in lightbox
        showProjectInLightbox(clickedIndex);
        
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Show project in lightbox
function showProjectInLightbox(index) {
    if (!window.currentProjects || window.currentProjects.length === 0) return;
    
    window.currentProjectIndex = (index + window.currentProjects.length) % window.currentProjects.length;
    const project = window.currentProjects[window.currentProjectIndex];
    
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    lightboxImg.src = project.img;
    lightboxTitle.textContent = project.title;
    lightboxCounter.textContent = `${window.currentProjectIndex + 1} / ${window.currentProjects.length}`;
}

// Update lightbox navigation to work with dynamic content
function updateLightboxNavigation() {
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showProjectInLightbox(window.currentProjectIndex - 1);
    });
    
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showProjectInLightbox(window.currentProjectIndex + 1);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            showProjectInLightbox(window.currentProjectIndex - 1);
        } else if (e.key === 'ArrowRight') {
            showProjectInLightbox(window.currentProjectIndex + 1);
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    initializeLightboxForDynamicCards();
    updateLightboxNavigation();
});
