"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const win = document.getElementById("window-data-lab");
  if (!win) return;

  let initialized = false;
  let unsubscribe = null;
  const history = { airTemp: [], humidity: [], soilMoisture: [], co2: [] };

  function init() {
    if (initialized) return;
    initialized = true;

    const charts = document.getElementById("data-lab-charts");
    if (!charts) return;

    charts.innerHTML = `
      <div class="datalab-grid">
        <div class="datalab-card">
          <h3>Air Temperature (°C)</h3>
          <canvas id="dl-air-temp" width="340" height="140"></canvas>
        </div>
        <div class="datalab-card">
          <h3>Humidity (%)</h3>
          <canvas id="dl-humidity" width="340" height="140"></canvas>
        </div>
        <div class="datalab-card">
          <h3>Soil Moisture (%)</h3>
          <canvas id="dl-soil-moisture" width="340" height="140"></canvas>
        </div>
        <div class="datalab-card">
          <h3>CO₂ (ppm)</h3>
          <canvas id="dl-co2" width="340" height="140"></canvas>
        </div>
      </div>
    `;

    if (window.TelemetryStore) {
      unsubscribe = window.TelemetryStore.subscribe((state) => update(state));
    }
  }

  function update(state) {
    if (!state || !state.connected) return;
    const t = state.telemetry;

    history.airTemp.push(t.airTemperature);
    history.humidity.push(t.airHumidity);
    history.soilMoisture.push(t.soilMoisture);
    history.co2.push(t.co2);

    Object.values(history).forEach(arr => { if (arr.length > 40) arr.shift(); });

    drawLine("dl-air-temp", history.airTemp, "#6f84ff", 15, 30);
    drawLine("dl-humidity", history.humidity, "#65d6a0", 30, 90);
    drawLine("dl-soil-moisture", history.soilMoisture, "#f3c875", 20, 70);
    drawLine("dl-co2", history.co2, "#ff777f", 380, 480);
  }

  function drawLine(canvasId, data, color, min, max) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || data.length < 2) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.dataset.theme !== "light";
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const y = (h / 3) * i;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const range = max - min;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = (w / (data.length - 1)) * i;
      const y = h - ((val - min) / range) * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = color + "20";
    ctx.fill();
  }

  win.addEventListener("app:opened", init);
});