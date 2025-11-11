<?php
require_once '../php/config.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

// Fetch current user data
$db = new Database();
$stmt = $db->prepare('SELECT username, email, address, phone, profile_picture, role, is_active, created_at FROM users WHERE id = ? LIMIT 1');
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();
if (!$user) {
    header('Location: login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Edit Profile - CyberAuth System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/cyberpunk-login.css" />
  <style>
    .profile-container { 
      max-width: 1200px; 
      margin: 100px auto 40px; 
      padding: 1rem; 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 2rem; 
    }
    
    .profile-section { 
      background: var(--cyber-surface-2); 
      border: 1px solid var(--cyber-border); 
      border-radius: 15px; 
      padding: 1.5rem; 
    }
    
    .section-header { 
      display: flex; 
      align-items: center; 
      gap: 0.5rem; 
      margin-bottom: 1.5rem; 
    }
    
    .section-icon { 
      width: 24px; 
      height: 24px; 
      background: var(--cyber-primary); 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 12px; 
      color: var(--cyber-bg); 
    }
    
    .section-title { 
      font-family: 'Orbitron', monospace; 
      color: var(--cyber-primary); 
      font-size: 1.2rem; 
      font-weight: 700; 
      text-transform: uppercase; 
      letter-spacing: 1px; 
    }
    
    .form { display: grid; gap: 1rem; }
    .row { display: grid; gap: 0.5rem; }
    .error { color: #ff6b6b; font-weight: 700; }
    .success { color: #38ef7d; font-weight: 700; }
    .hint { color: var(--cyber-text-dim); font-size: 0.8rem; }
    
    .account-details { 
      display: grid; 
      gap: 1rem; 
    }
    
    .avatar-section { 
      text-align: center; 
      margin-bottom: 1.5rem; 
    }
    
    .avatar { 
      width: 100px; 
      height: 100px; 
      border-radius: 50%; 
      background: var(--cyber-primary); 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 2rem; 
      font-weight: 900; 
      color: var(--cyber-bg); 
      margin: 0 auto; 
    }
    
    .detail-item { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      padding: 0.8rem; 
      border: 1px solid var(--cyber-border); 
      border-radius: 8px; 
      background: rgba(0,0,0,0.35); 
    }
    
    .detail-label { 
      color: var(--cyber-text-dim); 
      font-size: 0.9rem; 
      font-weight: 500; 
    }
    
    .detail-value { 
      color: var(--cyber-primary); 
      font-weight: 700; 
    }
    
    .status-badge { 
      background: var(--cyber-success); 
      color: var(--cyber-bg); 
      padding: 0.2rem 0.6rem; 
      border-radius: 12px; 
      font-size: 0.8rem; 
      font-weight: 700; 
    }
    
    .update-btn { 
      background: var(--cyber-success); 
      color: var(--cyber-bg); 
      border: none; 
      padding: 0.8rem 1.5rem; 
      border-radius: 8px; 
      font-weight: 700; 
      cursor: pointer; 
      display: flex; 
      align-items: center; 
      gap: 0.5rem; 
      margin-top: 1rem; 
      transition: all 0.3s ease; 
    }
    
    .update-btn:hover { 
      background: #00cc00; 
      transform: translateY(-2px); 
    }
    
    .email-hint { 
      color: var(--cyber-text-dim); 
      font-size: 0.7rem; 
      font-style: italic; 
    }
    
    @media (max-width: 768px) {
      .profile-container { 
        grid-template-columns: 1fr; 
        gap: 1rem; 
      }
    }
  </style>
</head>
<body>
  <div class="cyber-grid" aria-hidden="true"></div>
  <div class="neon-particles" aria-hidden="true"></div>
  <div class="scan-lines" aria-hidden="true"></div>

  <header class="cyber-header">
    <div class="header-content">
      <div class="logo-container">
        <div class="logo-icon">⚡</div>
        <h1 class="logo-text">EDIT <span class="accent">PROFILE</span></h1>
      </div>
      <div class="header-actions">
        <a href="dashboard.php" class="nav-link cyber-link">BACK TO DASHBOARD</a>
        <a href="../php/logout.php" class="nav-link cyber-link">LOGOUT</a>
      </div>
    </div>
  </header>

  <main class="cyber-main">
    <div class="profile-container">
      <!-- Left Section: Profile Information -->
      <div class="profile-section">
        <div class="section-header">
          <div class="section-icon">👤</div>
          <h2 class="section-title">Profile Information</h2>
        </div>
        
        <form id="editProfileForm" class="form" novalidate>
          <div id="msg" role="status" aria-live="polite"></div>

          <div class="row">
            <label class="cyber-label" for="username">Full Name</label>
            <input id="username" name="username" class="cyber-input" type="text" value="<?php echo htmlspecialchars($user['username']); ?>" />
            <div class="hint">Only letters, numbers, and underscores. Min 3 chars.</div>
          </div>

          <div class="row">
            <label class="cyber-label" for="email">Email Address</label>
            <input id="email" name="email" class="cyber-input" type="email" value="<?php echo htmlspecialchars($user['email']); ?>" />
            <div class="email-hint">Email cannot be changed</div>
          </div>

          <div class="row">
            <label class="cyber-label" for="phone">Phone Number</label>
            <input id="phone" name="phone" class="cyber-input" type="tel" value="<?php echo htmlspecialchars($user['phone'] ?? ''); ?>" placeholder="Enter phone number" />
          </div>

          <div class="row">
            <label class="cyber-label" for="address">Address</label>
            <textarea id="address" name="address" class="cyber-input" rows="3" placeholder="Enter your full address"><?php echo htmlspecialchars($user['address'] ?? ''); ?></textarea>
          </div>

          <button type="submit" class="update-btn">
            <span>🔄</span>
            <span>Update Profile</span>
          </button>
        </form>
      </div>

      <!-- Right Section: Account Details -->
      <div class="profile-section">
        <div class="section-header">
          <div class="section-icon">ℹ</div>
          <h2 class="section-title">Account Details</h2>
        </div>
        
        <div class="account-details">
          <div class="avatar-section">
            <div class="avatar"><?php echo strtoupper(substr($user['username'], 0, 1)); ?></div>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">Role</span>
            <span class="detail-value"><?php echo htmlspecialchars(ucfirst($user['role'] ?? 'user')); ?></span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">Status</span>
            <span class="status-badge"><?php echo ($user['is_active'] ? 'Active' : 'Inactive'); ?></span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">Member Since</span>
            <span class="detail-value"><?php echo date('M d, Y', strtotime($user['created_at'])); ?></span>
          </div>
        </div>
      </div>
    </div>
  </main>

  <script>
  const form = document.getElementById('editProfileForm');
  const msg = document.getElementById('msg');

  function setMessage(text, ok) {
    msg.textContent = text;
    msg.className = ok ? 'success' : 'error';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setMessage('', true);

    const payload = {
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim()
    };

    try {
      const res = await fetch('../php/update-profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setMessage(data.message || (data.success ? 'Profile updated successfully' : 'Error'), !!data.success);
      if (data.success) {
        setTimeout(() => { window.location.href = 'dashboard.php'; }, 1200);
      }
    } catch (err) {
      setMessage('Network error. Please try again.', false);
    }
  });
  </script>
</body>
</html>


