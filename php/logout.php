<?php
require_once 'config.php';

// Use the proper session cleanup function
endSession();

// Clear remember me cookie if it exists
if (isset($_COOKIE['remember_token'])) {
    setcookie('remember_token', '', time() - 3600, '/', '', false, true);
}

// Redirect to login page
header('Location: ../pages/login.php');
exit;
?>


