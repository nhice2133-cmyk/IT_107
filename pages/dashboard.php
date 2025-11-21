<?php
require_once '../php/config.php';

<<<<<<< HEAD
// Validate session and show 404 if not authenticated
if (!validateSession()) {
    requireAuth404();
=======
// Validate session and redirect to login if not authenticated
if (!validateSession()) {
    header('Location: login.php');
    exit();
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard - CyberAuth System</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;500;700&display=swap" rel="stylesheet">

  <!-- Shared cyberpunk theme for consistency across pages -->
  <link rel="stylesheet" href="../css/cyberpunk-login.css" />

  <!-- Dashboard-specific light overrides while respecting the shared theme -->
  <style>
    :root {
      --cyber-surface-2: rgba(0, 0, 0, 0.5);
    }

    /* Align main area with theme; allow scrolling content */
    .cyber-main { height: auto; min-height: calc(100vh - 140px); margin-top: 80px; display: block; }

    .dash-wrap { 
      max-width: 1200px; 
      margin: 0 auto; 
      padding: 0 2rem 2rem; 
      display: grid; 
      gap: 1rem; 
    }

    /* Welcome banner */
    .welcome { 
      display: flex; 
      align-items: center; 
      justify-content: space-between; 
      gap: 0.8rem; 
      border: 1px solid var(--cyber-primary); 
      border-radius: 10px; 
      padding: 0.9rem 1rem; 
      background: linear-gradient(135deg, rgba(26,26,26,0.85), rgba(0,0,0,0.95)); 
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.12);
    }
    .welcome .title { 
      font-family: 'Orbitron', monospace; 
      font-weight: 900; 
      letter-spacing: 1px; 
      text-transform: uppercase; 
      color: var(--cyber-primary);
    }
    .welcome .sub { color: var(--cyber-text-dim); font-size: 0.9rem; }
    .badge { 
      display: inline-flex; 
      align-items: center; 
      gap: .4rem; 
      padding: .3rem .6rem; 
      border: 1px solid var(--cyber-primary); 
      border-radius: 999px; 
      color: var(--cyber-primary); 
      font-weight: 800; 
      text-transform: uppercase; 
      letter-spacing: 1px; 
      font-size: 0.75rem; 
    }

    /* Panels */
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .panel { border: 1px solid var(--cyber-border); border-radius: 10px; background: var(--cyber-surface-2); overflow: hidden; }
    .panel-hd { padding: 0.8rem 1rem; border-bottom: 1px solid var(--cyber-border); display:flex; justify-content: space-between; align-items:center; }
    .panel-title { font-family: 'Orbitron', monospace; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; color: var(--cyber-primary); font-size: 0.95rem; }
    .panel-bd { padding: 1rem; }

    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.8rem; }
    .stat { text-align:center; border:1px solid var(--cyber-border); border-radius: 10px; padding: 0.8rem; background: rgba(0,0,0,0.35); }
    .stat .num { display:block; font-family:'Orbitron', monospace; color: var(--cyber-primary); font-size: 1.2rem; font-weight: 900; }
    .stat .lbl { color: var(--cyber-text-dim); font-size: 0.8rem; text-transform: uppercase; }

    .actions { display:flex; gap: .6rem; flex-wrap: wrap; }
    .actions .cyber-btn { text-align:center; }

    .terminal { background:#000; border:1px solid var(--cyber-border); border-radius:10px; padding: 0.8rem; font-family: 'Rajdhani', monospace; font-size: 0.95rem; height: 160px; overflow:auto; }

    .list { display: grid; gap: 0.6rem; }
    .list-item { border:1px solid var(--cyber-border); border-radius: 10px; padding: 0.6rem 0.8rem; background: rgba(0,0,0,0.35); color: var(--cyber-text-dim); }

    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
      .stats { grid-template-columns: 1fr 1fr; }
      .dash-wrap { padding: 0 1rem 1rem; }
    }
  </style>
</head>
<body>
  <!-- Animated background (shared theme) -->
  <div class="cyber-grid" aria-hidden="true"></div>
  <div class="neon-particles" aria-hidden="true"></div>
  <div class="scan-lines" aria-hidden="true"></div>

  <!-- Header (shared theme) -->
  <header class="cyber-header">
    <div class="header-content">
      <div class="logo-container">
        <div class="logo-icon">⚡</div>
        <h1 class="logo-text">CYBER<span class="accent">AUTH</span></h1>
      </div>
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
      <div class="header-actions">
        <a href="change-password.php" class="nav-link cyber-link">CHANGE PASSWORD</a>
        <a href="../php/logout.php" class="nav-link cyber-link">LOGOUT</a>
      </div>
>>>>>>> 7227c79c4fbdf61914be7893bc9dedd8371defbb
>>>>>>> a1f61761fb42c6888cbff1da3e5852e7af719b2e
    </div>
  </header>

  <!-- Main -->
  <main class="cyber-main">
    <div class="dash-wrap">
      <section class="welcome">
        <div>
          <div class="title">Neon Dashboard</div>
          <div class="sub" id="welcome-message">Welcome, User!</div>
        </div>
        <div class="badge">System Online</div>
      </section>

      <section class="grid">
        <div class="panel">
          <div class="panel-hd"><div class="panel-title">Overview</div></div>
          <div class="panel-bd">
            <div class="stats">
              <div class="stat"><span class="num" id="stat-logins">12</span><span class="lbl">Logins</span></div>
              <div class="stat"><span class="num" id="stat-status">Active</span><span class="lbl">Status</span></div>
              <div class="stat"><span class="num" id="stat-joined">2025</span><span class="lbl">Joined</span></div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-hd"><div class="panel-title">Quick Actions</div></div>
          <div class="panel-bd">
            <div class="actions">
              <a class="cyber-btn" href="edit-profile.php"><span class="btn-text">Edit Profile</span><div class="btn-glow"></div></a>
              <a class="cyber-btn" href="change-password.php"><span class="btn-text">Change Password</span><div class="btn-glow"></div></a>
              <a class="cyber-btn" href="../php/logout.php"><span class="btn-text">Logout</span><div class="btn-glow"></div></a>
            </div>
          </div>
        </div>
      </section>

      <section class="grid">
        <div class="panel">
          <div class="panel-hd"><div class="panel-title">Security Console</div></div>
          <div class="panel-bd">
            <div id="sec-term" class="terminal"></div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-hd"><div class="panel-title">Recent Activity</div></div>
          <div class="panel-bd">
            <div class="list" id="activity-list">
              <div class="list-item">[10:24] Login successful — Neon City (Chrome)</div>
              <div class="list-item">[09:58] Password changed</div>
              <div class="list-item">[Yesterday] Reset link requested</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>

  <!-- Footer (shared theme) -->
  <footer class="cyber-footer">
    <div class="footer-content">
      <div class="footer-text">
        <span>&copy; 2025 CYBERAUTH SYSTEM</span>
        <span class="footer-accent">NEURAL NETWORK v2.1.7</span>
      </div>
      <div class="footer-status">
        <span class="status-indicator online"></span>
        <span class="status-text">SYSTEM ONLINE</span>
      </div>
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
  <script src="../js/dashboard.js"></script>
  
  <!-- Back button protection disabled during debugging -->
</body>
</html>
