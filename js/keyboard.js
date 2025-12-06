/* ==========================================
   KEYBOARD.JS - Keyboard Shortcuts
   Global keyboard shortcuts for navigation
   ========================================== */

// Keyboard shortcut map
const shortcuts = {
    '/': 'Focus search',
    'Escape': 'Close modal/search',
    'ArrowLeft': 'Previous project (in modal)',
    'ArrowRight': 'Next project (in modal)',
    '?': 'Show this help'
};

// Show help overlay
function showKeyboardHelp() {
    let overlay = document.getElementById('keyboardHelp');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'keyboardHelp';
        overlay.className = 'keyboard-help';

        let content = '<div class="keyboard-help__content">';
        content += '<button class="keyboard-help__close" id="closeKeyboardHelp">×</button>';
        content += '<h3>Keyboard Shortcuts</h3>';
        content += '<div class="keyboard-help__shortcuts">';

        Object.entries(shortcuts).forEach(([key, description]) => {
            content += `<div class="keyboard-help__item">
                <kbd class="keyboard-help__key">${key}</kbd>
                <span class="keyboard-help__desc">${description}</span>
            </div>`;
        });

        content += '</div>';
        content += '<p class="keyboard-help__footer">Press <kbd>?</kbd> or <kbd>Esc</kbd> to close</p>';
        content += '</div>';

        overlay.innerHTML = content;
        document.body.appendChild(overlay);

        // Close handler
        document.getElementById('closeKeyboardHelp').addEventListener('click', hideKeyboardHelp);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) hideKeyboardHelp();
        });
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Hide help overlay
function hideKeyboardHelp() {
    const overlay = document.getElementById('keyboardHelp');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Global keyboard handler
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('projectModal');
    const isModalOpen = modal && modal.classList.contains('active');
    const searchInput = document.getElementById('projectSearch');
    const isInputFocused = document.activeElement.tagName === 'INPUT' ||
                          document.activeElement.tagName === 'TEXTAREA';

    // Show keyboard help (Shift + ?)
    if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        const helpOverlay = document.getElementById('keyboardHelp');
        if (helpOverlay && helpOverlay.classList.contains('active')) {
            hideKeyboardHelp();
        } else {
            showKeyboardHelp();
        }
        return;
    }

    // Focus search (/)
    if (e.key === '/' && !isInputFocused && !isModalOpen) {
        e.preventDefault();
        if (searchInput) {
            searchInput.focus();
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Close modals and overlays (Escape)
    if (e.key === 'Escape') {
        const keyboardHelp = document.getElementById('keyboardHelp');
        if (keyboardHelp && keyboardHelp.classList.contains('active')) {
            hideKeyboardHelp();
            return;
        }

        if (isModalOpen) {
            const closeBtn = document.getElementById('closeModal');
            if (closeBtn) closeBtn.click();
            return;
        }

        if (isInputFocused && searchInput && document.activeElement === searchInput) {
            searchInput.blur();
            const clearBtn = document.getElementById('clearSearch');
            if (clearBtn && clearBtn.style.display !== 'none') {
                clearBtn.click();
            }
            return;
        }
    }

    // Navigate modal (Arrow keys)
    if (isModalOpen) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevBtn = document.getElementById('modalPrev');
            if (prevBtn) prevBtn.click();
            return;
        }

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            const nextBtn = document.getElementById('modalNext');
            if (nextBtn) nextBtn.click();
            return;
        }
    }
});

// Add hint to search input
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('projectSearch');
    if (searchInput) {
        const currentPlaceholder = searchInput.placeholder;
        searchInput.placeholder = `${currentPlaceholder} (Press "/" to focus)`;
    }

    // Add keyboard shortcut indicator to UI
    const navLinks = document.querySelector('.nav__links');
    if (navLinks) {
        const helpLink = document.createElement('li');
        helpLink.innerHTML = '<button class="nav__link nav__link--keyboard" id="showKeyboardHelp" aria-label="Keyboard shortcuts">⌨️</button>';
        navLinks.appendChild(helpLink);

        document.getElementById('showKeyboardHelp').addEventListener('click', (e) => {
            e.preventDefault();
            showKeyboardHelp();
        });
    }
});
