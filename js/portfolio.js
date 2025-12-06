/* ==========================================
   PORTFOLIO.JS - Dynamic Project Management
   Handles loading, filtering, sorting, and search
   ========================================== */

// Global state
let allProjects = [];
let filteredProjects = [];
let currentFilter = 'all';
let currentSort = 'featured';

// Initialize portfolio
async function initPortfolio() {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        allProjects = data.projects || [];
        filteredProjects = [...allProjects];

        // Initial render
        renderProjects();

        // Initialize controls
        initializeFilters();
        initializeSort();

    } catch (error) {
        console.error('Error loading projects:', error);
        // If JSON fails to load, keep the hardcoded HTML projects
    }
}

// Render projects to DOM
function renderProjects() {
    const featuredGrid = document.getElementById('featuredGrid');
    const recentGrid = document.getElementById('recentGrid');

    if (!featuredGrid || !recentGrid) return;

    // Apply filter and sort
    let projectsToShow = applyFilterAndSort();

    // Separate featured and non-featured
    const featured = projectsToShow.filter(p => p.featured);
    const nonFeatured = projectsToShow.filter(p => !p.featured);

    // Clear and render featured projects
    featuredGrid.innerHTML = '';
    featured.forEach(project => {
        featuredGrid.appendChild(createProjectCard(project));
    });

    // Clear and render recent projects
    recentGrid.innerHTML = '';
    const recent = nonFeatured.slice(0, 3);
    recent.forEach(project => {
        recentGrid.appendChild(createProjectCard(project));
    });

    // Reinitialize modal handlers for new cards
    setTimeout(() => {
        initializeModalHandlers();
    }, 100);
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

    // Update counts
    updateFilterCounts();

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update filter
            currentFilter = btn.getAttribute('data-filter');

            // Re-render with smooth animation
            const grids = document.querySelectorAll('.work__grid');
            grids.forEach(grid => grid.style.opacity = '0.5');

            setTimeout(() => {
                renderProjects();
                setTimeout(() => {
                    grids.forEach(grid => grid.style.opacity = '1');
                }, 50);
            }, 200);
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

            // Re-render with smooth animation
            const grids = document.querySelectorAll('.work__grid');
            grids.forEach(grid => grid.style.opacity = '0.5');

            setTimeout(() => {
                renderProjects();
                setTimeout(() => {
                    grids.forEach(grid => grid.style.opacity = '1');
                }, 50);
            }, 200);
        });
    });
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

        // Add count badge if it doesn't exist
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
    // The modal.js will handle this, but we need to make sure
    // it re-initializes when we add new project cards
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    // Get all current project items
    const allCurrentProjects = Array.from(document.querySelectorAll('.work__item'));

    // Store in window for modal.js to access
    window.currentProjectsForModal = allCurrentProjects;

    // Trigger modal re-initialization
    if (window.reinitializeModal) {
        window.reinitializeModal();
    }
}

// Add transition styles to grids
function addTransitionStyles() {
    const grids = document.querySelectorAll('.work__grid');
    grids.forEach(grid => {
        grid.style.transition = 'opacity 0.3s ease';
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    addTransitionStyles();
    initPortfolio();
});
