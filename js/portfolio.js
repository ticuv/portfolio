/* ==========================================
   PORTFOLIO.JS - Dynamic Project Management
   Handles loading, filtering, sorting, and search
   ========================================== */

// Global state
let allProjects = [];
let filteredProjects = [];
let currentFilter = 'all';
let currentSort = 'featured';
let currentSearchQuery = '';
let archiveItemsShown = 9; // Number of archive items to show initially
const ARCHIVE_LOAD_MORE = 9; // How many more to load each time

// Initialize portfolio
async function initPortfolio() {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        allProjects = data.projects || [];
        filteredProjects = [...allProjects];

        renderProjects();
        initializeFilters();
        initializeSort();
        initializeSearch();
        initializeArchiveLoadMore();

        // Update filter counts
        updateFilterCounts();
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Render projects to DOM
function renderProjects() {
    const featuredGrid = document.getElementById('featuredGrid');
    const recentGrid = document.getElementById('recentGrid');
    const archiveGrid = document.getElementById('archiveGrid');

    if (!featuredGrid || !recentGrid || !archiveGrid) return;

    // Clear grids
    featuredGrid.innerHTML = '';
    recentGrid.innerHTML = '';
    archiveGrid.innerHTML = '';

    // Apply filter and sort
    let projectsToShow = applyFilterAndSort();

    // Separate featured and non-featured
    const featured = projectsToShow.filter(p => p.featured);
    const nonFeatured = projectsToShow.filter(p => !p.featured);

    // Render featured projects
    featured.forEach(project => {
        featuredGrid.appendChild(createProjectCard(project));
    });

    // Render recent projects (first 3 non-featured)
    const recent = nonFeatured.slice(0, 3);
    recent.forEach(project => {
        recentGrid.appendChild(createProjectCard(project));
    });

    // Render archive projects (remaining non-featured)
    const archive = nonFeatured.slice(3);
    archive.forEach((project, index) => {
        const card = createProjectCard(project);
        if (index >= archiveItemsShown) {
            card.style.display = 'none';
            card.setAttribute('data-archive-hidden', 'true');
        }
        archiveGrid.appendChild(card);
    });

    // Update load more button visibility
    updateLoadMoreButton(archive.length);

    // Reinitialize modal click handlers
    initializeModalHandlers();
}

// Create project card element
function createProjectCard(project) {
    const article = document.createElement('article');
    article.className = `work__item ${project.layout || ''} fade-in`;
    article.setAttribute('role', 'article');
    article.setAttribute('aria-label', project.title);
    article.setAttribute('data-project-id', project.id);
    article.setAttribute('data-title', project.title);
    article.setAttribute('data-tags', project.tags.join(', '));
    article.setAttribute('data-description', project.description);
    article.setAttribute('data-image', project.image);
    article.setAttribute('data-category', project.category);
    article.setAttribute('data-year', project.year);
    article.setAttribute('data-featured', project.featured);
    article.setAttribute('data-tools', JSON.stringify(project.tools || []));
    article.setAttribute('data-client', project.client || '');
    article.setAttribute('data-link', project.link || '');

    // Create image
    const img = document.createElement('img');
    img.src = project.thumbnail || project.image;
    img.alt = project.title;
    img.className = 'work__item-image';
    img.loading = 'lazy';
    img.decoding = 'async';

    // Create meta
    const meta = document.createElement('div');
    meta.className = 'work__item-meta';

    if (project.featured) {
        const featuredSpan = document.createElement('span');
        featuredSpan.className = 'work__item-featured';
        featuredSpan.textContent = 'Featured';
        meta.appendChild(featuredSpan);
    }

    const yearSpan = document.createElement('span');
    yearSpan.className = 'work__item-year';
    yearSpan.textContent = project.year;
    meta.appendChild(yearSpan);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'work__item-overlay';

    // Create content
    const content = document.createElement('div');
    content.className = 'work__item-content';

    const title = document.createElement('h3');
    title.className = 'work__item-title';
    title.textContent = project.title;

    const category = document.createElement('p');
    category.className = 'work__item-category';
    category.textContent = project.tags.join(' / ');

    content.appendChild(title);
    content.appendChild(category);

    // Assemble card
    article.appendChild(img);
    article.appendChild(meta);
    article.appendChild(overlay);
    article.appendChild(content);

    return article;
}

// Apply filter and sort
function applyFilterAndSort() {
    let filtered = [...allProjects];

    // Apply category filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilter);
    }

    // Apply search filter
    if (currentSearchQuery.trim() !== '') {
        const query = currentSearchQuery.toLowerCase();
        filtered = filtered.filter(p => {
            return (
                p.title.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.tags.some(tag => tag.toLowerCase().includes(query)) ||
                p.year.toString().includes(query) ||
                (p.tools && p.tools.some(tool => tool.toLowerCase().includes(query)))
            );
        });
    }

    // Apply sort
    switch (currentSort) {
        case 'featured':
            filtered.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return b.year - a.year;
            });
            break;
        case 'latest':
            filtered.sort((a, b) => b.year - a.year);
            break;
        case 'oldest':
            filtered.sort((a, b) => a.year - b.year);
            break;
    }

    filteredProjects = filtered;
    return filtered;
}

// Initialize filter buttons
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update filter
            currentFilter = btn.getAttribute('data-filter');

            // Reset archive pagination
            archiveItemsShown = 9;

            // Re-render
            renderProjects();
        });
    });
}

// Initialize sort buttons
function initializeSort() {
    const sortButtons = document.querySelectorAll('.sort-btn');

    sortButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            sortButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update sort
            currentSort = btn.getAttribute('data-sort');

            // Reset archive pagination
            archiveItemsShown = 9;

            // Re-render
            renderProjects();
        });
    });
}

// Initialize search
function initializeSearch() {
    const searchInput = document.getElementById('projectSearch');
    const clearBtn = document.getElementById('clearSearch');

    if (!searchInput) return;

    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);

        // Show/hide clear button
        if (e.target.value) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }

        // Debounce search
        searchTimeout = setTimeout(() => {
            currentSearchQuery = e.target.value;
            archiveItemsShown = 9;
            renderProjects();

            // Show "no results" message if needed
            const totalProjects = filteredProjects.length;
            const noResultsMsg = document.getElementById('noResults');
            if (noResultsMsg) {
                if (totalProjects === 0 && currentSearchQuery.trim() !== '') {
                    noResultsMsg.style.display = 'block';
                } else {
                    noResultsMsg.style.display = 'none';
                }
            }
        }, 300);
    });

    // Clear search
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentSearchQuery = '';
            clearBtn.style.display = 'none';
            archiveItemsShown = 9;
            renderProjects();
        });
    }
}

// Initialize archive load more
function initializeArchiveLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', () => {
        archiveItemsShown += ARCHIVE_LOAD_MORE;

        // Show hidden archive items
        const archiveGrid = document.getElementById('archiveGrid');
        const hiddenItems = archiveGrid.querySelectorAll('[data-archive-hidden="true"]');

        let shownCount = 0;
        hiddenItems.forEach((item, index) => {
            if (shownCount < ARCHIVE_LOAD_MORE) {
                item.style.display = '';
                item.removeAttribute('data-archive-hidden');
                shownCount++;
            }
        });

        // Update button state
        const remainingHidden = archiveGrid.querySelectorAll('[data-archive-hidden="true"]').length;
        if (remainingHidden === 0) {
            loadMoreBtn.textContent = 'No More Projects';
            loadMoreBtn.disabled = true;
        }
    });
}

// Update load more button visibility
function updateLoadMoreButton(totalArchiveProjects) {
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!loadMoreContainer || !loadMoreBtn) return;

    if (totalArchiveProjects > archiveItemsShown) {
        loadMoreContainer.style.display = 'flex';
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Load More Projects';
    } else {
        if (totalArchiveProjects > 0) {
            loadMoreContainer.style.display = 'flex';
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = 'No More Projects';
        } else {
            loadMoreContainer.style.display = 'none';
        }
    }
}

// Update filter counts
function updateFilterCounts() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        const filter = btn.getAttribute('data-filter');
        let count = 0;

        if (filter === 'all') {
            count = allProjects.length;
        } else {
            count = allProjects.filter(p => p.category === filter).length;
        }

        // Add count badge
        if (!btn.querySelector('.filter-count')) {
            const countSpan = document.createElement('span');
            countSpan.className = 'filter-count';
            countSpan.textContent = ` (${count})`;
            btn.appendChild(countSpan);
        }
    });
}

// Initialize modal handlers
function initializeModalHandlers() {
    const workItems = document.querySelectorAll('.work__item');

    workItems.forEach(item => {
        // Remove existing listeners by cloning
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
    });

    // Add new listeners
    document.querySelectorAll('.work__item').forEach(item => {
        item.addEventListener('click', () => {
            openEnhancedModal(item);
        });
    });
}

// Open enhanced modal
function openEnhancedModal(item) {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const projectId = item.getAttribute('data-project-id');
    const project = allProjects.find(p => p.id === projectId);

    if (!project) return;

    // Populate modal
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalImage').alt = project.title;
    document.getElementById('modalDescription').textContent = project.description;

    // Create tags
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = '';
    project.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'modal__tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });

    // Add tools if available
    const toolsContainer = document.getElementById('modalTools');
    if (toolsContainer && project.tools && project.tools.length > 0) {
        toolsContainer.innerHTML = '<h4>Tools Used</h4>';
        project.tools.forEach(tool => {
            const toolElement = document.createElement('span');
            toolElement.className = 'modal__tool';
            toolElement.textContent = tool;
            toolsContainer.appendChild(toolElement);
        });
        toolsContainer.style.display = 'block';
    } else if (toolsContainer) {
        toolsContainer.style.display = 'none';
    }

    // Add client if available
    const clientContainer = document.getElementById('modalClient');
    if (clientContainer && project.client) {
        clientContainer.innerHTML = `<strong>Client:</strong> ${project.client}`;
        clientContainer.style.display = 'block';
    } else if (clientContainer) {
        clientContainer.style.display = 'none';
    }

    // Add external link if available
    const linkContainer = document.getElementById('modalLink');
    if (linkContainer && project.link) {
        linkContainer.innerHTML = `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="modal__link">View Full Case Study →</a>`;
        linkContainer.style.display = 'block';
    } else if (linkContainer) {
        linkContainer.style.display = 'none';
    }

    // Add related projects
    renderRelatedProjects(project);

    // Store current project for navigation
    window.currentModalProject = project;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Render related projects
function renderRelatedProjects(currentProject) {
    const relatedContainer = document.getElementById('relatedProjects');
    if (!relatedContainer) return;

    // Find related projects (same category, different project)
    const related = allProjects
        .filter(p => p.id !== currentProject.id && p.category === currentProject.category)
        .slice(0, 3);

    if (related.length === 0) {
        relatedContainer.style.display = 'none';
        return;
    }

    relatedContainer.innerHTML = '<h4 class="related__title">Related Projects</h4><div class="related__grid" id="relatedGrid"></div>';
    const relatedGrid = document.getElementById('relatedGrid');

    related.forEach(project => {
        const card = createRelatedCard(project);
        relatedGrid.appendChild(card);
    });

    relatedContainer.style.display = 'block';
}

// Create related project card
function createRelatedCard(project) {
    const card = document.createElement('div');
    card.className = 'related__card';
    card.setAttribute('data-project-id', project.id);

    const img = document.createElement('img');
    img.src = project.thumbnail || project.image;
    img.alt = project.title;
    img.loading = 'lazy';

    const title = document.createElement('p');
    title.className = 'related__card-title';
    title.textContent = project.title;

    card.appendChild(img);
    card.appendChild(title);

    // Click to open this project
    card.addEventListener('click', () => {
        const mainItem = document.querySelector(`[data-project-id="${project.id}"]`);
        if (mainItem) {
            openEnhancedModal(mainItem);
        }
    });

    return card;
}

// Modal navigation (Next/Previous project)
function initializeModalNavigation() {
    const prevBtn = document.getElementById('modalPrev');
    const nextBtn = document.getElementById('modalNext');

    if (!prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateModal(-1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateModal(1);
    });
}

// Navigate modal
function navigateModal(direction) {
    if (!window.currentModalProject) return;

    const currentIndex = filteredProjects.findIndex(p => p.id === window.currentModalProject.id);
    if (currentIndex === -1) return;

    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = filteredProjects.length - 1;
    if (newIndex >= filteredProjects.length) newIndex = 0;

    const newProject = filteredProjects[newIndex];
    const newItem = document.querySelector(`[data-project-id="${newProject.id}"]`);

    if (newItem) {
        openEnhancedModal(newItem);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initPortfolio();
    initializeModalNavigation();
});
