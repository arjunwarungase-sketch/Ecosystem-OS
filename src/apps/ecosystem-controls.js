"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const win = document.getElementById("window-ecosystem-controls");
  if (!win) return;

  let initialized = false;
  let unsubscribe = null;

  const actuators = [
    { id: "irrigation", name: "Irrigation / Drippers", desc: "Plant water delivery" },
    { id: "grow-lights", name: "Grow lights", desc: "5 red : 1 blue LED ratio" },
    { id: "mist-maker", name: "Mist maker", desc: "Humidity support" },
    { id: "fan", name: "Fan", desc: "Air circulation" },
    { id: "algae-circulation", name: "Algae circulation", desc: "Separate circulation loop" },
  ];

  function init() {
    if (initialized) return;
    initialized = true;

    const list = document.getElementById("ec-actuator-list");
    if (!list) return;

    list.innerHTML = actuators.map((a) => `
      <div class="actuator-row">
        <div>
          <strong>${a.name}</strong>
          <small>${a.desc}</small>
        </div>
        <button type="button" class="actuator-toggle" data-actuator="${a.id}">
          <span class="actuator-toggle-track"><span class="actuator-toggle-knob"></span></span>
        </button>
      </div>
    `).join("");

    list.querySelectorAll("[data-actuator]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.actuator;
        if (window.TelemetryStore) {
          window.TelemetryStore.toggleActuator(id);
        }
      });
    });

    if (window.TelemetryStore) {
      unsubscribe = window.TelemetryStore.subscribe((state) => update(state));
    }
  }

  function update(state) {
    if (!state || !state.connected) return;

    document.querySelectorAll("[data-actuator]").forEach((btn) => {
      const id = btn.dataset.actuator;
      const isOn = state.actuators[id];
      btn.classList.toggle("is-on", isOn);
      btn.setAttribute("aria-pressed", String(isOn));
    });
  }

  win.addEventListener("app:opened", init);
});