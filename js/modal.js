// Modal functionality
const modal = document.getElementById('projectModal');
const closeModal = document.getElementById('closeModal');
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

    const title = projectElement.dataset.title;
    const tags = projectElement.dataset.tags;
    const description = projectElement.dataset.description;
    const image = projectElement.dataset.image;
    const tools = projectElement.dataset.tools;
    const client = projectElement.dataset.client;
    const link = projectElement.dataset.link;

    // Populate modal content
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalImage').src = image;
    document.getElementById('modalImage').alt = title;
    document.getElementById('modalDescription').textContent = description;

    // Create tags
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = '';
    tags.split(',').forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'modal__tag';
        tagElement.textContent = tag.trim();
        tagsContainer.appendChild(tagElement);
    });

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
            linkContainer.innerHTML = `<a href="${link}" target="_blank" rel="noopener noreferrer" class="modal__link">View Full Case Study →</a>`;
            linkContainer.style.display = 'block';
        } else {
            linkContainer.style.display = 'none';
        }
    }

    // Hide related projects section for now
    const relatedContainer = document.getElementById('relatedProjects');
    if (relatedContainer) {
        relatedContainer.style.display = 'none';
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Initialize click handlers
function initializeModal() {
    allProjects = getAllProjects();

    allProjects.forEach((item, index) => {
        item.addEventListener('click', () => {
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
const closeModalHandler = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
};

if (closeModal) {
    closeModal.addEventListener('click', closeModalHandler);
}

// Close modal when clicking outside content
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModalHandler();
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeModal);

// Expose reinitializeModal for dynamic content updates
window.reinitializeModal = initializeModal;
