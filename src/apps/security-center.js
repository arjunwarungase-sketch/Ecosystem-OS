"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const win = document.getElementById("window-security-center");
  if (!win) return;

  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    const content = document.getElementById("security-status");
    if (!content) return;

    content.innerHTML = `
      <div class="security-grid">
        <div class="security-card security-ok">
          <div class="security-icon">✓</div>
          <div><strong>Telemetry connection</strong><small>Encrypted (simulated)</small></div>
        </div>
        <div class="security-card security-ok">
          <div class="security-icon">✓</div>
          <div><strong>Device authentication</strong><small>Controller verified</small></div>
        </div>
        <div class="security-card security-warn">
          <div class="security-icon">!</div>
          <div><strong>User authentication</strong><small>Not configured</small></div>
        </div>
        <div class="security-card security-ok">
          <div class="security-icon">✓</div>
          <div><strong>Actuator safety</strong><small>Cooldowns active</small></div>
        </div>
        <div class="security-card security-warn">
          <div class="security-icon">!</div>
          <div><strong>HTTPS</strong><small>Not enabled in dev</small></div>
        </div>
        <div class="security-card security-ok">
          <div class="security-icon">✓</div>
          <div><strong>API key storage</strong><small>Server-side only</small></div>
        </div>
      </div>
      <p class="muted" style="margin-top:16px;">In a production deployment, user authentication and HTTPS would be enforced. This is a demonstration environment with simulated telemetry.</p>
    `;
  }

  win.addEventListener("app:opened", init);
});