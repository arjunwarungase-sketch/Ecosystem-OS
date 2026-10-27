"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const win = document.getElementById("window-automation-studio");
  if (!win) return;

  let initialized = false;

  const defaultRules = [
    { id: 1, name: "Auto-irrigate on low soil moisture", enabled: true, trigger: "Soil moisture < 40%", action: "Turn ON irrigation", cooldown: "5 min" },
    { id: 2, name: "Mist on low humidity", enabled: true, trigger: "Air humidity < 50%", action: "Turn ON mist maker", cooldown: "10 min" },
    { id: 3, name: "Ventilate on high CO₂", enabled: false, trigger: "CO₂ > 450 ppm", action: "Turn ON fan", cooldown: "3 min" },
    { id: 4, name: "Night grow light cycle", enabled: true, trigger: "Time: 18:00–06:00", action: "Turn ON grow lights", cooldown: "None" },
  ];

  let rules = [...defaultRules];

  function init() {
    if (initialized) return;
    initialized = true;
    render();
  }

  function render() {
    const list = document.getElementById("automation-rules-list");
    if (!list) return;

    if (rules.length === 0) {
      list.innerHTML = `<p class="muted">No automation rules configured.</p>`;
      return;
    }

    list.innerHTML = rules.map((rule) => `
      <div class="automation-rule ${rule.enabled ? "enabled" : ""}">
        <div class="automation-rule-info">
          <strong>${rule.name}</strong>
          <div class="automation-rule-meta">
            <span>Trigger: ${rule.trigger}</span>
            <span>Action: ${rule.action}</span>
            <span>Cooldown: ${rule.cooldown}</span>
          </div>
        </div>
        <button type="button" class="actuator-toggle ${rule.enabled ? "is-on" : ""}" data-rule-id="${rule.id}">
          <span class="actuator-toggle-track"><span class="actuator-toggle-knob"></span></span>
        </button>
        <button type="button" class="automation-delete" data-rule-delete="${rule.id}">Delete</button>
      </div>
    `).join("");

    list.querySelectorAll("[data-rule-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.ruleId);
        const rule = rules.find(r => r.id === id);
        if (rule) {
          rule.enabled = !rule.enabled;
          render();
        }
      });
    });

    list.querySelectorAll("[data-rule-delete]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.ruleDelete);
        rules = rules.filter(r => r.id !== id);
        render();
      });
    });
  }

  win.addEventListener("app:opened", init);

  document.getElementById("automation-add-btn")?.addEventListener("click", () => {
    const newId = Math.max(0, ...rules.map(r => r.id)) + 1;
    rules.push({
      id: newId,
      name: `New rule ${newId}`,
      enabled: false,
      trigger: "Configure trigger",
      action: "Configure action",
      cooldown: "5 min",
    });
    render();
  });
});