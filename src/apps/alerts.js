"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const win = document.getElementById("window-alerts");
  if (!win) return;

  const content = document.getElementById("alerts-content");
  if (!content) return;

  let initialized = false;
  let unsubscribe = null;
  let dismissed = new Set();

  function init() {
    if (initialized) return;
    initialized = true;

    if (window.TelemetryStore) {
      unsubscribe = window.TelemetryStore.subscribe((state) => update(state));
    }
  }

  function severityIcon(sev) {
    if (sev === "warning") return "⚠";
    if (sev === "error") return "✕";
    if (sev === "info") return "i";
    return "•";
  }

  function update(state) {
    if (!state || !state.connected) return;

    const list = document.getElementById("alerts-list");
    if (!list) return;

    const visibleAlerts = state.alerts.filter(a => !dismissed.has(a.id));

    if (visibleAlerts.length === 0) {
      list.innerHTML = `
        <div class="alerts-empty">
          <img src="src/assets/icons/illustrations/success-state.svg" alt="" style="width:64px;opacity:0.6;">
          <p>No active alerts. All systems operating normally.</p>
        </div>`;
      return;
    }

    list.innerHTML = visibleAlerts.map((alert) => `
      <div class="alert-card alert-${alert.severity}">
        <div class="alert-icon">${severityIcon(alert.severity)}</div>
        <div class="alert-body">
          <strong>${alert.message}</strong>
          <small>${new Date(alert.timestamp).toLocaleTimeString()} · ${alert.type}</small>
        </div>
        <button class="alert-dismiss" data-alert-id="${alert.id}">×</button>
      </div>
    `).join("");

    list.querySelectorAll(".alert-dismiss").forEach((btn) => {
      btn.addEventListener("click", () => {
        dismissed.add(Number(btn.dataset.alertId));
        update(state);
      });
    });
  }

  win.addEventListener("app:opened", init);
});