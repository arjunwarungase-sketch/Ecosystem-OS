"use strict";

//=========================
// SENSOR VALUES
//=========================

let airTemp = 37;
let humidity = 45;
let soilTemp = 76;
let soilMoisture = 81;
let waterLevel = 50;
let airQuality = 20;
let ecosystemHealth = 92;
let health = 100


//=========================
// SYSTEM STATE
//=========================

let mistOn = false;
let mistInterval;
let fanOn = false;
let fanInterval;
let lightOn = false;
let lightInterval;
let dripperOn = false;
let wasStable = false
let autoMode = true;

//=========================
// HTML ELEMENTS
//=========================

const airTempText = document.getElementById("airTemp");
const humidityText = document.getElementById("humidity");
const soilTempText = document.getElementById("soilTemp");
const soilMoistureText = document.getElementById("soilMoisture");
const waterLevelText = document.getElementById("waterLevel");
const ecosystemHealthText = document.getElementById("ecosystemHealth");

const mistBtn = document.getElementById("mistBtn");
const fanBtn = document.getElementById("fanBtn")
const lightBtn = document.getElementById("lightBtn")
const dripperBtn = document.getElementById("dripperBtn")
const aiStatus = document.getElementById("aiStatus");
const aiReason = document.getElementById("aiReason");
const logContainer = document.getElementById("logContainer");
const autoBtn = document.getElementById("autoBtn");

const humidityStatus = document.getElementById("humidityStatus");
const airTempStatus = document.getElementById("airTempStatus");
const soilTempStatus = document.getElementById("soilTempStatus");
const soilMoistureStatus = document.getElementById("soilMoistureStatus");
const waterLevelStatus = document.getElementById("waterLevelStatus");
const ecosystemHealthStatus = document.getElementById("ecosystemHealthStatus");

const IDEAL = {

    humidity: 80,

    airTemp: 22,

    soilTemp: 22,

    soilMoisture: 75,

    waterLevel: 40,

    ecosystemHealth: 90

}

//=========================
// FUNCTIONS
//=========================

//DASHBOARD

function updateDashboard(){

    airTempText.textContent = airTemp.toFixed(1) + "°C";
    humidityText.textContent = humidity.toFixed(1) + "%";
    soilTempText.textContent = soilTemp.toFixed(1) + "°C";
    soilMoistureText.textContent = soilMoisture.toFixed(1) + "%";
    waterLevelText.textContent = waterLevel.toFixed(1) + "%";
    ecosystemHealthText.textContent = ecosystemHealth.toFixed(0) + "%";

}

//Nature

function simulateEnvironment(){

    // Air slowly warms back up
    if(airTemp < 27){
        airTemp += 0.02;
    }

    // Humidity slowly falls
    if(humidity > 40){
        humidity -= 0.05;
    }

    // Soil slowly dries
    if(soilMoisture > 50){
        soilMoisture -= 0.02;
    }

    // Water slowly evaporates
    if(waterLevel > 0){
        waterLevel -= 0.002;
    }

    // Soil slowly follows air temperature

    if(soilTemp < airTemp){

    soilTemp += 0.02;

    }

    else if(soilTemp > airTemp){

    soilTemp -= 0.02;

    }

    if(mistOn){

    humidity += 1.5;

    airTemp -= 0.1; 

    soilMoisture += 0.1;

    soilTemp -= 0.2;

    }

    if(fanOn){

    humidity -= 0.3;

    airTemp -= 0.15;

    soilTemp -= 0.3;

    }

    if(lightOn){

    ecosystemHealth += 0.05;

    airTemp += 0.03;

    }

    if(dripperOn){

    soilMoisture += 0.4;

    waterLevel -= 0.1;

    }

    humidity = Math.max(0, Math.min(100, humidity));

    soilMoisture = Math.max(0, Math.min(100, soilMoisture));

    waterLevel = Math.max(0, Math.min(100, waterLevel));

    ecosystemHealth = Math.max(0, Math.min(100, ecosystemHealth));

}

//Calculate ecosystem health based on environmental factors

function calculateEcosystemHealth(){

    let health = 100;

    if(humidity < 75) health -= 10;

    if(humidity > 85) health -= 10;

    if(humidity < 65) health -= 20;

    if(humidity > 95) health -= 20;


    if(airTemp < 20) health -= 10;

    if(airTemp > 25) health -= 10;

    if(airTemp < 15) health -= 20;

    if(airTemp > 30) health -= 20;


    if(soilMoisture < 70) health -= 15;

    if(soilMoisture > 85) health -= 15;

    if(soilMoisture < 55) health -= 25;


    if(waterLevel < 40) health -= 10;

    if(waterLevel < 20) health -= 20;

    if(waterLevel < 10) health -= 30;

    
    health = Math.max(0, health);

    return health;
}

//MIST

function turnMistOn(){

    mistOn = true;
    mistBtn.textContent = "🌫 Mist ON";
}

function turnMistOff(){

    mistOn = false;
    mistBtn.textContent = "🌫 Mist OFF";

}

//FAN

function turnFanOn(){

    fanOn = true;
    fanBtn.textContent = "🌬 Fan ON";

}

function turnFanOff(){

    fanOn = false;
    fanBtn.textContent = "🌬 Fan OFF";

}

//LIGHTS

function turnLightOn(){

    lightOn = true;
    lightBtn.textContent = "💡 Light ON";

}

function turnLightOff(){

    lightOn = false;
    lightBtn.textContent = "💡 Light OFF";

}

//DRIPPER

function turnDripperOn(){

    dripperOn = true;
    dripperBtn.textContent = "💧 Irrigation ON";

}

function turnDripperOff(){

    dripperOn = false;
    dripperBtn.textContent = "💧 Irrigation OFF";

}

function updateAI(status, reason){

    aiStatus.textContent = status;
    aiReason.textContent = reason;

}

function addLog(message){

    const now = new Date();

    const time =
    now.toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit"
    });

    const entry =
    document.createElement("p");

    entry.textContent =
    time + " • " + message;

    logContainer.prepend(entry);

    if(logContainer.children.length > 10){

        logContainer.removeChild(
            logContainer.lastChild
        );

    }

}
//=========================
// BUTTONS
//=========================

//MIST

mistBtn.addEventListener("click",function(){

    if(!mistOn){

        turnMistOn();

    }
    else{

        turnMistOff();

    }

});

//FAN

fanBtn.addEventListener("click",function(){

    if(!fanOn){

        turnFanOn();

    }
    else{

        turnFanOff();

    }

});

//LIGHTS

lightBtn.addEventListener("click",function(){

    if(!lightOn){

        turnLightOn();

    }
    else{

        turnLightOff();

    }

});

//DRIPPER

dripperBtn.addEventListener("click",function(){

    if(!dripperOn){

        turnDripperOn();

    }
    else{

        turnDripperOff();

    }

});

//AUTO MODE

autoBtn.addEventListener("click", () => {

    autoMode = !autoMode;

    if (autoMode) {

        autoBtn.textContent = "🤖 AUTO MODE";

        autoBtn.classList.remove("manual");

        updateAI(
            "🤖 Automatic Control",
            "AI is controlling the ecosystem."
        );

        addLog("🤖 AUTO MODE Enabled");

    } else {

        autoBtn.textContent = "👤 MANUAL MODE";

        autoBtn.classList.add("manual");

        updateAI(
            "👤 Manual Control",
            "Manual control enabled."
        );

        addLog("👤 MANUAL MODE Enabled");

    }

});

//=========================
// STATUS CARDS
//=========================

//Humidity Status

function updateHumidityStatus(){

    if(
        humidity >= IDEAL.humidity - 5 &&
        humidity <= IDEAL.humidity + 5
    ){

        humidityStatus.textContent = "🟢 PERFECT";
        humidityStatus.className = "status perfect";

    }
    else if(humidity > IDEAL.humidity + 10){

        humidityStatus.textContent = "🔴 TOO HIGH";
        humidityStatus.className = "status critical";

    }
    else if(humidity > IDEAL.humidity + 5){

        humidityStatus.textContent = "🟡 HIGH";
        humidityStatus.className = "status warning";

    }
    else if(humidity >= IDEAL.humidity - 15){

        humidityStatus.textContent = "🟡 LOW";
        humidityStatus.className = "status warning";

    }
    else{

        humidityStatus.textContent = "🔴 CRITICAL";
        humidityStatus.className = "status critical";

    }

}

//Air Temperature Status

function updateAirTempStatus(){

    if(
        airTemp >= IDEAL.airTemp - 2 &&
        airTemp <= IDEAL.airTemp + 2
    ){

        airTempStatus.textContent = "🟢 PERFECT";
        airTempStatus.className = "status perfect";

    }
    else if(airTemp > IDEAL.airTemp + 5){

        airTempStatus.textContent = "🔴 HOT";
        airTempStatus.className = "status critical";

    }
    else if(airTemp > IDEAL.airTemp + 2){

        airTempStatus.textContent = "🟡 WARM";
        airTempStatus.className = "status warning";

    }
    else if(airTemp >= IDEAL.airTemp - 5){

        airTempStatus.textContent = "🟡 COOL";
        airTempStatus.className = "status warning";

    }
    else{

        airTempStatus.textContent = "🔵 COLD";
        airTempStatus.className = "status critical";

    }

}

//Soil Moisture Status

    function updateSoilMoistureStatus(){

    if(
        soilMoisture >= IDEAL.soilMoisture - 5 &&
        soilMoisture <= IDEAL.soilMoisture + 5
    ){

        soilMoistureStatus.textContent = "🟢 PERFECT";
        soilMoistureStatus.className = "status perfect";

    }
    else if(soilMoisture > IDEAL.soilMoisture + 10){

        soilMoistureStatus.textContent = "🔴 WATERLOGGED";
        soilMoistureStatus.className = "status critical";

    }
    else if(soilMoisture > IDEAL.soilMoisture + 5){

        soilMoistureStatus.textContent = "🟡 WET";
        soilMoistureStatus.className = "status warning";

    }
    else if(soilMoisture >= IDEAL.soilMoisture - 15){

        soilMoistureStatus.textContent = "🟡 DRY";
        soilMoistureStatus.className = "status warning";

    }
    else{

        soilMoistureStatus.textContent = "🔴 VERY DRY";
        soilMoistureStatus.className = "status critical";

    }

}

//Soil Temperature Status

function updateSoilTempStatus(){

    if(
        soilTemp >= IDEAL.soilTemp - 2 &&
        soilTemp <= IDEAL.soilTemp + 2
    ){

        soilTempStatus.textContent = "🟢 PERFECT";
        soilTempStatus.className = "status perfect";

    }
    else if(soilTemp > IDEAL.soilTemp + 5){

        soilTempStatus.textContent = "🔴 TOO HOT";
        soilTempStatus.className = "status critical";

    }
    else if(soilTemp > IDEAL.soilTemp + 2){

        soilTempStatus.textContent = "🟡 WARM";
        soilTempStatus.className = "status warning";

    }
    else if(soilTemp >= IDEAL.soilTemp - 5){

        soilTempStatus.textContent = "🟡 COOL";
        soilTempStatus.className = "status warning";

    }
    else{

        soilTempStatus.textContent = "🔵 TOO COLD";
        soilTempStatus.className = "status critical";

    }

}

//Water Level Status

function updateWaterLevelStatus(){

    if(waterLevel >= IDEAL.waterLevel){

        waterLevelStatus.textContent = "🟢 FULL";
        waterLevelStatus.className = "status perfect";

    }
    else if(waterLevel >= IDEAL.waterLevel - 10){

        waterLevelStatus.textContent = "🟡 LOW";
        waterLevelStatus.className = "status warning";

    }
    else if(waterLevel >= IDEAL.waterLevel - 20){

        waterLevelStatus.textContent = "🟠 VERY LOW";
        waterLevelStatus.className = "status warning";

    }
    else{

        waterLevelStatus.textContent = "🔴 REFILL";
        waterLevelStatus.className = "status critical";

    }

}

//Ecosystem Health Status

function updateEcosystemHealthStatus(){

    if(ecosystemHealth >= IDEAL.ecosystemHealth){

        ecosystemHealthStatus.textContent = "🌿 EXCELLENT";
        ecosystemHealthStatus.className = "status perfect";

    }
    else if(ecosystemHealth >= IDEAL.ecosystemHealth - 15){

        ecosystemHealthStatus.textContent = "🟢 HEALTHY";
        ecosystemHealthStatus.className = "status perfect";

    }
    else if(ecosystemHealth >= IDEAL.ecosystemHealth - 30){

        ecosystemHealthStatus.textContent = "🟡 FAIR";
        ecosystemHealthStatus.className = "status warning";

    }
    else if(ecosystemHealth >= IDEAL.ecosystemHealth - 50){

        ecosystemHealthStatus.textContent = "🟠 POOR";
        ecosystemHealthStatus.className = "status warning";

    }
    else{

        ecosystemHealthStatus.textContent = "🔴 CRITICAL";
        ecosystemHealthStatus.className = "status critical";

    }

}

//=========================
// AI
//=========================

function ecosystemAI(){

    if(humidity < IDEAL.humidity - 5 && !mistOn){

    turnMistOn();

    updateAI(
        
        "🌫 Activating Mist",
        "Humidity is below the ideal range."
    
    );

    addLog("🌫 Mist Activated");
    addEvent("🌫 Mist");

    }

    if(humidity > IDEAL.humidity + 10 && mistOn){

    turnMistOff();

    updateAI(
        
        "🟢 Humidity Stable",
        "Mist has been switched off."
    
    );

    addLog("🌫 Mist Deactivated");

    }

    if(airTemp > IDEAL.airTemp + 2 && !fanOn){

    turnFanOn();

    updateAI(
        
        "🌬 Cooling Chamber",
        "Temperature is above ideal."

    )

    addLog("🌬 Fan Activated");
    addEvent("💨 Fan");

    }

    if(airTemp < IDEAL.airTemp - 2 && fanOn){

    turnFanOff();

    updateAI(
        
        "🟢 Temperature Stable",
        "Cooling is no longer required."
    )

    addLog("🌬 Fan Deactivated");
 
    }

    if(soilMoisture < IDEAL.soilMoisture - 10 && !dripperOn){

    turnDripperOn();

    updateAI(
        "💧 Starting Irrigation",
        "Soil moisture is too low."
    );

    addLog("💧 Irrigation Started");
    addEvent("💧 Watering");

    }

    if(soilMoisture > IDEAL.soilMoisture + 10 && dripperOn){

    turnDripperOff();

    updateAI(
        "🟢 Soil Moisture Stable",
        "Irrigation completed"
    );

    addLog("💧 Irrigation Stopped");

    }

    if(waterLevel < IDEAL.waterLevel - 10){

    turnDripperOff();

    turnMistOff();

    updateAI(
        "🚨 Reservoir Low",
        "Please refill the water tank."
    );

    }

    if(!mistOn && !fanOn && !dripperOn){

    updateAI(
        "🟢 Monitoring",
        "All environmental conditions are stable."
    );

    if(!wasStable){

        addLog("🟢 Ecosystem Stable");

        wasStable = true;

    }

}else{

    wasStable = false;

}

// SOIL TEMPERATURE

if(soilTemp > IDEAL.soilTemp + 2 && !fanOn){

    turnFanOn();
    addEvent("💨 Fan");

    updateAI(

        "🌱 Cooling Soil",
        "Soil temperature is above the ideal range."

    );

    addLog("🌱 Soil Cooling Started");

}

if(soilTemp < IDEAL.soilTemp - 2 && fanOn){

    turnFanOff();

    updateAI(

        "🟢 Soil Temperature Stable",
        "Cooling is no longer required."

    );

    addLog("🌱 Soil Cooling Stopped");

}

// LIGHTS

if(ecosystemHealth < IDEAL.ecosystemHealth && !lightOn){

    turnLightOn();

    updateAI(

        "💡 Enabling Grow Lights",
        "Ecosystem health is below the ideal level."

    );

    addLog("💡 Grow Lights Activated");

}

if(ecosystemHealth >= IDEAL.ecosystemHealth && lightOn){

    turnLightOff();

    updateAI(

        "🟢 Lighting Stable",
        "Grow lights are no longer required."

    );

    addLog("💡 Grow Lights Deactivated");

}

}

//---------------------------
//MAIN LOOP
//---------------------------

updateDashboard();

setInterval(function(){

    // Simulate environment
    simulateEnvironment();

    // Calculate AI Ecosystem Health
    ecosystemHealth = calculateEcosystemHealth();

    // Update Status Cards
    updateHumidityStatus();
    updateAirTempStatus();
    updateSoilMoistureStatus();
    updateSoilTempStatus();
    updateWaterLevelStatus();
    updateEcosystemHealthStatus();

    // AI Control
    if(autoMode){

        ecosystemAI();

    }

    // Refresh Dashboard
    updateDashboard();

    updateGraph();

},1000);