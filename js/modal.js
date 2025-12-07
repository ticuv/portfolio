/* ==========================================
   MODAL.JS - Project Modal System
   Uses event delegation for dynamic content
   ========================================== */

const modal = document.getElementById('projectModal');
const closeModalBtn = document.getElementById('closeModal');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

let currentProjectIndex = 0;

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

    // Show related projects
    showRelatedProjects(projectElement);

    // Update navigation button visibility
    updateNavButtons();

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    if (closeModalBtn) closeModalBtn.focus();
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

// Expose functions for external use
window.reinitializeModal = function() {
    // With event delegation, no reinitialization needed
    // But we keep this for compatibility
    console.log('Modal: Using event delegation, no reinitialization needed');
};

window.openModalWithProject = function(projectElement, index) {
    openModal(projectElement, index);
};

window.closeProjectModal = closeModal;
