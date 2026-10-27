"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const win = document.getElementById("window-dashboard");
  if (!win) return;

  let initialized = false;
  let unsubscribe = null;

  function init() {
    if (initialized) return;
    initialized = true;

    const content = win.querySelector(".window-content");
    if (!content) return;

    content.innerHTML = `
      <h2>Ecosystem Dashboard</h2>
      <p class="muted">A complete overview of your ecosystem at a glance.</p>
      <div class="dashboard-app-grid" id="dashboard-grid"></div>
    `;

    const grid = document.getElementById("dashboard-grid");
    if (!grid) return;

    const cards = [
      { app: "system-monitor", icon: "src/assets/icons/apps/system-monitor.svg", title: "System", metric: "monitor-cpu" },
      { app: "telemetrics", icon: "src/assets/icons/apps/telemetrics.svg", title: "Air Temperature", metric: "dash-air-temp" },
      { app: "telemetrics", icon: "src/assets/icons/apps/telemetrics.svg", title: "Soil Moisture", metric: "dash-soil-moisture" },
      { app: "telemetrics", icon: "src/assets/icons/apps/telemetrics.svg", title: "Water Level", metric: "dash-water-level" },
      { app: "ecosystem-controls", icon: "src/assets/icons/apps/device-manager.svg", title: "Active Actuators", metric: "dash-actuators" },
      { app: "alerts", icon: "src/assets/icons/apps/alerts.svg", title: "Active Alerts", metric: "dash-alerts" },
    ];

    grid.innerHTML = cards.map((c) => `
      <div class="dashboard-app-card" data-open-app="${c.app}">
        <img src="${c.icon}" alt="">
        <h3>${c.title}</h3>
        <strong id="${c.metric}">--</strong>
      </div>
    `).join("");

    grid.querySelectorAll("[data-open-app]").forEach((card) => {
      card.addEventListener("click", () => {
        card.dispatchEvent(new CustomEvent("click", { bubbles: true }));
      });
    });

    if (window.TelemetryStore) {
      unsubscribe = window.TelemetryStore.subscribe((state) => update(state));
    }
  }

  function update(state) {
    if (!state || !state.connected) return;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    set("monitor-cpu", `${state.system.cpu}%`);
    set("dash-air-temp", `${state.telemetry.airTemperature}°C`);
    set("dash-soil-moisture", `${state.telemetry.soilMoisture}%`);
    set("dash-water-level", `${state.telemetry.waterLevel}%`);
    set("dash-actuators", Object.values(state.actuators).filter(Boolean).length);
    set("dash-alerts", state.alerts.length);
  }

  win.addEventListener("app:opened", init);
});