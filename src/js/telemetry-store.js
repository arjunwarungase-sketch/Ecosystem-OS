"use strict";

/**
 * Shared telemetry store for Ecosystem OS.
 * Generates simulated environmental data and notifies subscribers.
 * In a real deployment, this would be replaced with backend API calls.
 */

(function () {
  const TelemetryStore = {
    _listeners: new Set(),
    _interval: null,
    _running: false,

    state: {
      connected: false,
      simulationMode: true,
      system: {
        cpu: 0,
        memory: 0,
        health: "Unknown",
        uptime: 0,
      },
      telemetry: {
        airTemperature: null,
        airHumidity: null,
        soilTemperature: null,
        soilMoisture: null,
        waterLevel: null,
        airQuality: null,
        lightIntensity: null,
        co2: null,
        ph: null,
      },
      actuators: {
        irrigation: false,
        "grow-lights": false,
        "mist-maker": false,
        fan: false,
        "algae-circulation": false,
      },
      alerts: [],
      lastUpdate: null,
    },

    subscribe(callback) {
      this._listeners.add(callback);
      callback(this.state);
      return () => this._listeners.delete(callback);
    },

    _notify() {
      this._listeners.forEach((cb) => cb(this.state));
    },

    start() {
      if (this._running) return;
      this._running = true;
      this.state.connected = true;
      this._generate();
      this._interval = window.setInterval(() => this._generate(), 3000);
    },

    stop() {
      if (!this._running) return;
      this._running = false;
      this.state.connected = false;
      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }
      this._notify();
    },

    toggleActuator(name) {
      if (!(name in this.state.actuators)) return;
      this.state.actuators[name] = !this.state.actuators[name];

      this.state.alerts.unshift({
        id: Date.now(),
        type: "actuator",
        severity: "info",
        message: `${name} turned ${this.state.actuators[name] ? "ON" : "OFF"}`,
        timestamp: new Date().toISOString(),
      });

      this._notify();
    },

    _generate() {
      const t = this.state.telemetry;
      const now = Date.now();

      t.airTemperature = +(22 + Math.sin(now / 30000) * 2.5 + Math.random() * 0.6).toFixed(1);
      t.airHumidity = Math.round(60 + Math.sin(now / 40000) * 8 + Math.random() * 2);
      t.soilTemperature = +(20 + Math.sin(now / 50000) * 1.5 + Math.random() * 0.4).toFixed(1);
      t.soilMoisture = Math.round(45 + Math.sin(now / 60000) * 10 + Math.random() * 3);
      t.waterLevel = Math.round(70 + Math.sin(now / 70000) * 15 + Math.random() * 2);
      t.airQuality = Math.round(85 + Math.random() * 10);
      t.lightIntensity = Math.round(4500 + Math.sin(now / 35000) * 800 + Math.random() * 100);
      t.co2 = Math.round(420 + Math.sin(now / 45000) * 30 + Math.random() * 10);
      t.ph = +(6.5 + Math.sin(now / 80000) * 0.3 + Math.random() * 0.05).toFixed(2);

      this.state.system.cpu = Math.round(8 + Math.random() * 22);
      this.state.system.memory = Math.round(42 + Math.random() * 18);
      this.state.system.health = this.state.system.cpu > 28 ? "Warning" : "Healthy";
      this.state.system.uptime += 3;

      if (t.soilMoisture < 40 && !this.state.actuators.irrigation) {
        this.state.alerts.unshift({
          id: now,
          type: "sensor",
          severity: "warning",
          message: `Soil moisture low (${t.soilMoisture}%). Consider enabling irrigation.`,
          timestamp: new Date().toISOString(),
        });
      }
      if (t.airHumidity < 50 && !this.state.actuators["mist-maker"]) {
        this.state.alerts.unshift({
          id: now + 1,
          type: "sensor",
          severity: "warning",
          message: `Air humidity low (${t.airHumidity}%). Consider enabling mist maker.`,
          timestamp: new Date().toISOString(),
        });
      }

      this.state.alerts = this.state.alerts.slice(0, 20);
      this.state.lastUpdate = new Date().toISOString();

      this._notify();
    },
  };

  window.TelemetryStore = TelemetryStore;
  TelemetryStore.start();
})();