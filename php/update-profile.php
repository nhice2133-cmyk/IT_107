<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!validateSession()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) { 
    echo json_encode(['success' => false, 'message' => 'Invalid payload']); 
    exit; 
}

$username = sanitizeInput($input['username'] ?? '');
$email = sanitizeInput($input['email'] ?? '');
$phone = sanitizeInput($input['phone'] ?? '');
$address = sanitizeInput($input['address'] ?? '');

$errors = [];
if ($username === '' || strlen($username) < 3 || !preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
    $errors[] = 'Invalid username';
}
if ($email === '' || !validateEmail($email)) {
    $errors[] = 'Invalid email';
}
if (!empty($errors)) { 
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]); 
    exit; 
}

try {
    $db = new Database();

    // Ensure uniqueness excluding current user
    $chk = $db->prepare('SELECT id FROM users WHERE (username = ? OR email = ?) AND id <> ? LIMIT 1');
    $chk->execute([$username, $email, $_SESSION['user_id']]);
    if ($chk->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Username or email already in use']);
        exit;
    }

    $stmt = $db->prepare('UPDATE users SET username = ?, email = ?, phone = ?, address = ? WHERE id = ?');
    $stmt->execute([$username, $email, $phone, $address, $_SESSION['user_id']]);

    echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
} catch (Exception $e) {
    error_log('Update profile error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
}

?>


