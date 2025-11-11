<?php
require_once 'config.php';

header('Content-Type: application/json');


// Support JSON payload only (existing behavior)
$payload = json_decode(file_get_contents('php://input'), true);
if (!$payload) { echo json_encode(['success' => false, 'message' => 'Invalid payload']); exit; }

$email = sanitizeInput($payload['email'] ?? '');
$a1 = trim($payload['answer1'] ?? '');
$a2 = trim($payload['answer2'] ?? '');
$a3 = trim($payload['answer3'] ?? '');
// Optional: allow password reset in the same call
$newPassword = $payload['newPassword'] ?? '';

if (!$email || !$a1 || !$a2 || !$a3) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}
if (!validateEmail($email)) { echo json_encode(['success' => false, 'message' => 'Invalid email']); exit; }
// If newPassword provided, validate minimal policy
if ($newPassword !== '' && strlen($newPassword) < PASSWORD_MIN_LENGTH) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least ' . PASSWORD_MIN_LENGTH . ' characters']);
    exit;
}

$db = new Database();
$stmt = $db->prepare("SELECT id FROM users WHERE email = ? AND is_active = 1 LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch();
if (!$user) { echo json_encode(['success' => false, 'message' => 'Email not found']); exit; }

$q = $db->prepare("SELECT answer1, answer2, answer3 FROM user_security_questions WHERE user_id = ? LIMIT 1");
$q->execute([$user['id']]);
$row = $q->fetch();
if (!$row) { echo json_encode(['success' => false, 'message' => 'No security questions on file']); exit; }

if (!password_verify($a1, $row['answer1']) || !password_verify($a2, $row['answer2']) || !password_verify($a3, $row['answer3'])) {
    echo json_encode(['success' => false, 'message' => 'Security answers do not match']);
    exit;
}
// If no newPassword provided, only verification is requested
if ($newPassword === '') {
    echo json_encode(['success' => true]);
    exit;
}

// Proceed to reset password when newPassword is provided
$hash = hashPassword($newPassword);
$up = $db->prepare("UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?");
$up->execute([$hash, $user['id']]);

echo json_encode(['success' => true, 'message' => 'Password reset successful']);
?>


