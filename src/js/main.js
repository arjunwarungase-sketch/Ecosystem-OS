
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  const root = document.documentElement;

  const wallpaper = $("#desktop-wallpaper");
  const systemClock = $("#system-clock");
  const desktopClock = $("#desktop-clock");
  const desktopDate = $("#desktop-date");

  const toolsButton = $("#tools-button");
  const optionsButton = $("#options-button");
  const toolsMenu = $("#tools-menu");
  const optionsMenu = $("#options-menu");

  const launchpad = $("#launchpad");
  const launchpadSearch = $("#launchpad-search");
  const launchpadGrid = $("#launchpad-grid");
  const closeLaunchpadButton = $("#close-launchpad");

  const universalSearch = $("#warden-search");
  const universalSearchInput = $("#warden-search-input");

  const dockRunningApps = $("#dock-running-apps");

  const themeSetting = $("#theme-setting");
  const wallpaperSetting = $("#wallpaper-setting");
  const animationsSetting = $("#animations-setting");
  const soundsSetting = $("#sounds-setting");

  const wallpaperClasses = [
    "wallpaper-tahoe-dark",
    "wallpaper-tahoe-light",
    "wallpaper-goldengate-dark",
    "wallpaper-goldengate-light"
  ];

  const wallpaperOptions = {
    "tahoe-dark": "wallpaper-tahoe-dark",
    "tahoe-light": "wallpaper-tahoe-light",
    "goldengate-dark": "wallpaper-goldengate-dark",
    "goldengate-light": "wallpaper-goldengate-light"
  };

  const appNames = {
    dashboard: "Dashboard",
    warden: "Warden AI",
    "system-monitor": "System Monitor",
    telemetrics: "Telemetrics",
    "file-manager": "File Manager",
    settings: "Settings",
    "ecosystem-controls": "Ecosystem Controls",
    "device-manager": "Device Manager",
    "automation-studio": "Automation Studio",
    alerts: "Alerts & Incidents",
    "data-lab": "Data Lab",
    "experiment-lab": "Experiment Lab",
    reports: "Reports",
    "backup-recovery": "Backup & Recovery",
    "security-center": "Security Center",
    "developer-console": "Developer Console"
  };

  const windows = new Map();

  let highestZIndex = 100;
  let activeWindow = null;
  let previousFocusedElement = null;

  /* =======================================================
     CLOCK
     ======================================================= */

  function updateClock() {
    const now = new Date();

    const time = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(now);

    const date = new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric"
    }).format(now);

    if (systemClock) systemClock.textContent = time;
    if (desktopClock) desktopClock.textContent = time;
    if (desktopDate) desktopDate.textContent = date;
  }

  updateClock();
  window.setInterval(updateClock, 1000);

  /* =======================================================
     THEME AND WALLPAPER
     ======================================================= */

  function getAutomaticTheme() {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();

    return minutes >= 360 && minutes < 1080 ? "light" : "dark";
  }

  function applyTheme(theme) {
    const resolved = theme === "auto" ? getAutomaticTheme() : theme;

    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;

    try {
      localStorage.setItem("ecosystem-os-theme", theme);
    } catch {
      // Continue without persistence.
    }
  }

  function applyWallpaper(name) {
    if (!wallpaper || !wallpaperOptions[name]) return;

    wallpaper.classList.remove(...wallpaperClasses);
    wallpaper.classList.add(wallpaperOptions[name]);

    try {
      localStorage.setItem("ecosystem-os-wallpaper", name);
    } catch {
      // Wallpaper still works during this session.
    }
  }

  function loadAppearance() {
    let theme = "dark";
    let wallpaperName = "tahoe-dark";

    try {
      theme = localStorage.getItem("ecosystem-os-theme") || "dark";
      wallpaperName =
        localStorage.getItem("ecosystem-os-wallpaper") || "tahoe-dark";
    } catch {
      // Use defaults.
    }

    if (!["dark", "light", "auto"].includes(theme)) {
      theme = "dark";
    }

    if (!wallpaperOptions[wallpaperName]) {
      wallpaperName = "tahoe-dark";
    }

    if (themeSetting) themeSetting.value = theme;
    if (wallpaperSetting) wallpaperSetting.value = wallpaperName;

    applyTheme(theme);
    applyWallpaper(wallpaperName);
  }

  loadAppearance();

  themeSetting?.addEventListener("change", () => {
    applyTheme(themeSetting.value);
  });

  wallpaperSetting?.addEventListener("change", () => {
    applyWallpaper(wallpaperSetting.value);
  });

  window.setInterval(() => {
    if (themeSetting?.value === "auto") applyTheme("auto");
  }, 60_000);

  /* =======================================================
     PREFERENCES
     ======================================================= */

  function applyAnimations(enabled) {
    root.dataset.animations = enabled ? "on" : "off";
  }

  function applySounds(enabled) {
    root.dataset.sounds = enabled ? "on" : "off";
  }

  if (animationsSetting) {
    applyAnimations(animationsSetting.checked);
    animationsSetting.addEventListener("change", () => {
      applyAnimations(animationsSetting.checked);
    });
  }

  if (soundsSetting) {
    applySounds(soundsSetting.checked);
    soundsSetting.addEventListener("change", () => {
      applySounds(soundsSetting.checked);
    });
  }

  /* =======================================================
     MENUS
     ======================================================= */

  function closeMenus() {
    if (toolsMenu) toolsMenu.hidden = true;
    if (optionsMenu) optionsMenu.hidden = true;

    toolsButton?.setAttribute("aria-expanded", "false");
    optionsButton?.setAttribute("aria-expanded", "false");
  }

  function toggleMenu(menu, button) {
    if (!menu) return;

    const open = menu.hidden;
    closeMenus();

    menu.hidden = !open;
    button?.setAttribute("aria-expanded", String(open));
  }

  toolsButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu(toolsMenu, toolsButton);
  });

  optionsButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu(optionsMenu, optionsButton);
  });

  [toolsMenu, optionsMenu].forEach((menu) => {
    menu?.addEventListener("click", (event) => event.stopPropagation());
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(
      "#tools-menu, #options-menu, #tools-button, #options-button"
    )) {
      closeMenus();
    }
  });

  /* =======================================================
     WINDOW MANAGER
     ======================================================= */

  function getWindow(appName) {
    return windows.get(appName) || null;
  }

  function getVisibleWindows() {
    return [...windows.values()].filter(
      (item) => !item.hidden && item.dataset.state !== "minimized"
    );
  }

  function focusWindow(appWindow) {
    if (!appWindow || appWindow.hidden) return;

    if (appWindow.dataset.state === "minimized") {
      appWindow.dataset.state = "normal";
    }

    highestZIndex += 1;
    appWindow.style.zIndex = String(highestZIndex);
    activeWindow = appWindow;

    windows.forEach((item) => {
      item.classList.toggle("is-active", item === appWindow);
    });

    updateDock();
  }

  function openApp(appName) {
    const appWindow = getWindow(appName);

    if (!appWindow) {
      console.warn(`No application window registered for "${appName}".`);
      return;
    }

    closeMenus();
    closeLaunchpad();

    appWindow.hidden = false;

    if (appWindow.dataset.state === "minimized") {
      appWindow.dataset.state = "normal";
    }

    focusWindow(appWindow);

    appWindow.dispatchEvent(
      new CustomEvent("app:opened", { bubbles: true, detail: { app: appName } })
    );
  }

  function closeApp(appName) {
    const appWindow = getWindow(appName);
    if (!appWindow) return;

    appWindow.hidden = true;
    appWindow.dataset.state = "normal";
    appWindow.classList.remove("is-active", "is-maximized");

    clearMaximizedStyles(appWindow);

    if (activeWindow === appWindow) {
      activeWindow = null;
      const next = getVisibleWindows().at(-1);
      if (next) focusWindow(next);
    }

    updateDock();
  }

  function minimizeApp(appName) {
    const appWindow = getWindow(appName);
    if (!appWindow || appWindow.hidden) return;

    appWindow.dataset.state = "minimized";
    appWindow.classList.remove("is-active");

    if (activeWindow === appWindow) {
      activeWindow = null;
      const next = getVisibleWindows().at(-1);
      if (next) focusWindow(next);
    }

    updateDock();
  }

  /*
   * Save the original inline styles exactly once per
   * maximise operation. Do not calculate a restore position
   * from the already-maximised window.
   */

  function rememberWindowPosition(appWindow) {
    const properties = [
      "top",
      "left",
      "right",
      "bottom",
      "width",
      "height",
      "transform"
    ];

    const saved = {};

    for (const property of properties) {
      saved[property] = appWindow.style[property];
    }

    appWindow._restoreStyles = saved;
  }

  function clearMaximizedStyles(appWindow) {
    [
      "top",
      "left",
      "right",
      "bottom",
      "width",
      "height",
      "transform"
    ].forEach((property) => {
      appWindow.style.removeProperty(
        property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
      );
    });
  }

  function restoreWindowPosition(appWindow) {
    const saved = appWindow._restoreStyles;

    clearMaximizedStyles(appWindow);

    if (!saved) {
      appWindow.style.top = appWindow.dataset.defaultTop || "6%";
      appWindow.style.left = appWindow.dataset.defaultLeft || "12%";
      return;
    }

    Object.entries(saved).forEach(([property, value]) => {
      if (value) {
        appWindow.style[property] = value;
      }
    });

    appWindow._restoreStyles = null;
  }

  function maximizeApp(appName) {
    const appWindow = getWindow(appName);
    if (!appWindow || appWindow.hidden) return;

    if (appWindow.dataset.state === "maximized") {
      appWindow.dataset.state = "normal";
      appWindow.classList.remove("is-maximized");

      restoreWindowPosition(appWindow);
    } else {
      rememberWindowPosition(appWindow);

      appWindow.dataset.state = "maximized";
      appWindow.classList.add("is-maximized");

      clearMaximizedStyles(appWindow);
    }

    focusWindow(appWindow);
  }

  function registerWindows() {
    $$(".app-window[data-app]").forEach((appWindow, index) => {
      const appName = appWindow.dataset.app;

      windows.set(appName, appWindow);

      appWindow.hidden = true;
      appWindow.dataset.state = "normal";

      appWindow.dataset.defaultTop = `${6 + (index % 5) * 3}%`;
      appWindow.dataset.defaultLeft = `${12 + (index % 5) * 3}%`;

      appWindow.style.top = appWindow.dataset.defaultTop;
      appWindow.style.left = appWindow.dataset.defaultLeft;

      appWindow.addEventListener("pointerdown", () => {
        focusWindow(appWindow);
      });

      $("[data-close-window]", appWindow)?.addEventListener("click", (event) => {
        event.stopPropagation();
        closeApp(appName);
      });

      $("[data-minimize-window]", appWindow)?.addEventListener("click", (event) => {
        event.stopPropagation();
        minimizeApp(appName);
      });

      $("[data-maximize-window]", appWindow)?.addEventListener("click", (event) => {
        event.stopPropagation();
        maximizeApp(appName);
      });
    });
  }

  registerWindows();

  /* =======================================================
     WINDOW DRAGGING
     ======================================================= */

  $$(".app-window .window-header").forEach((header) => {
    const appWindow = header.closest(".app-window");
    if (!appWindow) return;

    let drag = null;

    header.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      if (event.target.closest(".window-controls")) return;
      if (appWindow.hidden) return;
      if (appWindow.dataset.state === "maximized") return;

      const layer = $("#window-layer");
      if (!layer) return;

      const rect = appWindow.getBoundingClientRect();
      const layerRect = layer.getBoundingClientRect();

      // Convert the current window position into layer coordinates
      // before dragging. This prevents percentage/pixel mixing.
      appWindow.style.left = `${rect.left - layerRect.left}px`;
      appWindow.style.top = `${rect.top - layerRect.top}px`;

      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: rect.left - layerRect.left,
        startTop: rect.top - layerRect.top
      };

      focusWindow(appWindow);

      try {
        header.setPointerCapture(event.pointerId);
      } catch {
        // Dragging can still continue where pointer capture is unavailable.
      }

      event.preventDefault();
    });

    header.addEventListener("pointermove", (event) => {
      if (!drag || event.pointerId !== drag.pointerId) return;

      if (appWindow.dataset.state === "maximized") return;

      const layer = $("#window-layer");
      if (!layer) return;

      const layerRect = layer.getBoundingClientRect();

      const maxLeft = Math.max(0, layerRect.width - appWindow.offsetWidth);
      const maxTop = Math.max(0, layerRect.height - header.offsetHeight);

      const left = Math.min(
        maxLeft,
        Math.max(0, drag.startLeft + event.clientX - drag.startX)
      );

      const top = Math.min(
        maxTop,
        Math.max(0, drag.startTop + event.clientY - drag.startY)
      );

      appWindow.style.left = `${left}px`;
      appWindow.style.top = `${top}px`;
    });

    function stopDragging(event) {
      if (drag && (!event || event.pointerId === drag.pointerId)) {
        drag = null;
      }
    }

    header.addEventListener("pointerup", stopDragging);
    header.addEventListener("pointercancel", stopDragging);
    header.addEventListener("lostpointercapture", stopDragging);

    header.addEventListener("dblclick", (event) => {
      if (event.target.closest(".window-controls")) return;
      maximizeApp(appWindow.dataset.app);
    });
  });

  /* =======================================================
     DOCK
     ======================================================= */

  function updateDock() {
    $$(".dock-app[data-open-app]").forEach((button) => {
      const appName = button.dataset.openApp;
      const appWindow = getWindow(appName);
      const running = Boolean(appWindow && !appWindow.hidden);

      button.classList.toggle("is-running", running);
      button.setAttribute(
        "aria-label",
        `${appNames[appName] || appName}${running ? ", running" : ""}`
      );
    });

    if (!dockRunningApps) return;

    dockRunningApps.replaceChildren();

    const pinned = new Set(
      $$(".dock-app[data-open-app]").map((button) => button.dataset.openApp)
    );

    windows.forEach((appWindow, appName) => {
      if (appWindow.hidden || pinned.has(appName)) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "dock-app is-running";
      button.title = appNames[appName] || appName;
      button.setAttribute("aria-label", `Restore ${button.title}`);

      const source = $(".window-title img", appWindow)?.getAttribute("src");

      if (source) {
        const image = document.createElement("img");
        image.src = source;
        image.alt = "";
        button.append(image);
      }

      button.addEventListener("click", () => {
        openApp(appName);
      });

      dockRunningApps.append(button);
    });
  }

  /* =======================================================
     LAUNCHPAD
     ======================================================= */

  function openLaunchpad() {
    if (!launchpad) return;

    closeMenus();

    previousFocusedElement = document.activeElement;
    launchpad.hidden = false;

    if (launchpadSearch) {
      launchpadSearch.value = "";
      filterLaunchpad("");
      launchpadSearch.focus();
    }
  }

  function closeLaunchpad() {
    if (!launchpad) return;

    launchpad.hidden = true;

    if (previousFocusedElement?.focus) {
      previousFocusedElement.focus({ preventScroll: true });
    }

    previousFocusedElement = null;
  }

  function filterLaunchpad(query) {
    if (!launchpadGrid) return;

    const normalized = query.trim().toLowerCase();

    $$(".launchpad-app", launchpadGrid).forEach((button) => {
      button.hidden = !button.textContent.toLowerCase().includes(normalized);
    });
  }

  $$("[data-open-launchpad]").forEach((button) => {
    button.addEventListener("click", openLaunchpad);
  });

  closeLaunchpadButton?.addEventListener("click", closeLaunchpad);

  launchpadSearch?.addEventListener("input", () => {
    filterLaunchpad(launchpadSearch.value);
  });

  launchpadSearch?.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown") return;

    $$(".launchpad-app", launchpadGrid || document)
      .find((button) => !button.hidden)
      ?.focus();
  });

  /* =======================================================
     APP LAUNCHING
     ======================================================= */

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-app]");
    if (!button) return;

    openApp(button.dataset.openApp);
  });

  /* =======================================================
     UNIVERSAL SEARCH
     ======================================================= */

  universalSearch?.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = universalSearchInput?.value.trim() || "";

    openApp("warden");

    const messageInput = $("#warden-message");

    if (messageInput) {
      messageInput.value = query;
      messageInput.focus();
    }
  });

  /* =======================================================
     DESKTOP WIDGET TELEMETRY
     ======================================================= */

  function updateDesktopWidgets(state) {
    if (!state || !state.connected) return;

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setText("cpu-usage", `${state.system.cpu}%`);
    setText("memory-usage", `${state.system.memory}%`);
    setText("air-temperature", `${state.telemetry.airTemperature} °C`);
    setText("air-humidity", `${state.telemetry.airHumidity}%`);
    setText("soil-moisture", `${state.telemetry.soilMoisture}%`);

    const health = $("#system-health");
    if (health) health.textContent = state.system.health;

    const statusDot = $("#system-status-dot");
    if (statusDot) {
      statusDot.classList.remove("is-online", "is-warning");
      if (state.system.health === "Healthy") statusDot.classList.add("is-online");
      else if (state.system.health === "Warning") statusDot.classList.add("is-warning");
    }

    const wardenSummary = $("#warden-summary");
    if (wardenSummary) {
      wardenSummary.textContent = state.alerts.length > 0
        ? `${state.alerts.length} alert(s). Latest: ${state.alerts[0].message}`
        : "All systems nominal. Telemetry streaming.";
    }

    document.querySelectorAll("#widget-controls .control-indicator").forEach((el, i) => {
      const actuators = state.actuators;
      const keys = Object.keys(actuators);
      if (keys[i]) {
        el.style.background = actuators[keys[i]] ? "var(--success)" : "#8c92a3";
      }
    });
  }

  if (window.TelemetryStore) {
    window.TelemetryStore.subscribe((state) => updateDesktopWidgets(state));
  }

  /* =======================================================
     GLOBAL KEYBOARD SHORTCUTS
     ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (launchpad && !launchpad.hidden) {
        closeLaunchpad();
      }

      closeMenus();
      return;
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "k"
    ) {
      event.preventDefault();
      universalSearchInput?.focus();
      universalSearchInput?.select();
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      event.key.toLowerCase() === "l"
    ) {
      event.preventDefault();

      if (launchpad && !launchpad.hidden) {
        closeLaunchpad();
      } else {
        openLaunchpad();
      }
    }
  });

  /* =======================================================
     INITIALISE
     ======================================================= */

  closeMenus();
  closeLaunchpad();
  updateDock();

  console.info("Ecosystem OS initialised.");
});
