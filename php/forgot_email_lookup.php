<?php
require_once 'config.php';

header('Content-Type: application/json');

$email = '';
if (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
    $payload = json_decode(file_get_contents('php://input'), true);
    $email = sanitizeInput($payload['email'] ?? '');
} else {
    $email = sanitizeInput($_POST['email'] ?? '');
}

if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit;
}
if (!validateEmail($email)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email']);
    exit;
}

$db = new Database();

$stmt = $db->prepare("SELECT id FROM users WHERE email = ? AND is_active = 1 LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'Email not found.']);
    exit;
}

// Optional: check if security questions exist
$q = $db->prepare("SELECT 1 FROM user_security_questions WHERE user_id = ? LIMIT 1");
$q->execute([$user['id']]);
$hasQuestions = (bool)$q->fetch();

echo json_encode([
    'success' => true,
    'data' => [
        'email' => $email,
        'hasQuestions' => $hasQuestions
    ]
]);
?>


