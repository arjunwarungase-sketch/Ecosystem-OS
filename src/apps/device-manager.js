"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const win = document.getElementById("window-device-manager");
  if (!win) return;

  let initialized = false;
  let unsubscribe = null;

  function init() {
    if (initialized) return;
    initialized = true;

    const list = document.getElementById("device-manager-list");
    if (!list) return;

    list.innerHTML = `
      <div class="device-section">
        <h3>Controller</h3>
        <div class="device-card">
          <div class="device-icon">🔌</div>
          <div class="device-info">
            <strong>ESP32 Main Controller</strong>
            <small>Status: <span style="color:var(--success)">Online (simulated)</span></small>
            <small>Firmware: v1.0.0-dev</small>
          </div>
        </div>
      </div>
      <div class="device-section">
        <h3>Sensors</h3>
        <div class="device-grid">
          <div class="device-card"><div class="device-icon">🌡️</div><div><strong>Air Temp/Humidity</strong><small>DHT22 · Active</small></div></div>
          <div class="device-card"><div class="device-icon">🌱</div><div><strong>Soil Moisture</strong><small>Capacitive · Active</small></div></div>
          <div class="device-card"><div class="device-icon">🚰</div><div><strong>Water Level</strong><small>Ultrasonic · Active</small></div></div>
          <div class="device-card"><div class="device-icon">💡</div><div><strong>Light Sensor</strong><small>BH1750 · Active</small></div></div>
          <div class="device-card"><div class="device-icon">🌫️</div><div><strong>Air Quality</strong><small>MQ-135 · Active</small></div></div>
          <div class="device-card"><div class="device-icon">🫧</div><div><strong>CO₂ Sensor</strong><small>SCD-30 · Active</small></div></div>
          <div class="device-card"><div class="device-icon">⚗️</div><div><strong>pH Probe</strong><small>Analog · Active</small></div></div>
        </div>
      </div>
      <div class="device-section">
        <h3>Actuators</h3>
        <div class="device-grid">
          <div class="device-card"><div class="device-icon">💧</div><div><strong>Water Pump</strong><small>Relay · Idle</small></div></div>
          <div class="device-card"><div class="device-icon">🔆</div><div><strong>Grow Lights</strong><small>MOSFET · Idle</small></div></div>
          <div class="device-card"><div class="device-icon">💨</div><div><strong>Fan</strong><small>Relay · Idle</small></div></div>
          <div class="device-card"><div class="device-icon">🌫️</div><div><strong>Mist Maker</strong><small>Relay · Idle</small></div></div>
          <div class="device-card"><div class="device-icon">🔄</div><div><strong>Algae Circulation</strong><small>Motor · Idle</small></div></div>
        </div>
      </div>
    `;

    if (window.TelemetryStore) {
      unsubscribe = window.TelemetryStore.subscribe((state) => updateActuatorStatus(state));
    }
  }

  function updateActuatorStatus(state) {
    if (!state || !state.connected) return;
    const actuatorMap = {
      "Water Pump": state.actuators.irrigation,
      "Grow Lights": state.actuators["grow-lights"],
      "Fan": state.actuators.fan,
      "Mist Maker": state.actuators["mist-maker"],
      "Algae Circulation": state.actuators["algae-circulation"],
    };

    document.querySelectorAll(".device-grid .device-card strong").forEach((el) => {
      const name = el.textContent;
      if (actuatorMap[name] !== undefined) {
        const small = el.nextElementSibling;
        if (small) small.textContent = small.textContent.split(" · ")[0] + " · " + (actuatorMap[name] ? "Running" : "Idle");
      }
    });
  }

  win.addEventListener("app:opened", init);
});