"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const win = document.getElementById("window-system-monitor");
  if (!win) return;

  const content = win.querySelector(".window-content");
  let initialized = false;
  let unsubscribe = null;
  let history = [];

  function init() {
    if (initialized) return;
    initialized = true;

    content.innerHTML = `
      <h2>System overview</h2>
      <div class="detail-grid">
        <div class="detail-card">
          <span>CPU usage</span>
          <strong id="monitor-cpu">--</strong>
          <div class="monitor-bar"><div class="monitor-bar-fill" id="cpu-bar"></div></div>
        </div>
        <div class="detail-card">
          <span>Memory usage</span>
          <strong id="monitor-memory">--</strong>
          <div class="monitor-bar"><div class="monitor-bar-fill" id="memory-bar"></div></div>
        </div>
        <div class="detail-card">
          <span>System health</span>
          <strong id="monitor-health">Unknown</strong>
        </div>
        <div class="detail-card">
          <span>Uptime</span>
          <strong id="monitor-uptime">--</strong>
        </div>
      </div>
      <h3 style="margin: 22px 0 12px; font-family: var(--font-display); font-size: 15px;">CPU usage history</h3>
      <canvas id="cpu-canvas" width="780" height="120" style="width:100%; border:1px solid var(--border); border-radius:10px; background:var(--surface);"></canvas>
      <p class="muted" style="margin-top:16px;">Telemetry data is simulated for demonstration. In a real deployment, these values come from the backend connected to physical hardware.</p>
    `;

    if (window.TelemetryStore) {
      unsubscribe = window.TelemetryStore.subscribe((state) => update(state));
    }
  }

  function update(state) {
    if (!state || !state.connected) return;

    const cpuEl = document.getElementById("monitor-cpu");
    const memEl = document.getElementById("monitor-memory");
    const healthEl = document.getElementById("monitor-health");
    const uptimeEl = document.getElementById("monitor-uptime");
    const cpuBar = document.getElementById("cpu-bar");
    const memBar = document.getElementById("memory-bar");

    if (cpuEl) cpuEl.textContent = `${state.system.cpu}%`;
    if (memEl) memEl.textContent = `${state.system.memory}%`;
    if (healthEl) {
      healthEl.textContent = state.system.health;
      healthEl.style.color = state.system.health === "Healthy" ? "var(--success)" : state.system.health === "Warning" ? "var(--warning)" : "var(--text)";
    }
    if (uptimeEl) {
      const mins = Math.floor(state.system.uptime / 60);
      const secs = state.system.uptime % 60;
      uptimeEl.textContent = `${mins}m ${secs}s`;
    }

    if (cpuBar) {
      cpuBar.style.width = `${state.system.cpu}%`;
      cpuBar.style.background = state.system.cpu > 28 ? "var(--warning)" : "var(--success)";
    }
    if (memBar) {
      memBar.style.width = `${state.system.memory}%`;
      memBar.style.background = state.system.memory > 70 ? "var(--warning)" : "var(--accent)";
    }

    history.push(state.system.cpu);
    if (history.length > 60) history.shift();

    drawChart();
  }

  function drawChart() {
    const canvas = document.getElementById("cpu-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.dataset.theme !== "light";
    const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
    const lineColor = "#6f84ff";

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    if (history.length < 2) return;

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    history.forEach((val, i) => {
      const x = (w / (history.length - 1)) * i;
      const y = h - (val / 100) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = "rgba(111,132,255,0.12)";
    ctx.fill();
  }

  win.addEventListener("app:opened", init);
});