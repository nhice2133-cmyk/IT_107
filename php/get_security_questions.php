<?php
require_once 'config.php';

header('Content-Type: application/json');

<<<<<<< HEAD
$idNumber = '';
=======
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e
$email = '';
$userId = null;
if (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
    $payload = json_decode(file_get_contents('php://input'), true);
<<<<<<< HEAD
    $idNumber = sanitizeInput($payload['idNumber'] ?? '');
    $email = sanitizeInput($payload['email'] ?? '');
    $userId = isset($payload['user_id']) ? (int)$payload['user_id'] : null;
} else {
    $idNumber = sanitizeInput($_POST['idNumber'] ?? '');
=======
    $email = sanitizeInput($payload['email'] ?? '');
    $userId = isset($payload['user_id']) ? (int)$payload['user_id'] : null;
} else {
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e
    $email = sanitizeInput($_POST['email'] ?? '');
    $userId = isset($_POST['user_id']) ? (int)$_POST['user_id'] : null;
}

<<<<<<< HEAD
if (!$idNumber && !$email && !$userId) { echo json_encode(['success' => false, 'message' => 'ID number, email, or user_id is required']); exit; }
if ($email && !validateEmail($email)) { echo json_encode(['success' => false, 'message' => 'Invalid email']); exit; }
if ($idNumber && !preg_match('/^\d{4}-\d{4}$/', $idNumber)) { echo json_encode(['success' => false, 'message' => 'Invalid ID number format']); exit; }

$db = new Database();
if ($idNumber) {
    $stmt = $db->prepare("SELECT id FROM users WHERE id_number = ? AND is_active = 1 LIMIT 1");
    $stmt->execute([$idNumber]);
} elseif ($email) {
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ? AND is_active = 1 LIMIT 1");
    $stmt->execute([$email]);
} else {
    $stmt = $db->prepare("SELECT id FROM users WHERE id = ? AND is_active = 1 LIMIT 1");
    $stmt->execute([$userId]);
}
$user = $stmt->fetch();
if (!$user) { echo json_encode(['success' => false, 'message' => 'User not found.']); exit; }
=======
if (!$email && !$userId) { echo json_encode(['success' => false, 'message' => 'Email or user_id is required']); exit; }
if ($email && !validateEmail($email)) { echo json_encode(['success' => false, 'message' => 'Invalid email']); exit; }

$db = new Database();
$stmt = $email
    ? $db->prepare("SELECT id FROM users WHERE email = ? AND is_active = 1 LIMIT 1")
    : $db->prepare("SELECT id FROM users WHERE id = ? AND is_active = 1 LIMIT 1");
$stmt->execute([$email ?: $userId]);
$user = $stmt->fetch();
if (!$user) { echo json_encode(['success' => false, 'message' => 'Email not found.']); exit; }
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e

$q = $db->prepare("SELECT question1, question2, question3 FROM user_security_questions WHERE user_id = ? LIMIT 1");
$q->execute([$user['id']]);
$row = $q->fetch();
if (!$row) { echo json_encode(['success' => false, 'message' => 'No security questions set for this account.']); exit; }

echo json_encode(['success' => true, 'data' => $row]);
?>


