"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const win = document.getElementById("window-file-manager");
  if (!win) return;

  const content = win.querySelector(".window-content");
  let initialized = false;

  const folders = {
    "Telemetry": {
      icon: "📊",
      files: [
        { name: "air-temperature.json", size: "2.4 KB", date: "2026-10-27", type: "Sensor data" },
        { name: "soil-moisture.json", size: "1.8 KB", date: "2026-10-27", type: "Sensor data" },
        { name: "water-level.json", size: "1.2 KB", date: "2026-10-26", type: "Sensor data" },
        { name: "air-quality.json", size: "3.1 KB", date: "2026-10-27", type: "Sensor data" },
      ],
    },
    "Experiments": {
      icon: "🧪",
      files: [
        { name: "experiment-01-light-cycle.md", size: "4.6 KB", date: "2026-10-25", type: "Experiment record" },
        { name: "experiment-02-nutrient-test.md", size: "3.9 KB", date: "2026-10-22", type: "Experiment record" },
        { name: "experiment-03-ph-adjustment.md", size: "2.1 KB", date: "2026-10-20", type: "Experiment record" },
      ],
    },
    "Reports": {
      icon: "📄",
      files: [
        { name: "weekly-summary-2026-43.pdf", size: "128 KB", date: "2026-10-27", type: "Generated report" },
        { name: "monthly-report-2026-09.pdf", size: "256 KB", date: "2026-10-01", type: "Generated report" },
        { name: "health-check-2026-10-27.pdf", size: "45 KB", date: "2026-10-27", type: "Generated report" },
      ],
    },
    "Backups": {
      icon: "💾",
      files: [
        { name: "backup-2026-10-27.tar.gz", size: "12.4 MB", date: "2026-10-27", type: "System backup" },
        { name: "backup-2026-10-20.tar.gz", size: "11.8 MB", date: "2026-10-20", type: "System backup" },
        { name: "backup-2026-10-13.tar.gz", size: "11.2 MB", date: "2026-10-13", type: "System backup" },
      ],
    },
    "Automation": {
      icon: "⚙️",
      files: [
        { name: "irrigation-rules.json", size: "1.1 KB", date: "2026-10-26", type: "Automation rule" },
        { name: "lighting-schedule.json", size: "0.9 KB", date: "2026-10-24", type: "Automation rule" },
        { name: "alert-thresholds.json", size: "0.7 KB", date: "2026-10-23", type: "Configuration" },
      ],
    },
  };

  let currentPath = [];
  let selectedFile = null;

  function init() {
    if (initialized) return;
    initialized = true;
    render();
  }

  function render() {
    const breadcrumb = currentPath.length === 0
      ? `<span class="fm-breadcrumb-item active">Home</span>`
      : `<span class="fm-breadcrumb-item" data-folder="">Home</span>${currentPath.map((f, i) =>
          `<span class="fm-breadcrumb-sep">›</span><span class="fm-breadcrumb-item ${i === currentPath.length - 1 ? "active" : ""}" data-folder="${i === 0 ? f : ""}">${f}</span>`
        ).join("")}`;

    let body = "";

    if (currentPath.length === 0) {
      body = `<div class="fm-folder-grid">`;
      Object.entries(folders).forEach(([name, data]) => {
        body += `<div class="fm-folder-card" data-folder="${name}">
          <span class="fm-folder-icon">${data.icon}</span>
          <div class="fm-folder-info"><strong>${name}</strong><small>${data.files.length} items</small></div>
        </div>`;
      });
      body += `</div>`;
    } else {
      const folderName = currentPath[0];
      const folder = folders[folderName];
      if (!folder) { currentPath = []; render(); return; }

      body = `<div class="fm-file-list">`;
      body += `<div class="fm-file-header"><span></span><span>Name</span><span>Type</span><span>Size</span><span>Modified</span></div>`;
      folder.files.forEach((file) => {
        body += `<div class="fm-file-row ${selectedFile === file.name ? "selected" : ""}" data-file="${file.name}">
          <span class="fm-file-icon">${folder.icon}</span>
          <span class="fm-file-name">${file.name}</span>
          <span class="fm-file-type">${file.type}</span>
          <span class="fm-file-size">${file.size}</span>
          <span class="fm-file-date">${file.date}</span>
        </div>`;
      });
      body += `</div>`;

      if (selectedFile) {
        const file = folder.files.find(f => f.name === selectedFile);
        if (file) {
          body += `<div class="fm-file-preview">
            <h3>${file.name}</h3>
            <div class="fm-preview-meta">
              <span>Type: ${file.type}</span>
              <span>Size: ${file.size}</span>
              <span>Modified: ${file.date}</span>
            </div>
            <p class="muted">Preview not available for this file type. In a real deployment, telemetry data and reports would be viewable here.</p>
          </div>`;
        }
      }
    }

    content.innerHTML = `
      <div class="fm-toolbar">
        <button class="fm-nav-btn" id="fm-back" ${currentPath.length === 0 ? "disabled" : ""}>← Back</button>
        <div class="fm-breadcrumb">${breadcrumb}</div>
      </div>
      ${body}
    `;

    attachHandlers();
  }

  function attachHandlers() {
    document.getElementById("fm-back")?.addEventListener("click", () => {
      currentPath.pop();
      selectedFile = null;
      render();
    });

    content.querySelectorAll("[data-folder]").forEach((el) => {
      el.addEventListener("click", () => {
        const folder = el.dataset.folder;
        if (folder === "") { currentPath = []; }
        else if (folder && !currentPath.includes(folder)) { currentPath = [folder]; }
        selectedFile = null;
        render();
      });
    });

    content.querySelectorAll(".fm-file-row").forEach((row) => {
      row.addEventListener("click", () => {
        selectedFile = row.dataset.file;
        render();
      });
    });
  }

  win.addEventListener("app:opened", init);
});