"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const win = document.getElementById("window-experiment-lab");
  if (!win) return;

  let initialized = false;

  const experiments = [
    { id: 1, name: "Light cycle optimization", status: "running", started: "2026-10-25", notes: "Testing 16h light / 8h dark cycle" },
    { id: 2, name: "Nutrient solution A/B", status: "completed", started: "2026-10-22", notes: "Compared two nutrient concentrations" },
    { id: 3, name: "pH adjustment trial", status: "paused", started: "2026-10-20", notes: "Testing pH 6.0 vs 6.5" },
  ];

  function init() {
    if (initialized) return;
    initialized = true;
    render();
  }

  function render() {
    const list = document.getElementById("experiment-list");
    if (!list) return;

    list.innerHTML = experiments.map((exp) => `
      <div class="experiment-card experiment-${exp.status}">
        <div class="experiment-header">
          <strong>${exp.name}</strong>
          <span class="experiment-status experiment-status-${exp.status}">${exp.status}</span>
        </div>
        <div class="experiment-meta">
          <span>Started: ${exp.started}</span>
        </div>
        <p class="muted">${exp.notes}</p>
      </div>
    `).join("");
  }

  win.addEventListener("app:opened", init);

  document.getElementById("experiment-add-btn")?.addEventListener("click", () => {
    const newId = Math.max(0, ...experiments.map(e => e.id)) + 1;
    experiments.unshift({
      id: newId,
      name: `New experiment ${newId}`,
      status: "planned",
      started: new Date().toISOString().split("T")[0],
      notes: "Add notes about this experiment.",
    });
    render();
  });
});