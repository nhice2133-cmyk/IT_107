# Authentication Web Application

A complete web application with user authentication features built with HTML, CSS, JavaScript, and PHP.

## Project Structure

```
v4/
├── pages/                          # PHP pages
│   ├── index.php                  # Home page
│   ├── login.php                  # Login page
│   ├── register.php               # Registration page
│   ├── dashboard.php              # User dashboard
│   ├── forgot-password.php        # Password recovery
│   ├── forgot-password-questions.php # Security questions
│   ├── reset-password.php         # Password reset
│   ├── change-password.php        # Password change
│   └── security-questions.php     # Security questions setup
├── css/                           # Cyberpunk-themed stylesheets
│   ├── cyberpunk-login.css       # Login page styles
│   ├── cyberpunk-register.css    # Registration page styles
│   ├── cyberpunk-questions.css   # Security questions styles
│   └── cyberpunk-change-password.css # Password change styles
├── js/                         
   # JavaScript files
│   ├── login-validation.js        # Login form validation
│   ├── cyberpunk-register.js     # Registration validation
│   ├── forgot-password.js        # Password recovery
│   ├── forgot-password-questions.js # Security questions
│   ├── reset-password.js         # Password reset
│   ├── cyberpunk-change-password.js # Password change
│   └── cyberpunk-questions.js    # Security questions setup
├── php/                           # PHP backend files
│   ├── config.php                # Database configuration
│   ├── login.php                 # Login processing
│   ├── register.php              # Registration processing
│   ├── forgot-password.php       # Password recovery
│   ├── change-password.php       # Password change
│   ├── check_username.php        # Username availability
│   ├── check_email.php           # Email availability
│   ├── check_id.php              # User ID validation
│   ├── get_user_questions.php    # Security questions
│   ├── logout.php                # Logout functionality
│   └── [other PHP files]         # Additional backend functionality
└── images/                        # Image assets folder
```

## Features

- **User Registration**: Secure account creation with validation
- **User Login**: Authentication with session management
- **Password Recovery**: Email-based password reset
- **Password Change**: Secure password updates
- **Dashboard**: User account management interface
- **Security**: Password hashing, SQL injection prevention, CSRF protection
- **Responsive Design**: Mobile-friendly interface
- **Real-time Validation**: Client-side form validation

## Setup Instructions

1. **Database Setup**:
   - Create a MySQL database named `auth_system`
   - Update database credentials in `php/config.php`
   - The application will automatically create required tables

2. **Web Server**:
   - Place files in your XAMPP `htdocs` directory
   - Ensure PHP and MySQL are running
   - Access via `http://localhost/v5/pages/index.php`

3. **Configuration**:
   - Update `APP_URL` in `php/config.php` to match your setup
   - Configure email settings for password reset functionality

## Security Features

- Password hashing using PHP's `password_hash()`
- SQL injection prevention with prepared statements
- Session security with HTTP-only cookies
- Login attempt limiting and account lockout
- Input sanitization and validation
- CSRF protection ready

## Database Tables

The application automatically creates these tables:
- `users`: User account information
- `login_attempts`: Failed login tracking
- `password_reset_tokens`: Password reset tokens

## Usage

1. Start with the home page (`index.php`)
2. Register a new account or login with existing credentials
3. Access the dashboard after successful login
4. Use the password recovery feature if needed
5. Change password from the dashboard

## Development Notes

- All forms use AJAX for better user experience
- Real-time validation provides immediate feedback
- Responsive design works on all device sizes
- Error handling includes user-friendly messages
- Code follows security best practices

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Modern web browser with JavaScript enabled
- XAMPP or similar local development environment


