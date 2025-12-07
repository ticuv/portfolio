/* ==========================================
   MODAL.JS - Project Modal System
   Supports direct URLs and keyboard navigation
   ========================================== */

const modal = document.getElementById('projectModal');
const closeModalBtn = document.getElementById('closeModal');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

let allProjects = [];
let currentProjectIndex = 0;

// Get all projects on page load
function getAllProjects() {
    return Array.from(document.querySelectorAll('.work__item'));
}

// Open modal with specific project
function openModal(projectElement, index) {
    currentProjectIndex = index;

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
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalImage').src = image;
    document.getElementById('modalImage').alt = title;
    document.getElementById('modalDescription').textContent = description;

    // Create tags
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = '';
    if (tags) {
        tags.split(',').forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'modal__tag';
            tagElement.textContent = tag.trim();
            tagsContainer.appendChild(tagElement);
        });
    }

    // Handle tools
    const toolsContainer = document.getElementById('modalTools');
    if (toolsContainer) {
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
                } else {
                    toolsContainer.style.display = 'none';
                }
            } catch (e) {
                toolsContainer.style.display = 'none';
            }
        } else {
            toolsContainer.style.display = 'none';
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

    // Focus trap for accessibility
    closeModalBtn?.focus();
}

// Show related projects based on category/tags
function showRelatedProjects(currentProject) {
    const relatedContainer = document.getElementById('relatedProjects');
    if (!relatedContainer) return;

    const currentCategory = currentProject.dataset.category;
    const currentId = currentProject.dataset.projectId;

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
            const index = allProjects.indexOf(project);
            openModal(project, index);
        });
        grid.appendChild(item);
    });

    relatedContainer.style.display = 'block';
}

// Update navigation button visibility
function updateNavButtons() {
    if (!modalPrev || !modalNext) return;

    // Always show nav buttons if there are multiple projects
    const showNav = allProjects.length > 1;
    modalPrev.style.display = showNav ? 'flex' : 'none';
    modalNext.style.display = showNav ? 'flex' : 'none';
}

// Initialize click handlers
function initializeModal() {
    allProjects = getAllProjects();

    allProjects.forEach((item, index) => {
        // Remove existing listeners by checking for data attribute
        if (item.dataset.modalInitialized) return;
        item.dataset.modalInitialized = 'true';

        item.addEventListener('click', (e) => {
            // Don't open modal if clicking on a link inside the item
            if (e.target.closest('a')) return;
            openModal(item, index);
        });
    });
}

// Navigation: Previous project
if (modalPrev) {
    modalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentProjectIndex--;
        if (currentProjectIndex < 0) {
            currentProjectIndex = allProjects.length - 1;
        }
        openModal(allProjects[currentProjectIndex], currentProjectIndex);
    });
}

// Navigation: Next project
if (modalNext) {
    modalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentProjectIndex++;
        if (currentProjectIndex >= allProjects.length) {
            currentProjectIndex = 0;
        }
        openModal(allProjects[currentProjectIndex], currentProjectIndex);
    });
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Update URL back to work section
    if (window.location.hash.startsWith('#project/')) {
        history.pushState(null, '', '#work');
    }
}

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

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModal();
    }
});

// Arrow key navigation
document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('active')) return;

    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (modalPrev) modalPrev.click();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (modalNext) modalNext.click();
    }
});

// Handle browser back/forward
window.addEventListener('popstate', (e) => {
    if (modal && modal.classList.contains('active')) {
        if (!window.location.hash.startsWith('#project/')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeModal);

// Expose functions for external use
window.reinitializeModal = function() {
    // Reset and reinitialize
    document.querySelectorAll('.work__item').forEach(item => {
        delete item.dataset.modalInitialized;
    });
    initializeModal();
};

window.openModalWithProject = function(projectElement, index) {
    allProjects = getAllProjects();
    openModal(projectElement, index);
};

window.closeProjectModal = closeModal;
