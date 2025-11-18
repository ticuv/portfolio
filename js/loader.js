/* ==========================================
   LOADER.JS - Logo Animation
   Handles the animated logo on page load
   ========================================== */

// Get loader element
const loader = document.getElementById('loader');

// Hide loader background after logo reaches final position
setTimeout(() => {
    loader.classList.add('hidden');
}, 2300); // Wait for animation to complete
