/* ==========================================
   PORTFOLIO.JS - Complete Project Management System
   Handles: Loading, Filtering, Sorting, Pagination,
   Search, Archive, and Direct Project URLs
   ========================================== */

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
    projectsPerPage: 6,          // Projects to show initially in archive
    projectsToLoadMore: 6,       // Projects to load on "Load More"
    searchDebounceMs: 300,       // Debounce for search input
    animationDuration: 300,      // Animation duration in ms
};

// ==========================================
// GLOBAL STATE
// ==========================================
let allProjects = [];
let filteredProjects = [];
let currentFilter = 'all';
let currentSort = 'featured';
let searchQuery = '';
let archiveDisplayed = 0;        // How many archive items currently shown
let isInitialized = false;

// ==========================================
// INITIALIZATION
// ==========================================
async function initPortfolio() {
    if (isInitialized) return;

    try {
        const response = await fetch('data/projects.json');

        if (!response.ok) {
            throw new Error('Failed to fetch projects.json');
        }

        const data = await response.json();
        allProjects = data.projects || [];
        filteredProjects = [...allProjects];

        if (allProjects.length > 0) {
            // Clear hardcoded content and render from JSON
            renderAllProjects();
            initializeFilters();
            initializeSort();
            initializeSearch();
            updateFilterCounts();
            handleDirectProjectURL();

            // Listen for URL changes
            window.addEventListener('hashchange', handleDirectProjectURL);
        }

        isInitialized = true;

    } catch (error) {
        console.warn('Portfolio: Using hardcoded HTML fallback.', error);
        // Keep existing HTML, just initialize handlers
        initializeFiltersForHardcoded();
        initializeSortForHardcoded();
        initializeSearch();
        handleDirectProjectURL();
        window.addEventListener('hashchange', handleDirectProjectURL);
        isInitialized = true;
    }
}

// ==========================================
// PROJECT RENDERING
// ==========================================
function renderAllProjects() {
    const featuredGrid = document.getElementById('featuredGrid');
    const recentGrid = document.getElementById('recentGrid');
    const archiveGrid = document.getElementById('archiveGrid');

    if (!featuredGrid || !recentGrid) return;

    // Apply current filter and sort
    let projectsToShow = applyFilterAndSort();

    // Separate by type
    const featured = projectsToShow.filter(p => p.featured);
    const nonFeatured = projectsToShow.filter(p => !p.featured);

    // Render featured projects
    featuredGrid.innerHTML = '';
    featured.forEach(project => {
        featuredGrid.appendChild(createProjectCard(project));
    });

    // Render recent projects (first 3 non-featured)
    recentGrid.innerHTML = '';
    const recentProjects = nonFeatured.slice(0, 3);
    recentProjects.forEach(project => {
        recentGrid.appendChild(createProjectCard(project));
    });

    // Render archive projects (remaining non-featured)
    if (archiveGrid) {
        archiveGrid.innerHTML = '';
        const archiveProjects = nonFeatured.slice(3);
        archiveDisplayed = Math.min(CONFIG.projectsPerPage, archiveProjects.length);

        archiveProjects.slice(0, archiveDisplayed).forEach(project => {
            archiveGrid.appendChild(createProjectCard(project));
        });

        // Update load more button visibility
        updateLoadMoreButton(archiveProjects.length);
    }

    // Update section visibility
    updateSectionVisibility(featured, nonFeatured);

    // Update results count
    updateResultsCount(projectsToShow.length);

    // Reinitialize modal handlers for new cards
    // Wait for DOM to settle before reinitializing modal
    requestAnimationFrame(() => {
        setTimeout(() => {
            if (window.reinitializeModal) {
                window.reinitializeModal();
            }
        }, 100);
    });
}

function createProjectCard(project) {
    const article = document.createElement('article');
    article.className = `work__item ${project.layout || ''} loading`;
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

    // Create image with loading state
    const img = document.createElement('img');
    img.src = project.thumbnail || project.image;
    img.alt = project.title;
    img.className = 'work__item-image';
    img.loading = 'lazy';
    img.decoding = 'async';

    // Remove loading state when image loads
    img.onload = () => {
        article.classList.remove('loading');
        article.classList.add('visible');
    };

    // Fallback: remove loading after timeout
    setTimeout(() => {
        article.classList.remove('loading');
        article.classList.add('visible');
    }, 3000);

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

    // Create quick preview (visible on hover) - no title since it's already shown
    const preview = document.createElement('div');
    preview.className = 'work__item-preview';

    const previewTags = document.createElement('p');
    previewTags.className = 'work__item-preview__tags';
    previewTags.textContent = project.tags.join(' · ');

    const previewDesc = document.createElement('p');
    previewDesc.className = 'work__item-preview__description';
    previewDesc.textContent = project.description;

    const previewCta = document.createElement('span');
    previewCta.className = 'work__item-preview__cta';
    previewCta.innerHTML = 'View Project <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

    preview.appendChild(previewTags);
    preview.appendChild(previewDesc);
    preview.appendChild(previewCta);

    // Assemble card
    article.appendChild(img);
    article.appendChild(meta);
    article.appendChild(overlay);
    article.appendChild(content);
    article.appendChild(preview);

    // Note: Click handler is managed by modal.js
    // Don't add duplicate click handlers here

    return article;
}

// ==========================================
// FILTER & SORT LOGIC
// ==========================================
function applyFilterAndSort() {
    let filtered = [...allProjects];

    // Apply search filter
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.tags.some(tag => tag.toLowerCase().includes(query)) ||
            p.description.toLowerCase().includes(query) ||
            (p.tools && p.tools.some(tool => tool.toLowerCase().includes(query))) ||
            p.category.toLowerCase().includes(query)
        );
    }

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

function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        // Remove any existing listeners by cloning
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            newBtn.classList.add('active');

            // Update filter
            currentFilter = newBtn.getAttribute('data-filter');

            // Re-render with animation
            animateGridTransition(() => renderAllProjects());
        });
    });

    // Also handle service tags in About section
    document.querySelectorAll('.about__service-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const filter = tag.getAttribute('data-filter');
            if (filter) {
                currentFilter = filter;

                // Update filter buttons
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.toggle('active', b.getAttribute('data-filter') === filter);
                });

                // Scroll to work section and render
                document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => animateGridTransition(() => renderAllProjects()), 300);
            }
        });
    });
}

function initializeFiltersForHardcoded() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const allItems = document.querySelectorAll('.work__item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            allItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

function initializeSort() {
    const sortButtons = document.querySelectorAll('.sort-btn');

    sortButtons.forEach(btn => {
        // Remove any existing listeners by cloning
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', () => {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            newBtn.classList.add('active');

            currentSort = newBtn.getAttribute('data-sort');

            animateGridTransition(() => renderAllProjects());
        });
    });
}

function initializeSortForHardcoded() {
    // For hardcoded HTML, sorting is limited
    // Just toggle active states
    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sortButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

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

        // Remove existing count
        const existingCount = btn.querySelector('.filter-count');
        if (existingCount) existingCount.remove();

        // Add count badge
        const countSpan = document.createElement('span');
        countSpan.className = 'filter-count';
        countSpan.textContent = ` (${count})`;
        btn.appendChild(countSpan);
    });
}

// ==========================================
// SEARCH FUNCTIONALITY
// ==========================================
function initializeSearch() {
    // Create search container if it doesn't exist
    let searchContainer = document.querySelector('.work__search');

    if (!searchContainer) {
        searchContainer = createSearchUI();
        const controls = document.querySelector('.work__controls');
        if (controls) {
            controls.insertBefore(searchContainer, controls.firstChild);
        }
    }

    const searchInput = document.getElementById('projectSearch');
    const clearBtn = document.getElementById('clearSearch');

    if (searchInput) {
        let debounceTimer;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchQuery = e.target.value;

                // Show/hide clear button
                if (clearBtn) {
                    clearBtn.style.display = searchQuery ? 'flex' : 'none';
                }

                if (allProjects.length > 0) {
                    animateGridTransition(() => renderAllProjects());
                } else {
                    filterHardcodedBySearch(searchQuery);
                }
            }, CONFIG.searchDebounceMs);
        });

        // Keyboard shortcut: Ctrl+K or Cmd+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
            // Escape to clear search
            if (e.key === 'Escape' && document.activeElement === searchInput) {
                searchInput.value = '';
                searchQuery = '';
                if (clearBtn) clearBtn.style.display = 'none';
                if (allProjects.length > 0) {
                    renderAllProjects();
                } else {
                    filterHardcodedBySearch('');
                }
                searchInput.blur();
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const searchInput = document.getElementById('projectSearch');
            if (searchInput) {
                searchInput.value = '';
                searchQuery = '';
                clearBtn.style.display = 'none';
                if (allProjects.length > 0) {
                    animateGridTransition(() => renderAllProjects());
                } else {
                    filterHardcodedBySearch('');
                }
            }
        });
    }
}

function createSearchUI() {
    const container = document.createElement('div');
    container.className = 'work__search';
    container.innerHTML = `
        <div class="search-wrapper">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
                type="text"
                id="projectSearch"
                class="search-input"
                placeholder="Search projects... (Ctrl+K)"
                aria-label="Search projects"
            >
            <button class="search-clear" id="clearSearch" style="display: none;" aria-label="Clear search">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
            <span class="search-shortcut">Ctrl+K</span>
        </div>
    `;
    return container;
}

function filterHardcodedBySearch(query) {
    const allItems = document.querySelectorAll('.work__item');
    const lowerQuery = query.toLowerCase().trim();

    allItems.forEach(item => {
        if (!lowerQuery) {
            item.classList.remove('hidden');
            return;
        }

        const title = (item.getAttribute('data-title') || '').toLowerCase();
        const tags = (item.getAttribute('data-tags') || '').toLowerCase();
        const description = (item.getAttribute('data-description') || '').toLowerCase();
        const category = (item.getAttribute('data-category') || '').toLowerCase();

        const matches = title.includes(lowerQuery) ||
                       tags.includes(lowerQuery) ||
                       description.includes(lowerQuery) ||
                       category.includes(lowerQuery);

        item.classList.toggle('hidden', !matches);
    });
}

// ==========================================
// LOAD MORE / PAGINATION
// ==========================================
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (loadMoreBtn) {
        // Remove existing listeners
        const newBtn = loadMoreBtn.cloneNode(true);
        loadMoreBtn.parentNode.replaceChild(newBtn, loadMoreBtn);

        newBtn.addEventListener('click', loadMoreProjects);
    }
}

function loadMoreProjects() {
    const archiveGrid = document.getElementById('archiveGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!archiveGrid) return;

    const nonFeatured = filteredProjects.filter(p => !p.featured);
    const archiveProjects = nonFeatured.slice(3); // Skip first 3 (shown in recent)

    const nextBatch = archiveProjects.slice(
        archiveDisplayed,
        archiveDisplayed + CONFIG.projectsToLoadMore
    );

    nextBatch.forEach(project => {
        const card = createProjectCard(project);
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        archiveGrid.appendChild(card);

        // Animate in
        requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    });

    archiveDisplayed += nextBatch.length;

    // Reinitialize modal
    if (window.reinitializeModal) {
        window.reinitializeModal();
    }

    // Update button state
    updateLoadMoreButton(archiveProjects.length);
}

function updateLoadMoreButton(totalArchiveProjects) {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');

    if (!loadMoreBtn || !loadMoreContainer) return;

    if (archiveDisplayed >= totalArchiveProjects) {
        loadMoreBtn.textContent = 'All Projects Loaded';
        loadMoreBtn.disabled = true;
    } else {
        const remaining = totalArchiveProjects - archiveDisplayed;
        loadMoreBtn.textContent = `Load More (${remaining} remaining)`;
        loadMoreBtn.disabled = false;
    }

    // Show container only if there are archive projects
    loadMoreContainer.style.display = totalArchiveProjects > 0 ? 'flex' : 'none';
}

// ==========================================
// DIRECT PROJECT URLS
// ==========================================
function handleDirectProjectURL() {
    const hash = window.location.hash;

    // Check for project URL pattern: #project/project-id
    const projectMatch = hash.match(/^#project\/(.+)$/);

    if (projectMatch) {
        const projectId = projectMatch[1];
        openProjectById(projectId);
    }
}

function openProjectById(projectId) {
    // Try to find in JSON projects first
    const project = allProjects.find(p => p.id === projectId);

    if (project) {
        // Create a temporary element with project data
        const tempElement = createProjectCard(project);
        document.body.appendChild(tempElement);
        tempElement.style.display = 'none';

        // Find index in current filtered list
        const allItems = Array.from(document.querySelectorAll('.work__item'));
        const index = allItems.findIndex(item => item.getAttribute('data-project-id') === projectId);

        // Open modal
        if (window.openModalWithProject) {
            window.openModalWithProject(tempElement, index >= 0 ? index : 0);
        } else {
            // Fallback: trigger click on the actual project card
            const projectCard = document.querySelector(`[data-project-id="${projectId}"]`);
            if (projectCard) {
                setTimeout(() => projectCard.click(), 100);
            }
        }

        tempElement.remove();
        return;
    }

    // Fallback: look in DOM
    const projectCard = document.querySelector(`[data-project-id="${projectId}"]`);
    if (projectCard) {
        setTimeout(() => projectCard.click(), 100);
    }
}

function updateURLForProject(projectId) {
    const newURL = `#project/${projectId}`;
    history.pushState(null, '', newURL);
}

function clearProjectURL() {
    if (window.location.hash.startsWith('#project/')) {
        history.pushState(null, '', '#work');
    }
}

// ==========================================
// ARCHIVE SECTION
// ==========================================
function initializeArchive() {
    const viewArchiveBtn = document.getElementById('viewArchiveBtn');
    const viewArchiveContainer = document.getElementById('viewArchiveContainer');
    const archiveSection = document.getElementById('archiveSection');
    const closeArchiveBtn = document.getElementById('closeArchiveBtn');

    if (viewArchiveBtn && archiveSection && viewArchiveContainer) {
        viewArchiveBtn.addEventListener('click', () => {
            archiveSection.style.display = 'block';
            viewArchiveContainer.style.display = 'none';

            // Smooth scroll to archive
            setTimeout(() => {
                archiveSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

            // Initialize load more
            initializeLoadMore();
        });
    }

    if (closeArchiveBtn && archiveSection && viewArchiveContainer) {
        closeArchiveBtn.addEventListener('click', () => {
            viewArchiveContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                archiveSection.style.display = 'none';
                viewArchiveContainer.style.display = 'flex';
            }, 400);
        });
    }
}

// ==========================================
// UI HELPERS
// ==========================================
function animateGridTransition(callback) {
    const grids = document.querySelectorAll('.work__grid');

    grids.forEach(grid => {
        grid.style.opacity = '0.5';
        grid.style.transform = 'scale(0.98)';
    });

    setTimeout(() => {
        callback();

        requestAnimationFrame(() => {
            grids.forEach(grid => {
                grid.style.opacity = '1';
                grid.style.transform = 'scale(1)';
            });
        });
    }, CONFIG.animationDuration);
}

function updateSectionVisibility(featured, nonFeatured) {
    const featuredSection = document.querySelector('.work__grid--featured')?.closest('.work__section');
    const recentSection = document.querySelector('.work__grid--recent')?.closest('.work__section');
    const viewArchiveContainer = document.getElementById('viewArchiveContainer');

    // Show/hide featured section
    if (featuredSection) {
        featuredSection.style.display = featured.length > 0 ? 'block' : 'none';
    }

    // Show/hide recent section
    if (recentSection) {
        recentSection.style.display = nonFeatured.length > 0 ? 'block' : 'none';
    }

    // Show archive button only if there are more than 3 non-featured projects
    if (viewArchiveContainer) {
        const archiveSection = document.getElementById('archiveSection');
        const hasArchiveProjects = nonFeatured.length > 3;

        // Only show if archive is not already open
        if (!archiveSection || archiveSection.style.display === 'none') {
            viewArchiveContainer.style.display = hasArchiveProjects ? 'flex' : 'none';
        }
    }

    // Show "no results" message if empty
    showNoResultsMessage(featured.length === 0 && nonFeatured.length === 0);
}

function showNoResultsMessage(show) {
    let noResults = document.getElementById('noResultsMessage');

    if (show) {
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.id = 'noResultsMessage';
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <div class="no-results__icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="48" height="48">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <h3 class="no-results__title">No projects found</h3>
                <p class="no-results__text">Try adjusting your search or filter criteria</p>
                <button class="no-results__btn" onclick="resetFilters()">Reset Filters</button>
            `;

            const workSection = document.querySelector('.work .container');
            if (workSection) {
                workSection.appendChild(noResults);
            }
        }
        noResults.style.display = 'block';
    } else if (noResults) {
        noResults.style.display = 'none';
    }
}

function updateResultsCount(count) {
    let resultsCount = document.querySelector('.results-count');

    if (!resultsCount) {
        resultsCount = document.createElement('span');
        resultsCount.className = 'results-count';

        const header = document.querySelector('.section__header > div');
        if (header) {
            header.appendChild(resultsCount);
        }
    }

    if (searchQuery || currentFilter !== 'all') {
        resultsCount.textContent = `${count} project${count !== 1 ? 's' : ''} found`;
        resultsCount.style.display = 'block';
    } else {
        resultsCount.style.display = 'none';
    }
}

// Global function to reset filters
window.resetFilters = function() {
    currentFilter = 'all';
    currentSort = 'featured';
    searchQuery = '';

    // Reset UI
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
    });
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-sort') === 'featured');
    });

    const searchInput = document.getElementById('projectSearch');
    if (searchInput) searchInput.value = '';

    const clearBtn = document.getElementById('clearSearch');
    if (clearBtn) clearBtn.style.display = 'none';

    if (allProjects.length > 0) {
        renderAllProjects();
    } else {
        document.querySelectorAll('.work__item').forEach(item => {
            item.classList.remove('hidden');
        });
    }
};

// ==========================================
// GRID TRANSITION STYLES
// ==========================================
function addTransitionStyles() {
    const grids = document.querySelectorAll('.work__grid');
    grids.forEach(grid => {
        grid.style.transition = `opacity ${CONFIG.animationDuration}ms ease, transform ${CONFIG.animationDuration}ms ease`;
    });
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    addTransitionStyles();
    initPortfolio();
    initializeArchive();
});

// Expose for external use
window.portfolioState = {
    get projects() { return allProjects; },
    get filtered() { return filteredProjects; },
    get filter() { return currentFilter; },
    get sort() { return currentSort; },
    get search() { return searchQuery; }
};
