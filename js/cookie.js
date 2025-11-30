// Cookie Consent Logic
(function() {
    const cookieConsent = document.getElementById('cookieConsent');
    const cookieOk = document.getElementById('cookieOk');

    // Check if user has already acknowledged the cookie notice
    const cookieAcknowledged = localStorage.getItem('cookieAcknowledged');

    if (!cookieAcknowledged) {
        // Show banner after a short delay
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 2000);
    }

    cookieOk.addEventListener('click', () => {
        localStorage.setItem('cookieAcknowledged', 'true');
        cookieConsent.classList.remove('show');
    });
})();
