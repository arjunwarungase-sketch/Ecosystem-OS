"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const win = document.getElementById("window-backup-recovery");
  if (!win) return;

  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    renderList();
  }

  function renderList() {
    const list = document.getElementById("backup-list");
    if (!list) return;

    const backups = [
      { name: "backup-2026-10-27.tar.gz", size: "12.4 MB", date: "2026-10-27 03:00", status: "Complete" },
      { name: "backup-2026-10-20.tar.gz", size: "11.8 MB", date: "2026-10-20 03:00", status: "Complete" },
      { name: "backup-2026-10-13.tar.gz", size: "11.2 MB", date: "2026-10-13 03:00", status: "Complete" },
    ];

    list.innerHTML = backups.map((b) => `
      <div class="backup-card">
        <span class="backup-icon">💾</span>
        <div class="backup-info">
          <strong>${b.name}</strong>
          <small>${b.size} · ${b.date} · ${b.status}</small>
        </div>
        <button class="backup-restore-btn">Restore</button>
      </div>
    `).join("") + `<p class="muted" style="margin-top:12px;">Backups run automatically every Sunday at 03:00.</p>`;
  }

  win.addEventListener("app:opened", init);

  document.getElementById("backup-create-btn")?.addEventListener("click", () => {
    const list = document.getElementById("backup-list");
    if (!list) return;
    const now = new Date().toISOString().split("T")[0];
    const card = document.createElement("div");
    card.className = "backup-card backup-creating";
    card.innerHTML = `
      <span class="backup-icon">⏳</span>
      <div class="backup-info">
        <strong>backup-${now}.tar.gz</strong>
        <small>Creating...</small>
      </div>
    `;
    list.prepend(card);
    setTimeout(() => {
      card.classList.remove("backup-creating");
      card.querySelector(".backup-icon").textContent = "💾";
      card.querySelector("small").textContent = `12.0 MB · ${now} 03:00 · Complete`;
      const btn = document.createElement("button");
      btn.className = "backup-restore-btn";
      btn.textContent = "Restore";
      card.append(btn);
    }, 2000);
  });
});