<?php
require_once 'config.php';

header('Content-Type: application/json');

$idNumber = '';
if (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
    $payload = json_decode(file_get_contents('php://input'), true);
    $idNumber = sanitizeInput($payload['idNumber'] ?? '');
} else {
    $idNumber = sanitizeInput($_POST['idNumber'] ?? '');
}

if (!$idNumber) {
    echo json_encode(['success' => false, 'message' => 'ID number is required']);
    exit;
}

// Validate ID number format (YYYY-XXXX)
if (!preg_match('/^\d{4}-\d{4}$/', $idNumber)) {
    echo json_encode(['success' => false, 'message' => 'Invalid ID number format']);
    exit;
}

$db = new Database();

$stmt = $db->prepare("SELECT id FROM users WHERE id_number = ? AND is_active = 1 LIMIT 1");
$stmt->execute([$idNumber]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'ID number not found.']);
    exit;
}

// Optional: check if security questions exist
$q = $db->prepare("SELECT 1 FROM user_security_questions WHERE user_id = ? LIMIT 1");
$q->execute([$user['id']]);
$hasQuestions = (bool)$q->fetch();

echo json_encode([
    'success' => true,
    'data' => [
        'idNumber' => $idNumber,
        'hasQuestions' => $hasQuestions
    ]
]);
?>




