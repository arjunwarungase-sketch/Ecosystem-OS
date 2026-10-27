"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const win = document.getElementById("window-telemetrics");
  if (!win) return;

  const content = win.querySelector(".window-content");
  let initialized = false;
  let unsubscribe = null;

  function init() {
    if (initialized) return;
    initialized = true;

    content.innerHTML = `
      <h2>Environmental telemetry</h2>
      <div class="telemetry-banner" id="telemetry-source-banner">Simulated data — no physical sensors connected</div>
      <div class="detail-grid">
        <div class="detail-card telemetry-card">
          <span class="telemetry-icon">🌡️</span>
          <span>Air temperature</span>
          <strong id="detail-air-temperature">-- °C</strong>
          <div class="telemetry-trend" id="trend-air-temp"></div>
        </div>
        <div class="detail-card telemetry-card">
          <span class="telemetry-icon">💧</span>
          <span>Air humidity</span>
          <strong id="detail-air-humidity">--%</strong>
          <div class="telemetry-trend" id="trend-air-humidity"></div>
        </div>
        <div class="detail-card telemetry-card">
          <span class="telemetry-icon">🌱</span>
          <span>Soil temperature</span>
          <strong id="detail-soil-temperature">-- °C</strong>
        </div>
        <div class="detail-card telemetry-card">
          <span class="telemetry-icon">🌾</span>
          <span>Soil moisture</span>
          <strong id="detail-soil-moisture">--%</strong>
          <div class="telemetry-trend" id="trend-soil-moisture"></div>
        </div>
        <div class="detail-card telemetry-card">
          <span class="telemetry-icon">🚰</span>
          <span>Water level</span>
          <strong id="detail-water-level">Unknown</strong>
          <div class="telemetry-trend" id="trend-water-level"></div>
        </div>
        <div class="detail-card telemetry-card">
          <span class="telemetry-icon">🌫️</span>
          <span>Air quality</span>
          <strong id="detail-air-quality">Unknown</strong>
        </div>
        <div class="detail-card telemetry-card">
          <span class="telemetry-icon">💡</span>
          <span>Light intensity</span>
          <strong id="detail-light-intensity">--</strong>
        </div>
        <div class="detail-card telemetry-card">
          <span class="telemetry-icon">🫧</span>
          <span>CO₂</span>
          <strong id="detail-co2">--</strong>
        </div>
        <div class="detail-card telemetry-card">
          <span class="telemetry-icon">⚗️</span>
          <span>Soil pH</span>
          <strong id="detail-ph">--</strong>
        </div>
      </div>
      <div class="telemetry-footer">
        <span class="muted">Last update: <span id="telemetry-last-update">--</span></span>
        <button class="primary-button" id="telemetry-refresh">Refresh now</button>
      </div>
      <p class="muted" style="margin-top:14px;">Telemetry is simulated for demonstration. Real sensor data requires connecting physical hardware to the backend.</p>
    `;

    if (window.TelemetryStore) {
      unsubscribe = window.TelemetryStore.subscribe((state) => update(state));
    }

    document.getElementById("telemetry-refresh")?.addEventListener("click", () => {
      if (window.TelemetryStore && window.TelemetryStore._generate) {
        window.TelemetryStore._generate();
      }
    });
  }

  let prevValues = {};

  function trendIndicator(current, previous, suffix = "") {
    if (previous === undefined || previous === current) return `<span class="trend-stable">→ stable</span>`;
    if (current > previous) return `<span class="trend-up">↑ ${Math.abs(current - previous).toFixed(1)}${suffix}</span>`;
    return `<span class="trend-down">↓ ${Math.abs(current - previous).toFixed(1)}${suffix}</span>`;
  }

  function update(state) {
    if (!state || !state.connected) return;
    const t = state.telemetry;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    set("detail-air-temperature", `${t.airTemperature} °C`);
    set("detail-air-humidity", `${t.airHumidity}%`);
    set("detail-soil-temperature", `${t.soilTemperature} °C`);
    set("detail-soil-moisture", `${t.soilMoisture}%`);
    set("detail-water-level", `${t.waterLevel}%`);
    set("detail-air-quality", `${t.airQuality} AQI`);
    set("detail-light-intensity", `${t.lightIntensity} lux`);
    set("detail-co2", `${t.co2} ppm`);
    set("detail-ph", t.ph);

    const trend = (id, current, previous, suffix) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = trendIndicator(current, previous, suffix);
    };

    trend("trend-air-temp", t.airTemperature, prevValues.airTemperature, "°C");
    trend("trend-air-humidity", t.airHumidity, prevValues.airHumidity, "%");
    trend("trend-soil-moisture", t.soilMoisture, prevValues.soilMoisture, "%");
    trend("trend-water-level", t.waterLevel, prevValues.waterLevel, "%");

    prevValues = { ...t };

    const lastUpdate = document.getElementById("telemetry-last-update");
    if (lastUpdate && state.lastUpdate) {
      lastUpdate.textContent = new Date(state.lastUpdate).toLocaleTimeString();
    }
  }

  win.addEventListener("app:opened", init);
});