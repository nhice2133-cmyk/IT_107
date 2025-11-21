# Database Setup

This folder contains SQL files for setting up the authentication system database.

## Files

- **auth_system.sql** - Complete database schema with all tables and default admin user

## Installation

### Option 1: Using phpMyAdmin
1. Open phpMyAdmin in your browser
2. Click on "Import" tab
3. Select `auth_system.sql` file
4. Click "Go" to execute

### Option 2: Using MySQL Command Line
```bash
mysql -u root -p < auth_system.sql
```

### Option 3: Using XAMPP MySQL
1. Open XAMPP Control Panel
2. Start MySQL service
3. Open MySQL command line or phpMyAdmin
4. Execute the SQL file

## Database Configuration

After importing the schema, update the database credentials in `php/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'auth_system');
```

## Default Admin Credentials

- **Username:** admin
- **Password:** admin@12345
- **Security Question:** Master key?
- **Security Answer:** admin

⚠️ **Important:** Change the default admin password after first login in production!

## Database Structure

### Tables

1. **users** - User account information
2. **password_reset_tokens** - Password reset token management
3. **user_security_questions** - Security questions and answers for account recovery

## Notes

- The schema uses UTF8MB4 encoding for full Unicode support
- All foreign keys use CASCADE delete for data integrity
- Indexes are created on frequently queried columns for performance
- The `users` table includes all registration fields (name, address, etc.)

