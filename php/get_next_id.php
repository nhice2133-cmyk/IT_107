<?php
require_once 'config.php';
header('Content-Type: application/json');
try {
    $db = new Database();
    $currentYear = date('Y');
    $prefix = $currentYear . '-';
    $stmt = $db->prepare("SELECT id_number FROM users WHERE id_number LIKE ? ORDER BY id_number DESC LIMIT 1");
    $stmt->execute([$prefix . '%']);
    $lastId = $stmt->fetchColumn();
    if ($lastId) {
        $parts = explode('-', $lastId);
        $seq = intval($parts[1]) + 1;
    } else {
        $seq = 1;
    }
    $nextSeq = str_pad($seq, 4, '0', STR_PAD_LEFT);
    $nextId = $currentYear . '-' . $nextSeq;
    echo json_encode(['success' => true, 'idNumber' => $nextId]);
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
