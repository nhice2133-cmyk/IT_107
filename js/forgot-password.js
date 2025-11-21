// Forgot Password JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const idNumberInput = document.getElementById('idNumber');
    const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');

    // Real-time validation
    idNumberInput.addEventListener('blur', validateIdNumber);
    // no password fields on step 1

    // Form submission
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateIdNumber()) {
            // Step 1: lookup ID number, if exists go to questions page
            fetch('../php/forgot_id_lookup.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idNumber: idNumberInput.value.trim() })
            })
            .then(r => r.json())
            .then(res => {
                if (!res.success) {
                    alert(res.message || 'ID number not found.');
                    return;
                }
                sessionStorage.setItem('fp_idNumber', idNumberInput.value.trim());
                window.location.href = `forgot-password-questions.php`;
            })
            .catch(() => alert('Network error'));
        }
    });

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
        return true;
    }

    function submitForm() {
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        submitButton.textContent = 'Verifying...';

        const payload = { idNumber: idNumberInput.value.trim() };
        
        // Submit to PHP
        fetch('../php/forgot_id_lookup.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccessMessage('ID number verified. Proceeding...');
                sessionStorage.setItem('fp_idNumber', idNumberInput.value.trim());
                setTimeout(() => { window.location.href = 'forgot-password-questions.php'; }, 800);
            } else {
                showErrorMessage(data.message || 'ID number not found.');
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
            submitButton.textContent = 'Verify ID Number';
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

    // Auto-focus on ID number field
    idNumberInput.focus();
});


