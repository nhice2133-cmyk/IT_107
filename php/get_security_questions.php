<?php
require_once 'config.php';

header('Content-Type: application/json');

$email = '';
$userId = null;
if (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
    $payload = json_decode(file_get_contents('php://input'), true);
    $email = sanitizeInput($payload['email'] ?? '');
    $userId = isset($payload['user_id']) ? (int)$payload['user_id'] : null;
} else {
    $email = sanitizeInput($_POST['email'] ?? '');
    $userId = isset($_POST['user_id']) ? (int)$_POST['user_id'] : null;
}

if (!$email && !$userId) { echo json_encode(['success' => false, 'message' => 'Email or user_id is required']); exit; }
if ($email && !validateEmail($email)) { echo json_encode(['success' => false, 'message' => 'Invalid email']); exit; }

$db = new Database();
$stmt = $email
    ? $db->prepare("SELECT id FROM users WHERE email = ? AND is_active = 1 LIMIT 1")
    : $db->prepare("SELECT id FROM users WHERE id = ? AND is_active = 1 LIMIT 1");
$stmt->execute([$email ?: $userId]);
$user = $stmt->fetch();
if (!$user) { echo json_encode(['success' => false, 'message' => 'Email not found.']); exit; }

$q = $db->prepare("SELECT question1, question2, question3 FROM user_security_questions WHERE user_id = ? LIMIT 1");
$q->execute([$user['id']]);
$row = $q->fetch();
if (!$row) { echo json_encode(['success' => false, 'message' => 'No security questions set for this account.']); exit; }

echo json_encode(['success' => true, 'data' => $row]);
?>


