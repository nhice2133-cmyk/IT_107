<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'auth_system');

// Application Configuration
define('APP_NAME', 'Authentication System');
define('APP_VERSION', '1.0.0');
define('APP_URL', 'http://localhost/v2');

// Security Configuration
define('PASSWORD_MIN_LENGTH', 8);
define('SESSION_TIMEOUT', 3600); // 1 hour
// Login lockout constants removed - only client-side validation remains

// Email Configuration (for password reset)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');
define('FROM_EMAIL', 'noreply@yourapp.com');
define('FROM_NAME', 'Authentication System');

// File Upload Configuration
define('UPLOAD_MAX_SIZE', 5242880); // 5MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif']);

// Error Reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Session Configuration
ini_set('session.use_only_cookies', 1);
$secure = 0; // Set to 1 when serving over HTTPS
ini_set('session.cookie_lifetime', 0);
ini_set('session.cookie_path', '/');
ini_set('session.cookie_domain', '');
ini_set('session.cookie_secure', $secure);
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Lax');

// Start session only if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Session idle-timeout and hardening
if (session_status() === PHP_SESSION_ACTIVE && isset($_SESSION['user_id'])) {
    // Idle timeout
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > SESSION_TIMEOUT)) {
        // Expire session cleanly
        endSession();
    } else {
        $_SESSION['last_activity'] = time();
        // Regenerate session ID periodically for security (every 15 minutes)
        if (!isset($_SESSION['last_regeneration']) || (time() - $_SESSION['last_regeneration'] > 900)) {
            session_regenerate_id(true);
            $_SESSION['last_regeneration'] = time();
        }
    }
}

function isAuthenticated() {
    return session_status() === PHP_SESSION_ACTIVE && isset($_SESSION['user_id']) && is_numeric($_SESSION['user_id']);
}

function validateSession() {
    if (session_status() !== PHP_SESSION_ACTIVE || !isAuthenticated()) {
        return false;
    }
    
    // Check if session has expired
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > SESSION_TIMEOUT)) {
        endSession();
        return false;
    }
    
    return true;
}

function requireAuthJson() {
    if (!validateSession()) {
        http_response_code(401);
        sendJsonResponse(false, 'Session expired or invalid');
    }
}

function requireAuth404() {
    if (!validateSession()) {
        http_response_code(404);
        // Prevent caching of 404 page
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        
        // Show 404 error page
        if (file_exists(__DIR__ . '/../pages/404.php')) {
            require_once __DIR__ . '/../pages/404.php';
        } else {
            // Fallback 404 response
            header('Content-Type: text/html; charset=UTF-8');
            echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
        }
        .container {
            max-width: 600px;
            padding: 2rem;
        }
        h1 {
            font-size: 8rem;
            color: #ff0080;
            text-shadow: 0 0 20px rgba(255, 0, 128, 0.5);
            margin-bottom: 1rem;
        }
        h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #00eaff;
        }
        p {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            opacity: 0.8;
        }
        a {
            display: inline-block;
            padding: 12px 30px;
            background: #ff0080;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            transition: all 0.3s;
            box-shadow: 0 0 15px rgba(255, 0, 128, 0.3);
        }
        a:hover {
            background: #ff0066;
            box-shadow: 0 0 25px rgba(255, 0, 128, 0.5);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or you do not have permission to access it.</p>
        <a href="../pages/login.php">Go to Login</a>
    </div>
</body>
</html>';
        }
        exit();
    }
}

function endSession() {
    if (session_status() === PHP_SESSION_ACTIVE) {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }
        session_destroy();
    }
}

// Database Connection Class
class Database {
    private $connection;
    
    public function __construct() {
        try {
            $this->connection = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function prepare($sql) {
        return $this->connection->prepare($sql);
    }
    
    public function query($sql) {
        return $this->connection->query($sql);
    }
    
    public function lastInsertId() {
        return $this->connection->lastInsertId();
    }
}

// Utility Functions
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

if (!function_exists('toTitleCase')) {
    function toTitleCase($string) {
        $lower = mb_strtolower($string, 'UTF-8');
        return preg_replace_callback('/(?:^|\s|[-\'])\p{L}/u', function ($m) {
            return mb_strtoupper($m[0], 'UTF-8');
        }, $lower);
    }
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function generateToken($length = 32) {
    return bin2hex(random_bytes($length));
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

function sendJsonResponse($success, $message, $data = null) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Login attempt tracking functions removed - only client-side validation remains

// Create database tables if they don't exist
function createTables() {
    $db = new Database();
    
    // Users table
    $db->query("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            id_number VARCHAR(9) UNIQUE NULL,
            password VARCHAR(255) NOT NULL,
            security_question VARCHAR(255) NOT NULL,
            security_answer VARCHAR(255) NOT NULL,
            phone_number VARCHAR(20) NULL,
            first_name VARCHAR(100) NULL,
            last_name VARCHAR(100) NULL,
            middle_name VARCHAR(100) NULL,
            extension VARCHAR(10) NULL,
            birth_date DATE NULL,
            age INT NULL,
            sex ENUM('male', 'female', 'other') NULL,
            purok_street VARCHAR(255) NULL,
            barangay VARCHAR(100) NULL,
            city VARCHAR(100) NULL,
            province VARCHAR(100) NULL,
            country VARCHAR(100) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        )
    ");
    
    // Login attempts table removed - only client-side validation remains
    
    // Password reset tokens table
    $db->query("
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token VARCHAR(255) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            used BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");

    // Attempt to add new columns for existing installations
    try { $db->query("ALTER TABLE users ADD COLUMN id_number VARCHAR(9) UNIQUE NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN address TEXT NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255) NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user'"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL"); } catch (Exception $e) { /* ignore if exists */ }
    
    // Add new registration fields
    try { $db->query("ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN first_name VARCHAR(100) NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN last_name VARCHAR(100) NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN middle_name VARCHAR(100) NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN extension VARCHAR(10) NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN birth_date DATE NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN age INT NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN sex ENUM('male', 'female', 'other') NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN purok_street VARCHAR(255) NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN barangay VARCHAR(100) NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN city VARCHAR(100) NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN province VARCHAR(100) NULL"); } catch (Exception $e) { /* ignore if exists */ }
    try { $db->query("ALTER TABLE users ADD COLUMN country VARCHAR(100) NULL"); } catch (Exception $e) { /* ignore if exists */ }
}

// Initialize database tables
createTables();

// Seed default admin if not exists
function seedDefaultAdmin() {
    try {
        $db = new Database();
        $stmt = $db->prepare("SELECT id FROM users WHERE username = ? LIMIT 1");
        $stmt->execute(['admin']);
        if (!$stmt->fetch()) {
            $passwordHash = password_hash('admin@12345', PASSWORD_DEFAULT); // Default password
            $securityAnswerHash = password_hash('admin', PASSWORD_DEFAULT); // Default answer
            $insert = $db->prepare("
                INSERT INTO users (username, email, password, security_question, security_answer, is_active, role)
                VALUES (?, ?, ?, ?, ?, 1, 'admin')
            ");
            $insert->execute([
                'admin',
                'admin@example.com',
                $passwordHash,
                'Master key?',
                $securityAnswerHash
            ]);
            // Reminder: You should change the admin password after first login in production!
        }
    } catch (Exception $e) {
        error_log('Admin seed error: ' . $e->getMessage());
    }
}
// Make sure the admin is always seeded
seedDefaultAdmin();
?>
