// Reset Password JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resetPasswordForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const resetButton = document.getElementById('resetBtn');
    
    // Check if we have the required data from previous steps
    const email = sessionStorage.getItem('fp_email');
    const answers = sessionStorage.getItem('fp_answers');
    
    if (!email || !answers) {
        alert('Session expired. Please start the forgot password process again.');
        window.location.href = 'forgot-password.php';
        return;
    }

    // Real-time password validation
    newPasswordInput.addEventListener('input', function() {
        validatePassword();
        updatePasswordRequirements();
    });

    confirmPasswordInput.addEventListener('input', function() {
        validateConfirmPassword();
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitPasswordReset();
        }
    });

    function validateForm() {
        let isValid = true;
        
        if (!validatePassword()) {
            isValid = false;
        }
        
        if (!validateConfirmPassword()) {
            isValid = false;
        }
        
        return isValid;
    }

    function validatePassword() {
        const password = newPasswordInput.value;
        const errorElement = document.getElementById('newPasswordError');
        
        if (password.length < 8) {
            showError('newPassword', 'Password must be at least 8 characters long');
            return false;
        }
        
        if (!/(?=.*[a-z])/.test(password)) {
            showError('newPassword', 'Password must contain at least one lowercase letter');
            return false;
        }
        
        if (!/(?=.*[A-Z])/.test(password)) {
            showError('newPassword', 'Password must contain at least one uppercase letter');
            return false;
        }
        
        if (!/(?=.*\d)/.test(password)) {
            showError('newPassword', 'Password must contain at least one number');
            return false;
        }
        
        if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
            showError('newPassword', 'Password must contain at least one special character');
            return false;
        }
        
        clearError('newPassword');
        return true;
    }

    function validateConfirmPassword() {
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword !== password) {
            showError('confirmPassword', 'Passwords do not match');
            return false;
        }
        
        clearError('confirmPassword');
        return true;
    }

    function updatePasswordRequirements() {
        const password = newPasswordInput.value;
        
        // Update requirement indicators
        updateRequirement('req-length', password.length >= 8);
        updateRequirement('req-uppercase', /(?=.*[A-Z])/.test(password));
        updateRequirement('req-lowercase', /(?=.*[a-z])/.test(password));
        updateRequirement('req-number', /(?=.*\d)/.test(password));
        updateRequirement('req-special', /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password));
    }

    function updateRequirement(elementId, isValid) {
        const element = document.getElementById(elementId);
        const icon = element.querySelector('.req-icon');
        
        if (isValid) {
            icon.textContent = '✅';
            element.style.color = '#23d18b';
        } else {
            icon.textContent = '❌';
            element.style.color = '#ff0040';
        }
    }

    function submitPasswordReset() {
        const originalText = resetButton.querySelector('.btn-text').textContent;
        
        // Show loading state
        resetButton.disabled = true;
        resetButton.querySelector('.btn-text').textContent = 'RESETTING...';
        
        const answers = JSON.parse(sessionStorage.getItem('fp_answers'));
        
        const payload = {
            email: email,
            answer1: answers.answer1,
            answer2: answers.answer2,
            answer3: answers.answer3,
            newPassword: newPasswordInput.value
        };
        
        fetch('../php/verify_security_answers.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Password reset successful! You can now login with your new password.');
                // Clear session data
                sessionStorage.removeItem('fp_email');
                sessionStorage.removeItem('fp_answers');
                window.location.href = 'login.php';
            } else {
                alert(data.message || 'Password reset failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Network error. Please try again.');
        })
        .finally(() => {
            // Reset button state
            resetButton.disabled = false;
            resetButton.querySelector('.btn-text').textContent = originalText;
        });
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        field.classList.remove('error');
        errorElement.style.display = 'none';
    }

    // Password visibility toggle
    window.togglePassword = function(fieldId) {
        const field = document.getElementById(fieldId);
        const button = field.parentNode.querySelector('.show-password');
        
        if (field.type === 'password') {
            field.type = 'text';
            button.textContent = '🙈';
        } else {
            field.type = 'password';
            button.textContent = '👁️';
        }
    };

    // Auto-focus on password field
    newPasswordInput.focus();
});

