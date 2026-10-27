"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const win = document.getElementById("window-settings");
  if (!win) return;

  const content = win.querySelector(".window-content");
  let initialized = false;

  const root = document.documentElement;

  const wallpaperOptions = {
    "tahoe-dark": "wallpaper-tahoe-dark",
    "tahoe-light": "wallpaper-tahoe-light",
    "goldengate-dark": "wallpaper-goldengate-dark",
    "goldengate-light": "wallpaper-goldengate-light",
  };

  const wallpaperClasses = Object.values(wallpaperOptions);

  function init() {
    if (initialized) return;
    initialized = true;

    let savedTheme = "dark";
    let savedWallpaper = "tahoe-dark";
    let savedAnimations = "on";
    let savedSounds = "off";

    try {
      savedTheme = localStorage.getItem("ecosystem-os-theme") || "dark";
      savedWallpaper = localStorage.getItem("ecosystem-os-wallpaper") || "tahoe-dark";
      savedAnimations = localStorage.getItem("ecosystem-os-animations") || "on";
      savedSounds = localStorage.getItem("ecosystem-os-sounds") || "off";
    } catch {}

    content.innerHTML = `
      <div class="settings-layout">
        <nav class="settings-sidebar">
          <button class="settings-nav-item active" data-section="appearance">Appearance</button>
          <button class="settings-nav-item" data-section="wallpaper">Wallpaper</button>
          <button class="settings-nav-item" data-section="general">General</button>
          <button class="settings-nav-item" data-section="telemetry">Telemetry</button>
          <button class="settings-nav-item" data-section="about">About</button>
        </nav>
        <div class="settings-main">
          <div class="settings-section" data-section="appearance">
            <h2>Appearance</h2>
            <p class="muted">Choose how Ecosystem OS looks.</p>
            <div class="settings-theme-grid">
              <button class="settings-theme-card ${savedTheme === "dark" ? "selected" : ""}" data-theme="dark">
                <div class="theme-preview theme-preview-dark"></div>
                <span>Dark</span>
              </button>
              <button class="settings-theme-card ${savedTheme === "light" ? "selected" : ""}" data-theme="light">
                <div class="theme-preview theme-preview-light"></div>
                <span>Light</span>
              </button>
              <button class="settings-theme-card ${savedTheme === "auto" ? "selected" : ""}" data-theme="auto">
                <div class="theme-preview theme-preview-auto"></div>
                <span>Automatic</span>
              </button>
            </div>
          </div>

          <div class="settings-section" data-section="wallpaper" hidden>
            <h2>Wallpaper</h2>
            <p class="muted">Pick a desktop wallpaper.</p>
            <div class="settings-wallpaper-grid">
              ${Object.entries({
                "tahoe-dark": "Tahoe Dark",
                "tahoe-light": "Tahoe Light",
                "goldengate-dark": "Golden Gate Dark",
                "goldengate-light": "Golden Gate Light",
              }).map(([key, label]) => `
                <button class="settings-wallpaper-card ${savedWallpaper === key ? "selected" : ""}" data-wallpaper="${key}">
                  <div class="wallpaper-thumb ${wallpaperOptions[key]}"></div>
                  <span>${label}</span>
                </button>
              `).join("")}
            </div>
          </div>

          <div class="settings-section" data-section="general" hidden>
            <h2>General</h2>
            <div class="settings-toggle-row">
              <div><strong>Animations</strong><br><small>Enable smooth transitions and effects</small></div>
              <label class="settings-switch"><input type="checkbox" id="settings-animations" ${savedAnimations === "on" ? "checked" : ""}><span class="settings-switch-slider"></span></label>
            </div>
            <div class="settings-toggle-row">
              <div><strong>Interface sounds</strong><br><small>Play sounds for notifications and actions</small></div>
              <label class="settings-switch"><input type="checkbox" id="settings-sounds" ${savedSounds === "on" ? "checked" : ""}><span class="settings-switch-slider"></span></label>
            </div>
          </div>

          <div class="settings-section" data-section="telemetry" hidden>
            <h2>Telemetry</h2>
            <p class="muted">Configure how sensor data is collected.</p>
            <div class="settings-info-card">
              <div class="settings-info-row"><span>Data source</span><strong>Simulated</strong></div>
              <div class="settings-info-row"><span>Update interval</span><strong>3 seconds</strong></div>
              <div class="settings-info-row"><span>Connection status</span><strong style="color:var(--success)">Connected</strong></div>
            </div>
            <button class="primary-button" id="settings-toggle-telemetry">Stop telemetry</button>
          </div>

          <div class="settings-section" data-section="about" hidden>
            <h2>About Ecosystem OS</h2>
            <div class="settings-about-card">
              <img src="src/assets/branding/ecosystem-os.svg" alt="Ecosystem OS" style="width:80px; height:80px;">
              <h3>Ecosystem OS</h3>
              <p>Version 3.0.0 — Initial rebuild</p>
              <p class="muted">An intelligent ecosystem monitoring, automation, and management platform.</p>
              <p class="muted">This is a demonstration interface with simulated telemetry data. Real sensor data requires connecting physical hardware to the backend.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    bindSettings(savedTheme, savedWallpaper);
  }

  function bindSettings(savedTheme, savedWallpaper) {
    content.querySelectorAll(".settings-nav-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const section = btn.dataset.section;
        content.querySelectorAll(".settings-nav-item").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        content.querySelectorAll(".settings-section").forEach(s => s.hidden = s.dataset.section !== section);
      });
    });

    content.querySelectorAll(".settings-theme-card").forEach((card) => {
      card.addEventListener("click", () => {
        const theme = card.dataset.theme;
        const resolved = theme === "auto"
          ? (new Date().getHours() >= 6 && new Date().getHours() < 18 ? "light" : "dark")
          : theme;

        root.dataset.theme = resolved;
        root.style.colorScheme = resolved;
        try { localStorage.setItem("ecosystem-os-theme", theme); } catch {}

        content.querySelectorAll(".settings-theme-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
      });
    });

    content.querySelectorAll(".settings-wallpaper-card").forEach((card) => {
      card.addEventListener("click", () => {
        const wp = card.dataset.wallpaper;
        const wallpaper = document.getElementById("desktop-wallpaper");
        if (wallpaper && wallpaperOptions[wp]) {
          wallpaper.classList.remove(...wallpaperClasses);
          wallpaper.classList.add(wallpaperOptions[wp]);
          try { localStorage.setItem("ecosystem-os-wallpaper", wp); } catch {}
        }
        content.querySelectorAll(".settings-wallpaper-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
      });
    });

    const animationsToggle = document.getElementById("settings-animations");
    animationsToggle?.addEventListener("change", () => {
      const on = animationsToggle.checked;
      root.dataset.animations = on ? "on" : "off";
      try { localStorage.setItem("ecosystem-os-animations", on ? "on" : "off"); } catch {}
    });

    const soundsToggle = document.getElementById("settings-sounds");
    soundsToggle?.addEventListener("change", () => {
      const on = soundsToggle.checked;
      root.dataset.sounds = on ? "on" : "off";
      try { localStorage.setItem("ecosystem-os-sounds", on ? "on" : "off"); } catch {}
    });

    const toggleBtn = document.getElementById("settings-toggle-telemetry");
    toggleBtn?.addEventListener("click", () => {
      if (window.TelemetryStore) {
        if (window.TelemetryStore._running) {
          window.TelemetryStore.stop();
          toggleBtn.textContent = "Start telemetry";
        } else {
          window.TelemetryStore.start();
          toggleBtn.textContent = "Stop telemetry";
        }
      }
    });
  }

  win.addEventListener("app:opened", init);
});