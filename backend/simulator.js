function getSensorData() {
    return {
        airTemperature: Number((Math.random() * 6 + 24).toFixed(1)),
        humidity: Math.floor(Math.random() * 21 + 70),
        soilTemperature: Number((Math.random() * 5 + 22).toFixed(1)),
        soilMoisture: Math.floor(Math.random() * 26 + 50),
        waterLevel: Math.floor(Math.random() * 26 + 65),
        airQuality: "GOOD"
    };
}

module.exports = getSensorData;