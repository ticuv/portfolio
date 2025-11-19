/* ==========================================
   FORMS.JS - Contact Form Validation
   Validates contact form with real-time feedback
   ========================================== */

// Get form elements
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const formStatus = document.getElementById('formStatus');

// Form submission handler
contactForm.addEventListener('submit', async (e) => {
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
        // Disable button during submission
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Send to Formspree
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
                formStatus.style.color = '#4ade80';
                contactForm.reset();
                
                // Track form submission in Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submission', {
                        'event_category': 'Contact',
                        'event_label': 'Contact Form'
                    });
                }
            } else {
                formStatus.textContent = '✗ Something went wrong. Please try again or email directly.';
                formStatus.style.color = '#ef4444';
            }
        } catch (error) {
            formStatus.textContent = '✗ Network error. Please try again or email me directly.';
            formStatus.style.color = '#ef4444';
        }
        
        // Re-enable button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Clear status after 8 seconds
        setTimeout(() => {
            formStatus.textContent = '';
        }, 8000);
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
