// Back to Top Button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Scroll Progress Bar
(function() {
    const scrollProgress = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
})();

// Floating CTA Button
(function() {
    const floatingCta = document.getElementById('floatingCta');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroHeight = document.querySelector('.hero').offsetHeight;

        // Show after scrolling past hero section
        if (scrolled > heroHeight * 0.5) {
            floatingCta.classList.add('show');
        } else {
            floatingCta.classList.remove('show');
        }
    });

    floatingCta.addEventListener('click', () => {
        document.querySelector('#contact').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
})();
