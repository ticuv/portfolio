/* ==========================================
   ADMIN.JS - Portfolio Admin Panel
   Manage projects locally
   ========================================== */

let projects = [];
let editingIndex = -1;

// Load projects from file
async function loadProjects() {
    try {
        const response = await fetch('../data/projects.json');
        const data = await response.json();
        projects = data.projects || [];
        renderProjects();
        showStatus('Projects loaded successfully', 'success');
    } catch (error) {
        console.error('Error loading projects:', error);
        showStatus('Error loading projects. Make sure projects.json exists.', 'error');
        projects = [];
    }
}

// Render projects list
function renderProjects() {
    const container = document.getElementById('projectsList');

    if (projects.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 3rem;">No projects yet. Click "Add New Project" to get started.</p>';
        return;
    }

    container.innerHTML = projects.map((project, index) => `
        <div class="project-card">
            <img src="${project.thumbnail || project.image}" alt="${project.title}" class="project-thumbnail" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22><rect width=%22150%22 height=%22150%22 fill=%22%231A1A1A%22/><text x=%2250%%22 y=%2250%%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23666%22 text-anchor=%22middle%22 dy=%22.3em%22>No Image</text></svg>'">
            <div class="project-info">
                <h3>${project.title}</h3>
                <div class="project-meta">
                    ${project.featured ? '<span class="badge badge-featured">Featured</span>' : ''}
                    <span class="badge">${project.category}</span>
                    <span class="badge">${project.year}</span>
                    ${project.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}
                </div>
                <p class="project-description">${project.description}</p>
                ${project.tools && project.tools.length > 0 ? `<p style="font-size: 0.75rem; color: var(--text-secondary);">Tools: ${project.tools.join(', ')}</p>` : ''}
            </div>
            <div class="project-actions">
                <button class="btn btn-secondary" onclick="editProject(${index})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProject(${index})">Delete</button>
                ${index > 0 ? `<button class="btn btn-secondary" onclick="moveProject(${index}, 'up')">↑</button>` : ''}
                ${index < projects.length - 1 ? `<button class="btn btn-secondary" onclick="moveProject(${index}, 'down')">↓</button>` : ''}
            </div>
        </div>
    `).join('');
}

// Show status message
function showStatus(message, type) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;

    setTimeout(() => {
        statusEl.className = 'status-message';
    }, 5000);
}

// Open modal for adding new project
document.getElementById('addProjectBtn').addEventListener('click', () => {
    editingIndex = -1;
    document.getElementById('modalTitle').textContent = 'Add New Project';
    document.getElementById('projectForm').reset();
    document.getElementById('projectYear').value = new Date().getFullYear();
    document.getElementById('projectId').removeAttribute('readonly');
    document.getElementById('projectModal').classList.add('active');
});

// Edit project
window.editProject = function(index) {
    editingIndex = index;
    const project = projects[index];

    document.getElementById('modalTitle').textContent = 'Edit Project';
    document.getElementById('projectId').value = project.id;
    document.getElementById('projectId').setAttribute('readonly', 'true');
    document.getElementById('projectTitle').value = project.title;
    document.getElementById('projectTags').value = project.tags.join(', ');
    document.getElementById('projectDescription').value = project.description;
    document.getElementById('projectImage').value = project.image;
    document.getElementById('projectThumbnail').value = project.thumbnail || '';
    document.getElementById('projectCategory').value = project.category;
    document.getElementById('projectYear').value = project.year;
    document.getElementById('projectLayout').value = project.layout || '';
    document.getElementById('projectTools').value = (project.tools || []).join(', ');
    document.getElementById('projectClient').value = project.client || '';
    document.getElementById('projectLink').value = project.link || '';
    document.getElementById('projectFeatured').checked = project.featured;

    document.getElementById('projectModal').classList.add('active');
};

// Delete project
window.deleteProject = function(index) {
    const project = projects[index];

    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
        projects.splice(index, 1);
        renderProjects();
        showStatus('Project deleted successfully', 'success');
    }
};

// Move project up/down
window.moveProject = function(index, direction) {
    if (direction === 'up' && index > 0) {
        [projects[index], projects[index - 1]] = [projects[index - 1], projects[index]];
    } else if (direction === 'down' && index < projects.length - 1) {
        [projects[index], projects[index + 1]] = [projects[index + 1], projects[index]];
    }

    renderProjects();
    showStatus('Project order updated', 'success');
};

// Close modal
function closeModal() {
    document.getElementById('projectModal').classList.remove('active');
    document.getElementById('projectForm').reset();
    editingIndex = -1;
}

document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelBtn').addEventListener('click', closeModal);

// Save project
document.getElementById('projectForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const projectData = {
        id: document.getElementById('projectId').value.trim(),
        title: document.getElementById('projectTitle').value.trim(),
        tags: document.getElementById('projectTags').value.split(',').map(t => t.trim()).filter(t => t),
        description: document.getElementById('projectDescription').value.trim(),
        image: document.getElementById('projectImage').value.trim(),
        thumbnail: document.getElementById('projectThumbnail').value.trim() || document.getElementById('projectImage').value.trim(),
        category: document.getElementById('projectCategory').value,
        year: parseInt(document.getElementById('projectYear').value),
        featured: document.getElementById('projectFeatured').checked,
        layout: document.getElementById('projectLayout').value,
        tools: document.getElementById('projectTools').value.split(',').map(t => t.trim()).filter(t => t),
        client: document.getElementById('projectClient').value.trim(),
        link: document.getElementById('projectLink').value.trim()
    };

    // Validate unique ID
    if (editingIndex === -1) {
        const existingIds = projects.map(p => p.id);
        if (existingIds.includes(projectData.id)) {
            alert('Project ID must be unique!');
            return;
        }
    }

    if (editingIndex === -1) {
        // Add new project
        projects.push(projectData);
        showStatus('Project added successfully', 'success');
    } else {
        // Update existing project
        projects[editingIndex] = projectData;
        showStatus('Project updated successfully', 'success');
    }

    renderProjects();
    closeModal();
});

// Download projects.json
document.getElementById('downloadBtn').addEventListener('click', () => {
    const data = { projects };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects.json';
    a.click();

    URL.revokeObjectURL(url);
    showStatus('projects.json downloaded! Upload it to your server to publish changes.', 'success');
});

// Upload projects.json
document.getElementById('uploadBtn').addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);

            if (!data.projects || !Array.isArray(data.projects)) {
                throw new Error('Invalid projects.json format');
            }

            projects = data.projects;
            renderProjects();
            showStatus('projects.json uploaded successfully', 'success');
        } catch (error) {
            showStatus('Error parsing JSON file: ' + error.message, 'error');
        }
    };

    reader.readAsText(file);
    e.target.value = ''; // Reset input
});

// Refresh
document.getElementById('refreshBtn').addEventListener('click', () => {
    loadProjects();
});

// Initialize
loadProjects();
