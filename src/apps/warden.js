"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const wardenWindow = document.getElementById("window-warden");
  if (!wardenWindow) return;

  const chatForm = document.getElementById("warden-chat-form");
  const messageInput = document.getElementById("warden-message");
  const conversation = document.getElementById("warden-conversation");
  const wardenStatus = wardenWindow.querySelector(".warden-status");
  const introP = wardenWindow.querySelector(".app-intro p");

  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    if (introP) {
      introP.textContent = "Connected to telemetry. Ask about your ecosystem sensors, alerts, or automation.";
    }

    const initialMsg = conversation.querySelector(".assistant-message");
    if (initialMsg) {
      initialMsg.textContent = "Telemetry is streaming. I can see your sensor data and system health. What would you like to know?";
    }

    if (wardenStatus) {
      wardenStatus.textContent = "ONLINE";
      wardenStatus.style.color = "#65d6a0";
    }
  }

  function addMessage(message, role) {
    if (!conversation) return;

    const element = document.createElement("p");
    element.className = "conversation-message " + (role === "user" ? "user-message" : "assistant-message");
    element.textContent = message;

    conversation.append(element);
    conversation.scrollTop = conversation.scrollHeight;
  }

  function generateWardenResponse(question) {
    const state = window.TelemetryStore?.state;
    if (!state || !state.connected) {
      return "I'm not currently connected to telemetry. Please wait for the system to come online.";
    }

    const q = question.toLowerCase();
    const t = state.telemetry;

    if (q.includes("temperature") || q.includes("temp")) {
      return `Current air temperature is ${t.airTemperature}°C and soil temperature is ${t.soilTemperature}°C. Both are within the normal range for ecosystem health.`;
    }
    if (q.includes("humidity") || q.includes("moist")) {
      return `Air humidity is at ${t.airHumidity}% and soil moisture is ${t.soilMoisture}%. ${t.soilMoisture < 45 ? "Soil moisture is running low — you may want to enable irrigation." : "Soil moisture levels look good."}`;
    }
    if (q.includes("water")) {
      return `Water reservoir level is at ${t.waterLevel}%. ${t.waterLevel < 50 ? "Water is getting low — consider refilling the reservoir soon." : "Water levels are adequate."}`;
    }
    if (q.includes("air quality") || q.includes("co2") || q.includes("co2")) {
      return `Air quality index is ${t.airQuality} and CO2 is ${t.co2}ppm. ${t.co2 > 450 ? "CO2 is slightly elevated — consider enabling the fan for ventilation." : "Air quality is within healthy parameters."}`;
    }
    if (q.includes("ph")) {
      return `Soil pH is currently ${t.ph}. The ideal range for most plants is 6.0–7.0.`;
    }
    if (q.includes("light")) {
      return `Light intensity is reading ${t.lightIntensity} lux. Grow lights are currently ${state.actuators["grow-lights"] ? "ON" : "OFF"}.`;
    }
    if (q.includes("alert") || q.includes("warning") || q.includes("problem")) {
      if (state.alerts.length === 0) return "No active alerts. All systems are operating within normal parameters.";
      const recent = state.alerts.slice(0, 3).map(a => a.message).join("\n");
      return `There ${state.alerts.length === 1 ? "is 1 active alert" : `are ${state.alerts.length} active alerts`}:\n${recent}`;
    }
    if (q.includes("actuator") || q.includes("device") || q.includes("control")) {
      const active = Object.entries(state.actuators).filter(([, v]) => v).map(([k]) => k);
      return `Actuator status:\n• Irrigation: ${state.actuators.irrigation ? "ON" : "OFF"}\n• Grow lights: ${state.actuators["grow-lights"] ? "ON" : "OFF"}\n• Mist maker: ${state.actuators["mist-maker"] ? "ON" : "OFF"}\n• Fan: ${state.actuators.fan ? "ON" : "OFF"}\n• Algae circulation: ${state.actuators["algae-circulation"] ? "ON" : "OFF"}${active.length ? `\n\nActive: ${active.join(", ")}` : ""}`;
    }
    if (q.includes("system") || q.includes("health") || q.includes("cpu") || q.includes("memory")) {
      return `System health: ${state.system.health}\nCPU usage: ${state.system.cpu}%\nMemory usage: ${state.system.memory}%\nUptime: ${Math.floor(state.system.uptime / 60)}m`;
    }
    if (q.includes("summary") || q.includes("overview") || q.includes("status") || q.includes("how") || q.includes("report")) {
      return `Ecosystem overview:\n• Air: ${t.airTemperature}°C, ${t.airHumidity}% humidity\n• Soil: ${t.soilTemperature}°C, ${t.soilMoisture}% moisture, pH ${t.ph}\n• Water: ${t.waterLevel}%\n• Air quality: ${t.airQuality}, CO2 ${t.co2}ppm\n• System: ${state.system.health} (CPU ${state.system.cpu}%, RAM ${state.system.memory}%)\n${state.alerts.length ? `• ${state.alerts.length} active alert(s)` : "• No alerts"}`;
    }

    return `I can see your ecosystem data. Here's a quick summary:\n• Air: ${t.airTemperature}°C, ${t.airHumidity}% humidity\n• Soil: ${t.soilMoisture}% moisture\n• Water: ${t.waterLevel}%\n• System: ${state.system.health}\n\nTry asking about temperature, humidity, alerts, water levels, or system health.`;
  }

  wardenWindow.addEventListener("app:opened", () => {
    init();
    messageInput?.focus();
  });

  chatForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = messageInput?.value.trim();
    if (!message) return;

    addMessage(message, "user");
    messageInput.value = "";

    setTimeout(() => {
      addMessage(generateWardenResponse(message), "assistant");
    }, 400);
  });
});