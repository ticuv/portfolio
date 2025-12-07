/* ==========================================
   MODAL.JS - Project Modal System
   Features: Event delegation, swipe gestures,
   social sharing, keyboard navigation
   ========================================== */

const modal = document.getElementById('projectModal');
const closeModalBtn = document.getElementById('closeModal');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

let currentProjectIndex = 0;

// Touch/Swipe variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const SWIPE_THRESHOLD = 50;
const SWIPE_RESTRAINT = 100;

// Get all projects currently in DOM
function getAllProjects() {
    return Array.from(document.querySelectorAll('.work__item'));
}

// Open modal with specific project
function openModal(projectElement, index) {
    if (!modal) return;

    const allProjects = getAllProjects();
    currentProjectIndex = index >= 0 ? index : allProjects.indexOf(projectElement);
    if (currentProjectIndex < 0) currentProjectIndex = 0;

    const projectId = projectElement.dataset.projectId;
    const title = projectElement.dataset.title;
    const tags = projectElement.dataset.tags;
    const description = projectElement.dataset.description;
    const image = projectElement.dataset.image;
    const tools = projectElement.dataset.tools;
    const client = projectElement.dataset.client;
    const link = projectElement.dataset.link;

    // Update URL for shareable link
    if (projectId) {
        history.pushState({ projectId }, '', `#project/${projectId}`);
    }

    // Populate modal content
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');

    if (modalTitle) modalTitle.textContent = title || '';
    if (modalImage) {
        modalImage.src = image || '';
        modalImage.alt = title || '';
    }
    if (modalDescription) modalDescription.textContent = description || '';

    // Create tags
    const tagsContainer = document.getElementById('modalTags');
    if (tagsContainer) {
        tagsContainer.innerHTML = '';
        if (tags) {
            tags.split(',').forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'modal__tag';
                tagElement.textContent = tag.trim();
                tagsContainer.appendChild(tagElement);
            });
        }
    }

    // Handle tools
    const toolsContainer = document.getElementById('modalTools');
    if (toolsContainer) {
        toolsContainer.innerHTML = '';
        toolsContainer.style.display = 'none';
        if (tools) {
            try {
                const toolsArray = JSON.parse(tools);
                if (toolsArray && toolsArray.length > 0) {
                    toolsContainer.innerHTML = '<h4>Tools Used</h4>';
                    toolsArray.forEach(tool => {
                        const toolElement = document.createElement('span');
                        toolElement.className = 'modal__tool';
                        toolElement.textContent = tool;
                        toolsContainer.appendChild(toolElement);
                    });
                    toolsContainer.style.display = 'block';
                }
            } catch (e) {
                // Invalid JSON, keep hidden
            }
        }
    }

    // Handle client
    const clientContainer = document.getElementById('modalClient');
    if (clientContainer) {
        if (client && client.trim() !== '') {
            clientContainer.innerHTML = `<strong>Client:</strong> ${client}`;
            clientContainer.style.display = 'block';
        } else {
            clientContainer.style.display = 'none';
        }
    }

    // Handle external link
    const linkContainer = document.getElementById('modalLink');
    if (linkContainer) {
        if (link && link.trim() !== '') {
            linkContainer.innerHTML = `<a href="${link}" target="_blank" rel="noopener noreferrer" class="modal__external-link">View Full Case Study →</a>`;
            linkContainer.style.display = 'block';
        } else {
            linkContainer.style.display = 'none';
        }
    }

    // Update social sharing links
    updateShareLinks(title, projectId);

    // Show related projects
    showRelatedProjects(projectElement);

    // Update navigation button visibility
    updateNavButtons();

    // Show modal with animation
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    if (closeModalBtn) closeModalBtn.focus();
}

// Update social sharing links
function updateShareLinks(title, projectId) {
    const shareContainer = document.getElementById('modalShare');
    if (!shareContainer) return;

    const projectUrl = `${window.location.origin}/#project/${projectId}`;
    const encodedUrl = encodeURIComponent(projectUrl);
    const encodedTitle = encodeURIComponent(`Check out "${title}" by ticuv`);

    shareContainer.innerHTML = `
        <div class="modal__share">
            <span class="share-label">Share:</span>
            <div class="share-buttons">
                <button class="share-btn share-btn--copy" data-url="${projectUrl}" aria-label="Copy link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                    <span class="share-tooltip">Copy Link</span>
                </button>
                <a href="https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="share-btn share-btn--twitter" aria-label="Share on Twitter">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                </a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="share-btn share-btn--linkedin" aria-label="Share on LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </a>
                <a href="https://wa.me/?text=${encodedTitle}%20${encodedUrl}" target="_blank" rel="noopener noreferrer" class="share-btn share-btn--whatsapp" aria-label="Share on WhatsApp">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                </a>
            </div>
        </div>
    `;

    // Add copy link functionality
    const copyBtn = shareContainer.querySelector('.share-btn--copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const url = copyBtn.dataset.url;
            try {
                await navigator.clipboard.writeText(url);
                copyBtn.classList.add('copied');
                const tooltip = copyBtn.querySelector('.share-tooltip');
                if (tooltip) tooltip.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    if (tooltip) tooltip.textContent = 'Copy Link';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    }
}

// Show related projects based on category
function showRelatedProjects(currentProject) {
    const relatedContainer = document.getElementById('relatedProjects');
    if (!relatedContainer) return;

    const currentCategory = currentProject.dataset.category;
    const currentId = currentProject.dataset.projectId;
    const allProjects = getAllProjects();

    // Find related projects (same category, different project)
    const related = allProjects.filter(p =>
        p.dataset.category === currentCategory &&
        p.dataset.projectId !== currentId
    ).slice(0, 3);

    if (related.length === 0) {
        relatedContainer.style.display = 'none';
        return;
    }

    relatedContainer.innerHTML = '<h4>Related Projects</h4><div class="related-grid"></div>';
    const grid = relatedContainer.querySelector('.related-grid');

    related.forEach(project => {
        const item = document.createElement('div');
        item.className = 'related-item';
        item.innerHTML = `
            <img src="${project.dataset.image}" alt="${project.dataset.title}" loading="lazy">
            <span>${project.dataset.title}</span>
        `;
        item.addEventListener('click', () => {
            const allProjs = getAllProjects();
            const idx = allProjs.indexOf(project);
            openModal(project, idx);
        });
        grid.appendChild(item);
    });

    relatedContainer.style.display = 'block';
}

// Update navigation button visibility
function updateNavButtons() {
    if (!modalPrev || !modalNext) return;
    const allProjects = getAllProjects();
    const showNav = allProjects.length > 1;
    modalPrev.style.display = showNav ? 'flex' : 'none';
    modalNext.style.display = showNav ? 'flex' : 'none';
}

// Navigate to previous project
function navigatePrev() {
    const allProjects = getAllProjects();
    if (allProjects.length === 0) return;

    // Add swipe animation
    const content = modal.querySelector('.modal__content');
    if (content) {
        content.classList.add('swipe-right');
        setTimeout(() => content.classList.remove('swipe-right'), 300);
    }

    currentProjectIndex--;
    if (currentProjectIndex < 0) {
        currentProjectIndex = allProjects.length - 1;
    }
    openModal(allProjects[currentProjectIndex], currentProjectIndex);
}

// Navigate to next project
function navigateNext() {
    const allProjects = getAllProjects();
    if (allProjects.length === 0) return;

    // Add swipe animation
    const content = modal.querySelector('.modal__content');
    if (content) {
        content.classList.add('swipe-left');
        setTimeout(() => content.classList.remove('swipe-left'), 300);
    }

    currentProjectIndex++;
    if (currentProjectIndex >= allProjects.length) {
        currentProjectIndex = 0;
    }
    openModal(allProjects[currentProjectIndex], currentProjectIndex);
}

// Close modal
function closeModal() {
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Update URL back to work section
    if (window.location.hash.startsWith('#project/')) {
        history.pushState(null, '', '#work');
    }
}

// ==========================================
// TOUCH/SWIPE GESTURES FOR MOBILE
// ==========================================
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
}

function handleSwipeGesture() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Only handle horizontal swipes, ignore if vertical movement is significant
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaY) < SWIPE_RESTRAINT) {
        if (deltaX > 0) {
            // Swiped right - go to previous
            navigatePrev();
        } else {
            // Swiped left - go to next
            navigateNext();
        }
    }
}

// Add touch listeners to modal
if (modal) {
    modal.addEventListener('touchstart', handleTouchStart, { passive: true });
    modal.addEventListener('touchend', handleTouchEnd, { passive: true });
}

// ==========================================
// EVENT DELEGATION - Works with dynamic content
// ==========================================
document.addEventListener('click', (e) => {
    // Check if clicked on a work item or its children
    const workItem = e.target.closest('.work__item');

    if (workItem) {
        // Don't open modal if clicking on a link inside the item
        if (e.target.closest('a')) return;

        e.preventDefault();
        const allProjects = getAllProjects();
        const index = allProjects.indexOf(workItem);
        openModal(workItem, index);
    }
});

// Navigation buttons
if (modalPrev) {
    modalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        navigatePrev();
    });
}

if (modalNext) {
    modalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateNext();
    });
}

// Close modal button
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

// Close modal when clicking outside content
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigatePrev();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateNext();
    }
});

// Handle browser back/forward
window.addEventListener('popstate', () => {
    if (modal && modal.classList.contains('active')) {
        if (!window.location.hash.startsWith('#project/')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ==========================================
// SWIPE INDICATOR FOR MOBILE
// ==========================================
function showSwipeHint() {
    if (!modal || window.innerWidth > 768) return;

    const hint = document.createElement('div');
    hint.className = 'swipe-hint';
    hint.innerHTML = `
        <span class="swipe-hint__icon">←</span>
        <span class="swipe-hint__text">Swipe to navigate</span>
        <span class="swipe-hint__icon">→</span>
    `;
    modal.appendChild(hint);

    setTimeout(() => {
        hint.classList.add('fade-out');
        setTimeout(() => hint.remove(), 500);
    }, 2000);
}

// Show hint on first modal open
let hasShownSwipeHint = false;
const originalOpenModal = openModal;
// Note: Hint is shown via CSS animation on mobile

// Expose functions for external use
window.reinitializeModal = function() {
    console.log('Modal: Using event delegation, no reinitialization needed');
};

window.openModalWithProject = function(projectElement, index) {
    openModal(projectElement, index);
};

window.closeProjectModal = closeModal;
