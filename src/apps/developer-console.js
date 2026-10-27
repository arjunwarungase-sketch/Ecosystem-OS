"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const win = document.getElementById("window-developer-console");
  if (!win) return;

  let initialized = false;
  let unsubscribe = null;
  const logs = [];

  function init() {
    if (initialized) return;
    initialized = true;

    const output = document.getElementById("console-output");
    if (!output) return;

    output.innerHTML = `
      <div class="dev-console-toolbar">
        <button class="dev-console-btn" id="console-clear">Clear</button>
        <span class="dev-console-count" id="console-count">0 entries</span>
      </div>
      <div class="dev-console-log" id="console-log"></div>
      <div class="dev-console-input-row">
        <span class="dev-console-prompt">&gt;</span>
        <input type="text" id="console-input" class="dev-console-input" placeholder="Enter a command (help, state, telemetry, actuators, alerts)…" autocomplete="off">
      </div>
    `;

    addLog("System initialized. Developer console ready.");
    addLog("Telemetry simulation active. Type 'help' for commands.");

    if (window.TelemetryStore) {
      unsubscribe = window.TelemetryStore.subscribe((state) => {
        if (state.lastUpdate) {
          addLog(`[telemetry] CPU=${state.system.cpu}% MEM=${state.system.memory}% AirT=${state.telemetry.airTemperature}°C Hum=${state.telemetry.airHumidity}%`);
        }
      });
    }

    document.getElementById("console-clear")?.addEventListener("click", () => {
      logs.length = 0;
      renderLog();
    });

    const input = document.getElementById("console-input");
    input?.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const cmd = input.value.trim();
      if (!cmd) return;
      addLog(`> ${cmd}`, "cmd");
      processCommand(cmd);
      input.value = "";
    });
  }

  function addLog(message, type = "info") {
    logs.push({ message, type, time: new Date().toLocaleTimeString() });
    if (logs.length > 100) logs.shift();
    renderLog();
  }

  function renderLog() {
    const logEl = document.getElementById("console-log");
    const countEl = document.getElementById("console-count");
    if (!logEl) return;

    logEl.innerHTML = logs.map((entry) =>
      `<div class="dev-console-entry dev-console-${entry.type}">
        <span class="dev-console-time">${entry.time}</span>
        <span class="dev-console-msg">${entry.message}</span>
      </div>`
    ).join("");

    logEl.scrollTop = logEl.scrollHeight;
    if (countEl) countEl.textContent = `${logs.length} entr${logs.length === 1 ? "y" : "ies"}`;
  }

  function processCommand(cmd) {
    const state = window.TelemetryStore?.state;
    if (!state) { addLog("Telemetry store not available.", "error"); return; }

    if (cmd === "help") {
      addLog("Commands: help, state, telemetry, actuators, alerts, clear", "info");
    } else if (cmd === "state") {
      addLog(`connected=${state.connected} sim=${state.simulationMode} health=${state.system.health} uptime=${state.system.uptime}s`, "info");
    } else if (cmd === "telemetry") {
      const t = state.telemetry;
      addLog(`airT=${t.airTemperature}°C hum=${t.airHumidity}% soilT=${t.soilTemperature}°C soilM=${t.soilMoisture}% water=${t.waterLevel}% AQI=${t.airQuality} CO2=${t.co2}ppm pH=${t.ph}`, "info");
    } else if (cmd === "actuators") {
      Object.entries(state.actuators).forEach(([k, v]) => addLog(`${k}: ${v ? "ON" : "OFF"}`, "info"));
    } else if (cmd === "alerts") {
      if (state.alerts.length === 0) addLog("No alerts.", "info");
      state.alerts.slice(0, 5).forEach(a => addLog(`[${a.severity}] ${a.message}`, a.severity === "warning" ? "warn" : "info"));
    } else if (cmd === "clear") {
      logs.length = 0;
      renderLog();
    } else {
      addLog(`Unknown command: ${cmd}. Type 'help' for available commands.`, "error");
    }
  }

  win.addEventListener("app:opened", init);
});