/* ==========================================
   THEME.JS - Enhanced Theme Management
   Supports Dark, Light, and Auto modes
   ========================================== */

(function() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const logoImage = document.getElementById('logoImage');

    // Theme states: 'dark', 'light', 'auto'
    let currentMode = localStorage.getItem('themeMode') || 'auto';
    let systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Add smooth transition class to html
    html.style.transition = 'background-color 0.3s ease, color 0.3s ease';

    // Apply theme based on mode
    function applyTheme() {
        let theme;

        if (currentMode === 'auto') {
            theme = systemPrefersDark ? 'dark' : 'light';
        } else {
            theme = currentMode;
        }

        html.setAttribute('data-theme', theme);

        // Update logo filter
        if (logoImage) {
            logoImage.style.filter = theme === 'light' ? 'invert(1)' : 'invert(0)';
            logoImage.style.transition = 'filter 0.3s ease';
        }

        // Update icon
        updateIcon();
    }

    // Update icon based on current mode
    function updateIcon() {
        if (!themeIcon) return;

        if (currentMode === 'auto') {
            themeIcon.textContent = '🌓'; // Auto mode icon
        } else if (currentMode === 'dark') {
            themeIcon.textContent = '☀️'; // Sun (click to go light)
        } else {
            themeIcon.textContent = '🌙'; // Moon (click to go dark)
        }

        // Add title attribute for tooltip
        const modeNames = {
            'auto': 'Auto (System)',
            'dark': 'Dark Mode',
            'light': 'Light Mode'
        };
        themeToggle.setAttribute('title', `Current: ${modeNames[currentMode]}. Click to cycle.`);
    }

    // Cycle through theme modes: auto → dark → light → auto
    function cycleTheme() {
        if (currentMode === 'auto') {
            currentMode = 'dark';
        } else if (currentMode === 'dark') {
            currentMode = 'light';
        } else {
            currentMode = 'auto';
        }

        localStorage.setItem('themeMode', currentMode);
        applyTheme();

        // Show brief notification
        showThemeNotification();
    }

    // Show brief theme notification
    function showThemeNotification() {
        const existingNotif = document.querySelector('.theme-notification');
        if (existingNotif) existingNotif.remove();

        const notification = document.createElement('div');
        notification.className = 'theme-notification';

        const modeText = {
            'auto': `Auto Mode (${systemPrefersDark ? 'Dark' : 'Light'})`,
            'dark': 'Dark Mode',
            'light': 'Light Mode'
        };

        notification.textContent = modeText[currentMode];
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 1500);
    }

    // Listen for system theme changes (only when in auto mode)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        systemPrefersDark = e.matches;
        if (currentMode === 'auto') {
            applyTheme();
        }
    });

    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', cycleTheme);
    }

    // Initialize theme on load
    applyTheme();

    // Ensure smooth transitions don't affect initial load
    setTimeout(() => {
        document.body.classList.add('theme-transitions-enabled');
    }, 100);
})();
