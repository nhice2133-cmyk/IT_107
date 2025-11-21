// Forgot Password JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
<<<<<<< HEAD
    const idNumberInput = document.getElementById('idNumber');
    const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');

    // Real-time validation
    idNumberInput.addEventListener('blur', validateIdNumber);
=======
    const emailInput = document.getElementById('email');
    const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');

    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e
    // no password fields on step 1

    // Form submission
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
<<<<<<< HEAD
        if (validateIdNumber()) {
            // Step 1: lookup ID number, if exists go to questions page
            fetch('../php/forgot_id_lookup.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idNumber: idNumberInput.value.trim() })
=======
        if (validateEmail()) {
            // Step 1: lookup email, if exists go to questions page with email in query
            fetch('../php/forgot_email_lookup.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput.value.trim() })
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e
            })
            .then(r => r.json())
            .then(res => {
                if (!res.success) {
<<<<<<< HEAD
                    alert(res.message || 'ID number not found.');
                    return;
                }
                sessionStorage.setItem('fp_idNumber', idNumberInput.value.trim());
=======
                    alert(res.message || 'Email not found.');
                    return;
                }
                sessionStorage.setItem('fp_email', emailInput.value.trim());
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e
                window.location.href = `forgot-password-questions.php`;
            })
            .catch(() => alert('Network error'));
        }
    });

<<<<<<< HEAD
    function validateIdNumber() {
        const idNumber = idNumberInput.value.trim();
        const errorElement = getOrCreateErrorElement(idNumberInput);
        
        if (idNumber === '') {
            showError(idNumberInput, errorElement, 'ID number is required');
            return false;
        }
        
        const idRegex = /^\d{4}-\d{4}$/;
        if (!idRegex.test(idNumber)) {
            showError(idNumberInput, errorElement, 'Please enter a valid ID number (YYYY-XXXX)');
            return false;
        }
        
        clearError(idNumberInput, errorElement);
=======
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
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e
        return true;
    }

    function submitForm() {
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        submitButton.textContent = 'Verifying...';

<<<<<<< HEAD
        const payload = { idNumber: idNumberInput.value.trim() };
        
        // Submit to PHP
        fetch('../php/forgot_id_lookup.php', {
=======
        const payload = { email: emailInput.value.trim() };
        
        // Submit to PHP
        fetch('../php/forgot_email_lookup.php', {
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
<<<<<<< HEAD
                showSuccessMessage('ID number verified. Proceeding...');
                sessionStorage.setItem('fp_idNumber', idNumberInput.value.trim());
                setTimeout(() => { window.location.href = 'forgot-password-questions.php'; }, 800);
            } else {
                showErrorMessage(data.message || 'ID number not found.');
=======
                showSuccessMessage('Email verified. Proceeding...');
                sessionStorage.setItem('fp_email', emailInput.value.trim());
                setTimeout(() => { window.location.href = 'forgot-password-questions.php'; }, 800);
            } else {
                showErrorMessage(data.message || 'Email not found.');
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e
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
<<<<<<< HEAD
            submitButton.textContent = 'Verify ID Number';
=======
            submitButton.textContent = 'Verify Email';
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e
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

<<<<<<< HEAD
    // Auto-focus on ID number field
    idNumberInput.focus();
=======
    // Auto-focus on email field
    emailInput.focus();
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e
});


