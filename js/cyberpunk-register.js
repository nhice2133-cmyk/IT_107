// Cyberpunk Registration System
class CyberpunkRegistration {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPasswordStrength();
        this.setupRealTimeValidation();
        this.setupCapitalizationValidation();
        this.addCyberpunkEffects();
        this.initializeShowPasswordIcons();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('.cyber-input');
        const fieldsWithSpecificValidation = ['firstName', 'lastName', 'middleName', 'extension', 'purok', 'barangay', 'city', 'province', 'email', 'username'];
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            // Only clear errors on input for fields without specific validation
            if (!fieldsWithSpecificValidation.includes(input.id)) {
                input.addEventListener('input', () => this.clearError(input));
            }
        });

        // Email alert validation on blur (normalize to lowercase)
        const email = document.getElementById('email');
        if (email) {
            email.addEventListener('blur', () => {
                email.value = email.value.trim().toLowerCase();
                const value = email.value;
                const errorElement = document.getElementById('emailError');
                if (value && (!this.isValidEmail(value) || this.isAllUppercaseEmail(value) || !this.isValidLocalPartCase(value) || !this.isValidDomainCase(value))) {
                    let msg = 'Invalid email format';
                    if (this.isValidEmail(value) && this.isAllUppercaseEmail(value)) {
                        msg = 'Email must not be all uppercase';
                    }
                    if (this.isValidEmail(value) && !this.isAllUppercaseEmail(value) && !this.isValidLocalPartCase(value)) {
                        msg = 'Before @: all lowercase or First letter uppercase only';
                    }
                    if (this.isValidEmail(value) && !this.isValidDomainCase(value)) {
                        msg = 'Domain part must be lowercase (e.g., gmail.com not GMAIL.COM)';
                    }
                    if (errorElement) {
                        errorElement.textContent = msg;
                        errorElement.classList.add('show');
                    }
                    email.style.borderColor = 'var(--cyber-error)';
                    email.style.boxShadow = '0 0 10px rgba(255, 0, 64, 0.3)';
                } else if (value) {
                    this.clearError(email);
                }
            });
        }

        // Username validation on blur
        const username = document.getElementById('username');
        if (username) {
            // live normalize on input
            username.addEventListener('input', () => {
                const caret = username.selectionStart;
                const before = username.value;
                const norm = normalizeUsername(before);
                if (before !== norm) {
                    username.value = norm;
                    // attempt to keep caret near end
                    try { username.setSelectionRange(caret, caret); } catch (e) {}
                }
                this.clearError(username);
            });
            username.addEventListener('blur', () => {
                username.value = normalizeUsername(username.value);
                const value = username.value;
                const errorElement = document.getElementById('usernameError');
                if (value) {
                    const errorMsg = this.getUsernameError(value);
                    if (errorMsg) {
                        if (errorElement) {
                            errorElement.textContent = errorMsg;
                            errorElement.classList.add('show');
                        }
                        username.style.borderColor = 'var(--cyber-error)';
                        username.style.boxShadow = '0 0 10px rgba(255, 0, 64, 0.3)';
                    } else {
                        this.clearError(username);
                    }
                }
            });
        }

        // Password confirmation
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (password && confirmPassword) {
            confirmPassword.addEventListener('input', () => {
                this.validatePasswordMatch();
            });
        }

        // Age auto-calculation
        const birthDate = document.getElementById('birthDate');
        const age = document.getElementById('age');
        
        if (birthDate && age) {
            birthDate.addEventListener('change', () => {
                this.calculateAge();
            });
            birthDate.addEventListener('input', () => {
                this.calculateAge();
            });
        }

        // Phone number validation (same as other fields)
        const phoneNumber = document.getElementById('phoneNumber');
        if (phoneNumber) {
            phoneNumber.addEventListener('blur', () => {
                this.validateField(phoneNumber);
            });
        }
    }

    initializeShowPasswordIcons() {
        // Initialize SVG icons for all show-password buttons
        const buttons = this.form.querySelectorAll('.show-password');
        buttons.forEach(btn => {
            btn.setAttribute('aria-label', 'Show password');
            btn.setAttribute('aria-pressed', 'false');
            btn.innerHTML = getEyeSVG(false);
        });
    }

    setupCapitalizationValidation() {
        const nameFieldIds = [
            'firstName', 'lastName', 'middleName', 'extension',
            'purok', 'barangay', 'city', 'province'
        ];
        nameFieldIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const isOptional = (id === 'middleName' || id === 'extension');
                const validateField = () => {
                    const result = this.validateCapitalization(el, isOptional);
                    const errorElement = document.getElementById(id + 'Error');
                    if (!result.ok) {
                        if (errorElement) {
                            errorElement.textContent = result.message || 'Invalid format';
                            errorElement.classList.add('show');
                        }
                        el.style.borderColor = 'var(--cyber-error)';
                        el.style.boxShadow = '0 0 10px rgba(255, 0, 64, 0.3)';
                    } else {
                        this.clearError(el);
                    }
                };
                el.addEventListener('blur', validateField);
                // Also validate on input for real-time feedback
                el.addEventListener('input', () => {
                    // Only validate if field has value (to avoid showing errors while typing)
                    if (el.value.trim().length >= 3) {
                        validateField();
                    } else {
                        this.clearError(el);
                    }
                });
            }
        });
    }

    validateCapitalization(field, isOptional = false) {
        const raw = field.value.trim();
        if (!raw && isOptional) return { ok: true };
        if (!raw && !isOptional) return { ok: false, message: 'This field is required' };

        // Check for 3 consecutive letters (for name fields)
        if (this.hasConsecutiveLetters(raw.toLowerCase())) {
            return { ok: false, message: 'Cannot contain 3 consecutive letters' };
        }

        // Capitalization is handled automatically, no need to validate
        return { ok: true };
    }

    setupPasswordStrength() {
        const password = document.getElementById('password');
        const strengthIndicator = document.getElementById('passwordStrength');
        
        if (password && strengthIndicator) {
            password.addEventListener('input', () => {
                const strength = this.calculatePasswordStrength(password.value);
                this.updatePasswordStrength(strength, strengthIndicator);
            });
        }
    }

    setupRealTimeValidation() {
        // ID Number formatting
        const idNumber = document.getElementById('idNumber');
        if (idNumber) {
            idNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 4) {
                    value = value.substring(0, 4) + '-' + value.substring(4, 8);
                }
                e.target.value = value;
            });
        }

        // Zip code formatting
        const zipCode = document.getElementById('zipCode');
        if (zipCode) {
            zipCode.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }

        // Phone number: digits only, max 11
        const phoneOnly = document.getElementById('phoneNumber');
        if (phoneOnly) {
            phoneOnly.addEventListener('input', (e) => {
                let v = (e.target.value || '').replace(/\D/g, '');
                if (v.length > 11) v = v.slice(0, 11);
                e.target.value = v;
            });
            // Prevent non-digit keypresses (still allow control keys)
            phoneOnly.addEventListener('keypress', (e) => {
                const isCtrl = e.ctrlKey || e.metaKey || e.altKey;
                if (isCtrl) return;
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });
            // Block wheel changes on number-like inputs in some browsers
            phoneOnly.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
        }

        // Extension: prevent dots
        const extension = document.getElementById('extension');
        if (extension) {
            extension.addEventListener('input', (e) => {
                // Remove any dots from the input
                e.target.value = e.target.value.replace(/\./g, '');
            });
            // Prevent dot keypresses
            extension.addEventListener('keypress', (e) => {
                if (e.key === '.' || e.key === 'Period') {
                    e.preventDefault();
                }
            });
        }
    }

    addCyberpunkEffects() {
        // Add glitch effect to inputs on focus
        const inputs = document.querySelectorAll('.cyber-input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.addGlitchEffect(input);
            });
        });

        // Add terminal typing effect
        this.simulateTerminalTyping();
    }

    simulateTerminalTyping() {
        const prompt = document.querySelector('.terminal-prompt .prompt-text');
        if (prompt) {
            const text = 'user@neuralnet:~$';
            prompt.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    prompt.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            setTimeout(typeWriter, 1000);
        }
    }

    addGlitchEffect(element) {
        element.style.textShadow = '2px 0 #ff0080, -2px 0 #00ffff';
        setTimeout(() => {
            element.style.textShadow = 'none';
        }, 200);
    }

    calculateAge() {
        const birthDate = document.getElementById('birthDate');
        const age = document.getElementById('age');
        
        if (birthDate && age) {
            if (birthDate.value) {
                const today = new Date();
                const birth = new Date(birthDate.value);
                let calculatedAge = today.getFullYear() - birth.getFullYear();
                const monthDiff = today.getMonth() - birth.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                    calculatedAge--;
                }
                
                age.value = calculatedAge;
                // Clear any errors when age is calculated
                this.clearError(age);
            } else {
                // Clear age if birthdate is cleared
                age.value = '';
            }
        }
    }


    calculatePasswordStrength(password) {
        let strength = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        strength = Object.values(checks).filter(Boolean).length;
        return { strength, checks };
    }

    updatePasswordStrength(strengthData, indicator) {
        const { strength } = strengthData;
        indicator.className = 'password-strength';
        
        if (strength <= 2) {
            indicator.classList.add('strength-weak');
            indicator.textContent = 'WEAK SECURITY';
        } else if (strength <= 3) {
            indicator.classList.add('strength-medium');
            indicator.textContent = 'MEDIUM SECURITY';
        } else {
            indicator.classList.add('strength-strong');
            indicator.textContent = 'STRONG SECURITY';
        }
    }

    validatePasswordMatch() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const errorElement = document.getElementById('confirmPasswordError');
        
        if (password && confirmPassword && errorElement) {
            if (confirmPassword.value && password.value !== confirmPassword.value) {
                this.showError(confirmPassword, errorElement, 'Passwords do not match');
            } else {
                this.clearError(confirmPassword);
            }
        }
    }

    validateField(field) {
        const fieldId = field.id;
        const value = field.value.trim();
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (!errorElement) return;

        let isValid = true;
        let errorMessage = '';

        switch (fieldId) {
            case 'idNumber':
                if (!value) {
                    errorMessage = 'ID Number is required';
                    isValid = false;
                } else if (!/^\d{4}-\d{4}$/.test(value)) {
                    errorMessage = 'Invalid ID format (XXXX-XXXX)';
                    isValid = false;
                }
                break;
                
            case 'firstName':
            case 'lastName':
                if (!value) {
                    errorMessage = 'This field is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Must be at least 2 characters';
                    isValid = false;
                } else if (this.hasConsecutiveLetters(value.toLowerCase())) {
                    errorMessage = 'Cannot contain 3 consecutive letters';
                    isValid = false;
                }
                break;
                
            case 'phoneNumber':
                if (!value) {
                    errorMessage = 'Phone number is required';
                    isValid = false;
                } else if (!/^\d{11}$/.test(value.replace(/\D/g, ''))) {
                    errorMessage = 'Phone number must be exactly 11 digits';
                    isValid = false;
                }
                break;
                
            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errorMessage = 'Invalid email format';
                    isValid = false;
                }
                break;
                
            case 'username':
                if (!value) {
                    errorMessage = 'Username is required';
                    isValid = false;
                } else {
                    const usernameError = this.getUsernameError(value);
                    if (usernameError) {
                        errorMessage = usernameError;
                        isValid = false;
                    }
                }
                break;
                
            case 'password':
                if (!value) {
                    errorMessage = 'Password is required';
                    isValid = false;
                } else if (value.length < 8) {
                    errorMessage = 'Password must be at least 8 characters';
                    isValid = false;
                } else if (!/[a-z]/.test(value)) {
                    errorMessage = 'Password must include a lowercase letter';
                    isValid = false;
                } else if (!/[A-Z]/.test(value)) {
                    errorMessage = 'Password must include an uppercase letter';
                    isValid = false;
                } else if (!/\d/.test(value)) {
                    errorMessage = 'Password must include a number';
                    isValid = false;
                }
                break;
                
            case 'age':
                if (!value) {
                    errorMessage = 'Age is required';
                    isValid = false;
                } else if (value < 1 || value > 120) {
                    errorMessage = 'Age must be between 1 and 120';
                    isValid = false;
                }
                break;
                
            case 'sex':
                if (!value) {
                    errorMessage = 'Please select your sex';
                    isValid = false;
                }
                break;
                
            case 'birthDate':
                if (!value) {
                    errorMessage = 'Birth date is required';
                    isValid = false;
                } else {
                    const birthDate = new Date(value);
                    const today = new Date();
                    if (birthDate > today) {
                        errorMessage = 'Birth date cannot be in the future';
                        isValid = false;
                    }
                }
                break;
                
            case 'purok':
            case 'barangay':
            case 'city':
            case 'province':
                if (!value) {
                    errorMessage = 'This field is required';
                    isValid = false;
                } else if (this.hasConsecutiveLetters(value.toLowerCase())) {
                    errorMessage = 'Cannot contain 3 consecutive letters';
                    isValid = false;
                }
                break;
                
            case 'country':
                if (!value) {
                    errorMessage = 'This field is required';
                    isValid = false;
                }
                break;
                
            case 'zipCode':
                if (!value) {
                    errorMessage = 'Zip code is required';
                    isValid = false;
                } else if (!/^\d{4}$/.test(value)) {
                    errorMessage = 'Invalid zip code format';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showError(field, errorElement, errorMessage);
        } else {
            this.clearError(field);
        }

        return isValid;
    }

    showError(field, errorElement, message) {
        field.style.borderColor = 'var(--cyber-error)';
        field.style.boxShadow = '0 0 10px rgba(255, 0, 64, 0.3)';
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    clearError(field) {
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            field.style.borderColor = '';
            field.style.boxShadow = '';
            field.classList.remove('error-field');
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('.cyber-input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        // Validate password match
        this.validatePasswordMatch();

        return isValid;
    }

    isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    isAllUppercaseEmail(value) {
        const letters = value.replace(/[^a-zA-Z]/g, '');
        if (!letters) return false;
        return letters === letters.toUpperCase() && letters !== letters.toLowerCase();
    }

    isValidLocalPartCase(value) {
        const atIndex = value.indexOf('@');
        if (atIndex <= 0) return true;
        const local = value.slice(0, atIndex);
        const letters = local.replace(/[^a-zA-Z]/g, '');
        if (!letters) return true;
        const first = letters.charAt(0);
        const rest = letters.slice(1);
        const allLower = letters === letters.toLowerCase();
        const firstUpperRestLower = /^[A-Z]$/.test(first) && rest === rest.toLowerCase();
        return allLower || firstUpperRestLower;
    }

    isValidDomainCase(value) {
        const atIndex = value.indexOf('@');
        if (atIndex <= 0) return true;
        const domain = value.slice(atIndex + 1);
        const letters = domain.replace(/[^a-zA-Z]/g, '');
        if (!letters) return true;
        // Domain should be all lowercase
        return letters === letters.toLowerCase();
    }

    hasConsecutiveChars(str) {
        // Check for 3 consecutive letters (abc, bcd, etc.)
        for (let i = 0; i < str.length - 2; i++) {
            const char1 = str.charCodeAt(i);
            const char2 = str.charCodeAt(i + 1);
            const char3 = str.charCodeAt(i + 2);
            
            // Check if all three are letters and consecutive
            if (char1 >= 97 && char1 <= 122 && // a-z
                char2 >= 97 && char2 <= 122 &&
                char3 >= 97 && char3 <= 122 &&
                char2 === char1 + 1 &&
                char3 === char2 + 1) {
                return true;
            }
            
            // Check if all three are numbers and consecutive
            if (char1 >= 48 && char1 <= 57 && // 0-9
                char2 >= 48 && char2 <= 57 &&
                char3 >= 48 && char3 <= 57 &&
                char2 === char1 + 1 &&
                char3 === char2 + 1) {
                return true;
            }
        }
        return false;
    }

    hasConsecutiveLetters(str) {
        // Check for 3 consecutive letters (abc, bcd, etc.) or 3 identical letters (aaa, ddd, etc.)
        for (let i = 0; i < str.length - 2; i++) {
            const char1 = str.charCodeAt(i);
            const char2 = str.charCodeAt(i + 1);
            const char3 = str.charCodeAt(i + 2);
            
            // Check if all three are letters
            if (char1 >= 97 && char1 <= 122 && // a-z
                char2 >= 97 && char2 <= 122 &&
                char3 >= 97 && char3 <= 122) {
                
                // Check for 3 identical consecutive letters (aaa, ddd, etc.)
                if (char1 === char2 && char2 === char3) {
                    return true;
                }
                
                // Check for 3 consecutive letters in sequence (abc, bcd, etc.)
                if (char2 === char1 + 1 && char3 === char2 + 1) {
                    return true;
                }
            }
        }
        return false;
    }

    getUsernameError(value) {
        // Normalize here too just in case
        const v = normalizeUsername(value);

        // Length constraints
        if (v.length < 3) {
            return 'Username must be at least 3 characters';
        }
        if (v.length > 50) {
            return 'Username must be at most 50 characters';
        }

        // Allowed chars only
        if (!/^[a-z0-9_]+$/.test(v)) {
            return 'Username can only contain lowercase letters, numbers, and underscores';
        }

        // Must contain at least one letter
        if (!/[a-z]/.test(v)) {
            return 'Username must contain at least one letter';
        }

        // Cannot start or end with underscore
        if (v.startsWith('_')) {
            return 'Username cannot start with an underscore';
        }
        if (v.endsWith('_')) {
            return 'Username cannot end with an underscore';
        }

        // No double underscores
        if (/__/.test(v)) {
            return 'Username cannot contain consecutive underscores';
        }

        // Not all numbers
        if (/^[0-9]+$/.test(v)) {
            return 'Username cannot be all numbers';
        }

        // Not email-like
        if (/@/.test(v)) {
            return 'Username cannot contain @ symbol';
        }

        // No 3+ repeated identical characters
        if (/(.)\1{2,}/.test(v)) {
            return 'Username cannot contain 3 or more identical consecutive characters';
        }

        // No 3 consecutive letters or numbers
        if (this.hasConsecutiveChars(v)) {
            return 'Username cannot contain 3 consecutive letters or numbers';
        }

        // Not a reserved username
        if (this.isReservedUsername && this.isReservedUsername(v)) {
            return 'This username is reserved and cannot be used';
        }

        return null; // No error
    }

    isValidUsername(value) {
        // Normalize here too just in case
        const v = normalizeUsername(value);

        // Length constraints
        if (v.length < 3 || v.length > 50) return false;

        // Allowed chars only
        if (!/^[a-z0-9_]+$/.test(v)) return false;

        // Must contain at least one letter
        if (!/[a-z]/.test(v)) return false;

        // Cannot start or end with underscore
        if (v.startsWith('_') || v.endsWith('_')) return false;

        // No double underscores
        if (/__/.test(v)) return false;

        // Not all numbers
        if (/^[0-9]+$/.test(v)) return false;

        // Not email-like
        if (/@/.test(v)) return false;

        // No 3+ repeated identical characters
        if (/(.)\1{2,}/.test(v)) return false;

        // No 3 consecutive letters or numbers
        if (this.hasConsecutiveChars(v)) return false;

        // Not a reserved username
        if (this.isReservedUsername && this.isReservedUsername(v)) return false;

        return true;
    }

    isReservedUsername(name) {
        const reserved = new Set([
            'admin','administrator','root','system','support','help','contact','service','services','security','owner','staff','moderator','mod','test','testing','null','undefined','superuser'
        ]);
        return reserved.has(name);
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all required fields before submission
        if (!this.validateForm()) {
            return;
        }
        
        this.submitForm();
    }

    submitForm() {
        const submitBtn = this.form.querySelector('.cyber-btn');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        
        // Show loading state
        submitBtn.querySelector('.btn-text').textContent = 'INITIALIZING...';
        submitBtn.disabled = true;
        
        // Simulate cyberpunk loading effect
        this.simulateLoading();
        
        // Collect form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Send to server: stash registration first (defer DB insert)
        fetch('../php/register_stash.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(async response => {
            const text = await response.text();
            try {
                const json = JSON.parse(text);
                return { ok: response.ok, json, raw: text };
            } catch (e) {
                return { ok: response.ok, json: null, raw: text };
            }
        })
        .then(result => {
            if (!result.ok || !result.json) {
                console.error('Registration response not OK or invalid JSON:', result.raw);
                this.showSystemError('System error. Please try again.');
                return;
            }
            const data = result.json;
            if (data.success) {
                this.showSuccess('Neural profile initialized successfully!');
                // Show generated ID if provided
                if (data.idNumber) {
                    const idInput = document.getElementById('idNumber');
                    if (idInput) idInput.value = data.idNumber;
                }
                sessionStorage.setItem('justRegistered', '1');
                setTimeout(() => {
                    window.location.href = 'security-questions.php';
                }, 1500);
            } else {
                if (data.fieldErrors) {
                    this.showFieldErrors(data.fieldErrors);
                }
                this.showSystemError(data.message || 'Registration failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            this.showSystemError('System error. Please try again.');
        })
        .finally(() => {
            // Reset button
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    simulateLoading() {
        const terminal = document.querySelector('.terminal-prompt .cursor-blink');
        if (terminal) {
            let dots = 0;
            const interval = setInterval(() => {
                dots = (dots + 1) % 4;
                terminal.textContent = '.'.repeat(dots) + '_';
            }, 500);
            
            setTimeout(() => {
                clearInterval(interval);
                terminal.textContent = '_';
            }, 3000);
        }
    }

    showSuccess(message) {
        this.showSystemMessage(message, 'success');
    }

    showSystemError(message) {
        this.showSystemMessage(message, 'error');
    }

    showFieldErrors(fieldErrors) {
        // Clear all existing errors first
        this.clearAllErrors();
        
        // Show field-specific errors
        Object.keys(fieldErrors).forEach(fieldName => {
            const errorMessage = fieldErrors[fieldName];
            this.showFieldError(fieldName, errorMessage);
        });
        
        // Show general error message
        this.showSystemError('Please correct the highlighted fields');
    }

    showFieldError(fieldName, errorMessage) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        
        if (field) {
            // Highlight the field with error styling
            field.style.borderColor = 'var(--cyber-error)';
            field.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.3)';
            field.classList.add('error-field');
        }
        
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
    }

    clearAllErrors() {
        // Clear all field errors
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.classList.remove('show');
        });
        
        // Clear all field highlighting
        const fields = document.querySelectorAll('.cyber-input');
        fields.forEach(field => {
            field.style.borderColor = '';
            field.style.boxShadow = '';
            field.classList.remove('error-field');
        });
    }

    showSystemMessage(message, type) {
        // Create system message overlay
        const overlay = document.createElement('div');
        overlay.className = `system-message ${type}`;
        overlay.innerHTML = `
            <div class="message-content">
                <div class="message-icon">${type === 'success' ? '✓' : '⚠'}</div>
                <div class="message-text">${message}</div>
            </div>
        `;
        
        // Add styles
        overlay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid ${type === 'success' ? 'var(--cyber-success)' : 'var(--cyber-error)'};
            border-radius: 8px;
            padding: 1rem;
            z-index: 10000;
            color: var(--cyber-text);
            font-family: 'Orbitron', monospace;
            text-align: center;
            box-shadow: 0 0 30px ${type === 'success' ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 64, 0.3)'};
        `;
        
        document.body.appendChild(overlay);
        
        // Remove after 3 seconds
        setTimeout(() => {
            overlay.remove();
        }, 3000);
    }
}

// Password toggle functionality with cyber SVG
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    
    if (field.type === 'password') {
        field.type = 'text';
        button.innerHTML = getEyeSVG(true);
        button.setAttribute('aria-label', 'Hide password');
        button.setAttribute('aria-pressed', 'true');
    } else {
        field.type = 'password';
        button.innerHTML = getEyeSVG(false);
        button.setAttribute('aria-label', 'Show password');
        button.setAttribute('aria-pressed', 'false');
    }
}

// Cyber eye SVG icon
function getEyeSVG(isVisible) {
    const stroke = isVisible ? '#ff00ff' : '#00eaff';
    const glow = isVisible ? 'rgba(255,0,255,0.6)' : 'rgba(0,234,255,0.6)';
    const slash = isVisible ? '<path d="M3 3L21 21"></path>' : '';
    return `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 6px ${glow});">
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"></path>
        <circle cx="12" cy="12" r="3"></circle>
        ${slash}
      </svg>
    `;
}

function autoFixNameSpaces(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/\s+/g, ' ').trim();
}
function toTitleCase(str) {
    if (typeof str !== 'string') return '';
    const lower = str.toLowerCase();
    return lower.replace(/(?:^|[\s\-'])\w/g, function(match) {
        return match.toUpperCase();
    });
}
// Auto-fix name and address fields on blur
['firstName','lastName','middleName','purok','barangay','city','province'].forEach(function(id) {
    var elem = document.getElementById(id);
    if (elem) {
        elem.addEventListener('blur', function() {
            elem.value = toTitleCase(autoFixNameSpaces(elem.value));
        });
    }
});

// Normalize username: trim, collapse spaces, replace spaces with underscore, lowercase, remove invalids, collapse underscores
function normalizeUsername(str) {
    if (!str) return '';
    let v = str.replace(/\s+/g, ' ').trim();          // collapse spaces and trim
    v = v.replace(/\s+/g, '_');                       // spaces -> underscore
    v = v.toLowerCase();                               // force lowercase
    v = v.replace(/[^a-z0-9_]/g, '');                  // keep only a-z0-9_
    v = v.replace(/_+/g, '_');                         // collapse multiple underscores
    return v;
}
// Initialize the cyberpunk registration system
document.addEventListener('DOMContentLoaded', () => {
    new CyberpunkRegistration();
    
    // Add cyberpunk sound effects (optional)
    const inputs = document.querySelectorAll('.cyber-input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            // Add subtle visual feedback
            input.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });

    const idInput = document.getElementById('idNumber');
    if (idInput) {
        idInput.addEventListener('click', function () {
            fetch('../php/get_next_id.php')
                .then(response => response.json())
                .then(result => {
                    if (result.success && result.idNumber) {
                        idInput.value = result.idNumber;
                        // Clear any previous errors
                        const errorElement = document.getElementById('idError');
                        if (errorElement) {
                            errorElement.textContent = '';
                            errorElement.classList.remove('show');
                        }
                    } else {
                        const errorElement = document.getElementById('idError');
                        if (errorElement) {
                            errorElement.textContent = 'Unable to retrieve ID number. Please try again.';
                            errorElement.classList.add('show');
                        }
                        idInput.style.borderColor = 'var(--cyber-error)';
                        idInput.style.boxShadow = '0 0 10px rgba(255, 0, 64, 0.3)';
                    }
                })
                .catch(() => {
                    const errorElement = document.getElementById('idError');
                    if (errorElement) {
                        errorElement.textContent = 'Unable to retrieve ID number. Please try again.';
                        errorElement.classList.add('show');
                    }
                    idInput.style.borderColor = 'var(--cyber-error)';
                    idInput.style.boxShadow = '0 0 10px rgba(255, 0, 64, 0.3)';
                });
        });
    }
});
