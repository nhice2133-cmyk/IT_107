// Forgot Password Questions JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('forgotPasswordQuestionsForm');
    const email = sessionStorage.getItem('fp_email');
    
    if (!email) {
        alert('No email found. Please start the forgot password process again.');
        window.location.href = 'forgot-password.php';
        return;
    }

    // Load user's security questions
    loadSecurityQuestions(email);

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitPasswordReset();
        }
    });

    // Real-time validation for answers
    document.getElementById('answer1').addEventListener('blur', function() {
        if (this.value.trim()) clearError('answer1');
    });
    document.getElementById('answer2').addEventListener('blur', function() {
        if (this.value.trim()) clearError('answer2');
    });
    document.getElementById('answer3').addEventListener('blur', function() {
        if (this.value.trim()) clearError('answer3');
    });

    function loadSecurityQuestions(email) {
        fetch('../php/get_security_questions.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('question1').value = data.data.question1;
                document.getElementById('question2').value = data.data.question2;
                document.getElementById('question3').value = data.data.question3;
            } else {
                alert('Error loading security questions: ' + data.message);
                window.location.href = 'forgot-password.php';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Network error. Please try again.');
        });
    }

    function validateForm() {
        let isValid = true;
        
        // Validate answers
        const answer1 = document.getElementById('answer1').value.trim();
        const answer2 = document.getElementById('answer2').value.trim();
        const answer3 = document.getElementById('answer3').value.trim();
        
        if (!answer1) {
            showError('answer1', 'Answer is required');
            isValid = false;
        } else {
            clearError('answer1');
        }
        
        if (!answer2) {
            showError('answer2', 'Answer is required');
            isValid = false;
        } else {
            clearError('answer2');
        }
        
        if (!answer3) {
            showError('answer3', 'Answer is required');
            isValid = false;
        } else {
            clearError('answer3');
        }
        
        return isValid;
    }

    function submitPasswordReset() {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.querySelector('.btn-text').textContent;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.querySelector('.btn-text').textContent = 'VERIFYING...';
        
        const answers = {
            answer1: document.getElementById('answer1').value.trim(),
            answer2: document.getElementById('answer2').value.trim(),
            answer3: document.getElementById('answer3').value.trim()
        };
        
        // Store answers in session storage for the next step
        sessionStorage.setItem('fp_answers', JSON.stringify(answers));
        
        // Verify answers first
        fetch('../php/verify_security_answers.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                ...answers
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirect to password reset page
                window.location.href = 'reset-password.php';
            } else {
                alert(data.message || 'Security answers do not match. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Network error. Please try again.');
        })
        .finally(() => {
            // Reset button state
            submitButton.disabled = false;
            submitButton.querySelector('.btn-text').textContent = originalText;
        });
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + '-error');
        
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + '-error');
        
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
});
