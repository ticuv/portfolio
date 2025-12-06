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
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isValid = true;

        // Clear previous errors
        document.querySelectorAll('.form__input, .form__textarea').forEach(el => {
            el.classList.remove('error');
        });
        document.querySelectorAll('.form__error').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });

        // Validate name
        if (nameInput.value.trim().length < 2) {
            nameInput.classList.add('error');
            const errorEl = document.getElementById('nameError');
            errorEl.textContent = 'Please enter your name (at least 2 characters)';
            errorEl.style.display = 'block';
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailInput.classList.add('error');
            const errorEl = document.getElementById('emailError');
            errorEl.textContent = 'Please enter a valid email address';
            errorEl.style.display = 'block';
            isValid = false;
        }

        // Validate message
        if (messageInput.value.trim().length < 10) {
            messageInput.classList.add('error');
            const errorEl = document.getElementById('messageError');
            errorEl.textContent = 'Please enter a message (at least 10 characters)';
            errorEl.style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            // Disable button during submission
            const submitBtn = document.getElementById('submitBtn');
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
                    formStatus.style.display = 'block';
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
                    formStatus.style.display = 'block';
                }
            } catch (error) {
                formStatus.textContent = '✗ Network error. Please try again or email me directly.';
                formStatus.style.color = '#ef4444';
                formStatus.style.display = 'block';
            }

            // Re-enable button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Clear status after 8 seconds
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.style.display = 'none';
            }, 8000);
        }
    });
}

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
