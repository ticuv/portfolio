// View Archive Button
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

        // Show load more if there are more projects to load
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        if (loadMoreContainer) {
            loadMoreContainer.style.display = 'flex';
        }
    });
}

// Close Archive Button
if (closeArchiveBtn && archiveSection && viewArchiveContainer) {
    closeArchiveBtn.addEventListener('click', () => {
        // Smooth scroll back to the view archive button position
        viewArchiveContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Hide archive after scroll animation
        setTimeout(() => {
            archiveSection.style.display = 'none';
            viewArchiveContainer.style.display = 'flex';
        }, 400);
    });
}

// Load More functionality (for future use with dynamic content)
const loadMoreBtn = document.getElementById('loadMoreBtn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        // This is a placeholder for when you add more projects
        // For now, it just disables the button
        loadMoreBtn.textContent = 'No More Projects';
        loadMoreBtn.disabled = true;

        // In the future, you'd load more projects here:
        // loadMoreProjects().then(() => { ... });
    });
}
