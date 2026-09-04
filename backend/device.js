const deviceState = require("./state");


function isEcosystemDevice(deviceId) {
    const pattern = /^ECOOS_IND-AUSS_ESP32--[A-Z][0-9]{4}$/;

    return pattern.test(deviceId);
}


function connectDevice(deviceId) {
    if (!isEcosystemDevice(deviceId)) {
        return false;
    }

    deviceState.deviceId = deviceId;
    deviceState.connected = true;
    deviceState.source = "hardware";

    return true;
}


module.exports = {
    isEcosystemDevice,
    connectDevice
};