/* ==========================================
   FORMS.JS - Contact Form Validation
   Validates contact form with real-time feedback
   ========================================== */

// Get form elements
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

// Form submission handler
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.form-input, .form-textarea').forEach(el => {
        el.classList.remove('error');
    });
    document.querySelectorAll('.form-message').forEach(el => {
        el.classList.remove('show');
    });
    
    // Validate name
    if (nameInput.value.trim().length < 2) {
        nameInput.classList.add('error');
        document.getElementById('nameError').textContent = 'Please enter your name';
        document.getElementById('nameError').classList.add('show');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailInput.classList.add('error');
        document.getElementById('emailError').textContent = 'Please enter a valid email';
        document.getElementById('emailError').classList.add('show');
        isValid = false;
    }
    
    // Validate message
    if (messageInput.value.trim().length < 10) {
        messageInput.classList.add('error');
        document.getElementById('messageError').textContent = 'Please enter a message (min 10 characters)';
        document.getElementById('messageError').classList.add('show');
        isValid = false;
    }
    
    if (isValid) {
        // Success - show confirmation
        alert('Message sent successfully! (This is a demo - connect to your backend)');
        contactForm.reset();
    }
});

// Real-time validation feedback
nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length >= 2) {
        nameInput.classList.remove('error');
        document.getElementById('nameError').classList.remove('show');
    }
});

emailInput.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailInput.value)) {
        emailInput.classList.remove('error');
        document.getElementById('emailError').classList.remove('show');
    }
});

messageInput.addEventListener('input', () => {
    if (messageInput.value.trim().length >= 10) {
        messageInput.classList.remove('error');
        document.getElementById('messageError').classList.remove('show');
    }
});
