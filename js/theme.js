// Theme Toggle
(function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const logoImage = document.getElementById('logoImage');
    const html = document.documentElement;

    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', currentTheme);
    themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    // Use filter to invert logo color for light mode
    if (currentTheme === 'light') {
        logoImage.style.filter = 'invert(1)';
    } else {
        logoImage.style.filter = 'invert(0)';
    }

    themeToggle.addEventListener('click', () => {
        const theme = html.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';

        // Use filter to invert logo color for light mode
        if (newTheme === 'light') {
            logoImage.style.filter = 'invert(1)';
        } else {
            logoImage.style.filter = 'invert(0)';
        }
    });
})();
