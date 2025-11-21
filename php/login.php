<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, 'Invalid request method');
}

$username = strtolower(sanitizeInput($_POST['username'] ?? ''));
$password = $_POST['password'] ?? '';
$remember = isset($_POST['remember']);

if (empty($username) || empty($password)) {
    sendJsonResponse(false, 'Username and password are required');
}

// Login attempts check removed - only client-side validation remains

$db = new Database();

// Find user by username or email
$stmt = $db->prepare("SELECT * FROM users WHERE (LOWER(username) = ? OR LOWER(email) = ?) AND is_active = 1");
$stmt->execute([$username, $username]);
$user = $stmt->fetch();

if (!$user) {
    sendJsonResponse(false, 'Invalid username or password');
}

// Verify password
if (!verifyPassword($password, $user['password'])) {
    sendJsonResponse(false, 'Invalid username or password');
}

// Successful login

// Regenerate session ID to prevent session fixation
session_regenerate_id(true);

// Set session variables
$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];
$_SESSION['email'] = $user['email'];
$_SESSION['login_time'] = time();
$_SESSION['last_activity'] = time();
$_SESSION['last_regeneration'] = time();

// Set remember me cookie if requested
if ($remember) {
    $token = generateToken();
    $expires = time() + (30 * 24 * 60 * 60); // 30 days
    
    setcookie('remember_token', $token, $expires, '/', '', false, true);
    
    // Store token in database (you might want to create a remember_tokens table)
    // For now, we'll just set the cookie
}

// Update last login time
$stmt = $db->prepare("UPDATE users SET updated_at = NOW() WHERE id = ?");
$stmt->execute([$user['id']]);

sendJsonResponse(true, 'Login successful', [
    'user_id' => $user['id'],
    'username' => $user['username'],
    'email' => $user['email']
]);
?>


