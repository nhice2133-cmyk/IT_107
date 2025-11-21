<?php
require_once '../php/config.php';

// Check if user is already logged in, redirect to dashboard
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Forgot Password — Neon Recovery</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;500;700&display=swap" rel="stylesheet">

  <!-- Minimal fallback to guarantee dark theme -->
  <style>
    * { box-sizing: border-box; }
    :root {
      --cyber-primary: #00ffff;
      --cyber-secondary: #ff0080;
      --cyber-accent: #ffff00;
      --cyber-bg: #0a0a0a;
      --cyber-surface: #1a1a1a;
      --cyber-text: #ffffff;
      --cyber-text-dim: #888888;
      --cyber-border: #333333;
      --cyber-success: #00ff00;
      --cyber-error: #ff0040;
    }
    html, body { height: 100%; background: var(--cyber-bg); color: var(--cyber-text); margin: 0; overflow-x: hidden; }
    .cyber-header { position: fixed; top: 0; left: 0; right: 0; background: rgba(26,26,26,0.9); border-bottom: 1px solid var(--cyber-primary); z-index: 1000; padding: 1rem 0; }
    .header-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 1rem; }
    .logo-text { font-family: 'Orbitron', monospace; font-weight: 900; }
    .logo-icon { color: var(--cyber-primary); margin-right: .4rem; }
    .cyber-link { color: var(--cyber-text); text-decoration: none; margin-left: 1rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }

    .wrap { min-height: calc(100vh - 140px); margin-top: 80px; margin-bottom: 60px; display: grid; place-items: center; padding: 1rem; }
    .panel { width: 100%; max-width: 520px; border: 1px solid var(--cyber-primary); border-radius: 10px; background: linear-gradient(135deg, rgba(26,26,26,0.9), rgba(0,0,0,0.95)); box-shadow: 0 0 30px rgba(0,255,255,0.18); padding: 1rem; }
    .panel h2 { font-family: 'Orbitron', monospace; font-size: 1.2rem; margin: 0.2rem 0 0.4rem; text-shadow: 0 0 12px var(--cyber-primary); }
    .lead { color: var(--cyber-text-dim); margin-bottom: 0.8rem; font-size: 0.95rem; }

    .form-group { margin-bottom: 0.8rem; }
    label { display: block; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 0.25rem; }
<<<<<<< HEAD
    input[type="text"] {
      width: 100%; padding: 0.6rem 0.7rem; border-radius: 6px; border: 2px solid var(--cyber-border);
      background: rgba(0,0,0,0.5); color: var(--cyber-text); outline: none; transition: .2s ease;
    }
    input[type="text"]:focus { border-color: var(--cyber-primary); box-shadow: 0 0 14px rgba(0,255,255,0.25); background: rgba(0,0,0,0.7); }
=======
    input[type="email"] {
      width: 100%; padding: 0.6rem 0.7rem; border-radius: 6px; border: 2px solid var(--cyber-border);
      background: rgba(0,0,0,0.5); color: var(--cyber-text); outline: none; transition: .2s ease;
    }
    input[type="email"]:focus { border-color: var(--cyber-primary); box-shadow: 0 0 14px rgba(0,255,255,0.25); background: rgba(0,0,0,0.7); }
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e

    .cyber-btn { display: inline-block; width: 100%; background: linear-gradient(45deg, var(--cyber-primary), var(--cyber-secondary)); color: #000; border: none; border-radius: 8px; padding: 0.8rem 1rem; font-family: 'Orbitron', monospace; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; }
    .form-links { margin-top: 0.8rem; text-align: center; }
    .form-links a { color: var(--cyber-primary); text-decoration: none; font-weight: 700; }

    .error-message { display: none; color: var(--cyber-error); font-size: 0.8rem; margin-top: 0.25rem; }

    .cyber-footer { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(26,26,26,0.9); border-top: 1px solid var(--cyber-primary); z-index: 1000; padding: 1rem 0; }
    .footer-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 1rem; }
    .footer-accent { color: var(--cyber-primary); font-weight: 700; }

    /* Background layers */
    .cyber-grid { position: fixed; inset: 0; background-image: linear-gradient(rgba(0,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.08) 1px, transparent 1px); background-size: 50px 50px; z-index: -3; }
    .neon-particles { position: fixed; inset: 0; background: radial-gradient(circle at 20% 80%, rgba(0,255,255,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,0,128,0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(255,255,0,0.06) 0%, transparent 50%); z-index: -2; }
    .scan-lines { position: fixed; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px); z-index: -1; }
  </style>

  <!-- Full theme styles -->
  <link rel="stylesheet" href="../css/cyberpunk-login.css" />
</head>
<body>
  <!-- Animated background -->
  <div class="cyber-grid" aria-hidden="true"></div>
  <div class="neon-particles" aria-hidden="true"></div>
  <div class="scan-lines" aria-hidden="true"></div>

  <!-- Header -->
  <header class="cyber-header">
    <div class="header-content">
      <div class="logo-container"><span class="logo-icon">⚡</span><span class="logo-text">Cyber<span class="accent">Auth</span></span></div>
      <div class="header-actions">
        <a href="index.php" class="cyber-link">Home</a>
        <a href="login.php" class="cyber-link">Login</a>
      </div>
    </div>
  </header>

  <!-- Content -->
  <main class="wrap">
    <section class="panel">
      <h2>Forgot Password</h2>
<<<<<<< HEAD
      <p class="lead">Enter your ID number to continue.</p>

      <form id="forgotPasswordForm">
        <div class="form-group">
          <label for="idNumber">ID Number</label>
          <input type="text" id="idNumber" name="idNumber" placeholder="YYYY-XXXX" />
          <span class="error-message"></span>
        </div>

        <button type="submit" class="cyber-btn">Verify ID Number</button>
=======
      <p class="lead">Enter your registered email to continue.</p>

      <form id="forgotPasswordForm">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" name="email" />
          <span class="error-message"></span>
        </div>

        <button type="submit" class="cyber-btn">Verify Email</button>
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e

        <div class="form-links">
          <a href="login.php">Back to Login</a>
        </div>
      </form>
    </section>
  </main>

  <!-- Footer -->
  <footer class="cyber-footer">
    <div class="footer-content">
      <div class="footer-text"><span>&copy; 2025 Auth System</span></div>
      <div class="footer-text"><span class="footer-accent">Neon • Secure • Fast</span></div>
    </div>
  </footer>

<<<<<<< HEAD
  <script src="../js/disable-rightclick.js"></script>
=======
<<<<<<< HEAD
  <script src="../js/disable-rightclick.js"></script>
=======
>>>>>>> 7227c79c4fbdf61914be7893bc9dedd8371defbb
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e
  <script src="../js/forgot-password.js"></script>
</body>
</html>
