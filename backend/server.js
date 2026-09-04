const express = require("express");
const deviceState = require("./state");
const getSensorData = require("./simulator");

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        system: "Ecosystem OS",
        status: "online"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy"
    });
});

app.get("/device", (req, res) => {
    res.json(deviceState);
});

app.get("/sensors", (req, res) => {
    if (deviceState.source === "simulator") {
        res.json(getSensorData());
        return;
    }

    res.status(503).json({
        error: "Hardware telemetry is not connected"
    });
});

app.listen(PORT, () => {
    console.log(`Ecosystem OS backend running on http://localhost:${PORT}`);
});