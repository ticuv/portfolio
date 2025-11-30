// Modal functionality
const modal = document.getElementById('projectModal');
const closeModal = document.getElementById('closeModal');
const workItems = document.querySelectorAll('.work__item');

// Open modal when work item is clicked
workItems.forEach(item => {
    item.addEventListener('click', () => {
        const title = item.dataset.title;
        const tags = item.dataset.tags;
        const description = item.dataset.description;
        const image = item.dataset.image;

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

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
const closeModalHandler = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
};

closeModal.addEventListener('click', closeModalHandler);

// Close modal when clicking outside content
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalHandler();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModalHandler();
    }
});
