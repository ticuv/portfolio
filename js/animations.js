// Scroll-triggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Add staggered delay to work items
document.querySelectorAll('.work__item.fade-in').forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
});

// Add staggered delay to stats
document.querySelectorAll('.about__stats .stat').forEach((stat, index) => {
    stat.style.opacity = '0';
    stat.style.transform = 'translateY(20px)';
    stat.style.transition = 'opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out)';
    stat.style.transitionDelay = `${index * 0.1}s`;
});

// Trigger stats animation when parent is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat').forEach(stat => {
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0)';
            });
        }
    });
}, observerOptions);

const statsContainer = document.querySelector('.about__stats');
if (statsContainer) {
    statsObserver.observe(statsContainer);
}

// Automatic Aspect Ratio Detection for Bento Grid
(function() {
    const workItems = document.querySelectorAll('.work__item');

    workItems.forEach(item => {
        const img = item.querySelector('.work__item-image');
        if (!img) return;

        // Skip if already has a manual class
        if (item.classList.contains('featured') ||
            item.classList.contains('portrait') ||
            item.classList.contains('wide') ||
            item.classList.contains('square')) {
            return;
        }

        // Function to apply correct class based on aspect ratio
        const applyAspectClass = () => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            const ratio = width / height;

            // Apply class based on aspect ratio
            if (ratio < 0.8) {
                item.classList.add('portrait');
            } else if (ratio > 1.8) {
                item.classList.add('wide');
            } else if (ratio >= 0.9 && ratio <= 1.1) {
                item.classList.add('square');
            }
        };

        // If image is already loaded (cached)
        if (img.complete && img.naturalWidth > 0) {
            applyAspectClass();
        } else {
            img.addEventListener('load', applyAspectClass);
        }
    });
})();

// Smooth section reveal on scroll
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.work__section, .work__divider').forEach(section => {
    sectionObserver.observe(section);
});

// Project Filtering & Sorting
const filterButtons = document.querySelectorAll('.filter-btn');
const sortButtons = document.querySelectorAll('.sort-btn');
let currentFilter = 'all';
let currentSort = 'featured';

// Filter functionality
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.getAttribute('data-filter');
        applyFilterAndSort();
    });
});

// Sort functionality
sortButtons.forEach(button => {
    button.addEventListener('click', () => {
        sortButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentSort = button.getAttribute('data-sort');
        applyFilterAndSort();
    });
});

function applyFilterAndSort() {
    const allWorkItems = document.querySelectorAll('.work__item');
    let visibleItems = Array.from(allWorkItems);

    // Apply filter
    visibleItems.forEach(item => {
        const categories = item.getAttribute('data-category');
        if (currentFilter === 'all') {
            item.classList.remove('hidden');
        } else if (categories && categories.includes(currentFilter)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });

    // Apply sort
    visibleItems = visibleItems.filter(item => !item.classList.contains('hidden'));

    if (currentSort === 'latest') {
        visibleItems.sort((a, b) => {
            const yearA = parseInt(a.getAttribute('data-year')) || 0;
            const yearB = parseInt(b.getAttribute('data-year')) || 0;
            return yearB - yearA;
        });
    } else if (currentSort === 'oldest') {
        visibleItems.sort((a, b) => {
            const yearA = parseInt(a.getAttribute('data-year')) || 0;
            const yearB = parseInt(b.getAttribute('data-year')) || 0;
            return yearA - yearB;
        });
    } else if (currentSort === 'featured') {
        visibleItems.sort((a, b) => {
            const featuredA = a.getAttribute('data-featured') === 'true' ? 1 : 0;
            const featuredB = b.getAttribute('data-featured') === 'true' ? 1 : 0;
            return featuredB - featuredA;
        });
    }

    // Re-append items in sorted order
    const grids = [
        document.getElementById('featuredGrid'),
        document.getElementById('recentGrid'),
        document.getElementById('archiveGrid')
    ];

    grids.forEach(grid => {
        if (!grid) return;
        const gridItems = Array.from(grid.querySelectorAll('.work__item'));
        gridItems.forEach(item => {
            const index = visibleItems.indexOf(item);
            if (index !== -1) {
                item.style.order = index;
            }
        });
    });
}

// Make Service Tags Clickable to Filter Work
(function() {
    const serviceTags = document.querySelectorAll('.about__service-tag[data-filter]');
    const filterButtons = document.querySelectorAll('.filter-btn');

    serviceTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const filter = tag.getAttribute('data-filter');

            // Scroll to work section
            document.querySelector('#work').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Trigger the filter after a short delay
            setTimeout(() => {
                const targetButton = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
                if (targetButton) {
                    targetButton.click();
                }
            }, 500);
        });
    });
})();
