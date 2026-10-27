"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const win = document.getElementById("window-reports");
  if (!win) return;

  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    const list = document.getElementById("reports-list");
    if (!list) return;

    const reports = [
      { name: "Weekly Ecosystem Summary", date: "2026-10-27", type: "Weekly", icon: "📄" },
      { name: "Telemetry Health Report", date: "2026-10-27", type: "Health", icon: "❤️" },
      { name: "Sensor Calibration Report", date: "2026-10-26", type: "Calibration", icon: "🔧" },
      { name: "Monthly Report — September 2026", date: "2026-10-01", type: "Monthly", icon: "📅" },
      { name: "Automation Audit Log", date: "2026-09-28", type: "Audit", icon: "🔍" },
    ];

    list.innerHTML = reports.map((r) => `
      <div class="report-card">
        <span class="report-icon">${r.icon}</span>
        <div class="report-info">
          <strong>${r.name}</strong>
          <small>${r.type} · ${r.date}</small>
        </div>
        <button class="report-view-btn">View</button>
      </div>
    `).join("");
  }

  win.addEventListener("app:opened", init);
});