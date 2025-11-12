// Forgot Password JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const emailInput = document.getElementById('email');
    const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');

    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);
    // no password fields on step 1

    // Form submission
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateEmail()) {
            // Step 1: lookup email, if exists go to questions page with email in query
            fetch('../php/forgot_email_lookup.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput.value.trim() })
            })
            .then(r => r.json())
            .then(res => {
                if (!res.success) {
                    alert(res.message || 'Email not found.');
                    return;
                }
                sessionStorage.setItem('fp_email', emailInput.value.trim());
                window.location.href = `forgot-password-questions.php`;
            })
            .catch(() => alert('Network error'));
        }
    });

    function validateEmail() {
        const email = emailInput.value.trim();
        const errorElement = getOrCreateErrorElement(emailInput);
        
        if (email === '') {
            showError(emailInput, errorElement, 'Email is required');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError(emailInput, errorElement, 'Please enter a valid email address');
            return false;
        }
        
        clearError(emailInput, errorElement);
        return true;
    }

    function submitForm() {
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        submitButton.textContent = 'Verifying...';

        const payload = { email: emailInput.value.trim() };
        
        // Submit to PHP
        fetch('../php/forgot_email_lookup.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccessMessage('Email verified. Proceeding...');
                sessionStorage.setItem('fp_email', emailInput.value.trim());
                setTimeout(() => { window.location.href = 'forgot-password-questions.php'; }, 800);
            } else {
                showErrorMessage(data.message || 'Email not found.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('An error occurred. Please try again.');
        })
        .finally(() => {
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.textContent = 'Verify Email';
        });
    }

    function getOrCreateErrorElement(input) {
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            input.parentNode.appendChild(errorElement);
        }
        return errorElement;
    }

    function showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearError(input, errorElement) {
        input.classList.remove('error');
        errorElement.style.display = 'none';
    }

    function showSuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    function showErrorMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'error-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Auto-focus on email field
    emailInput.focus();
});


