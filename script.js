/*==========================================
                MOSS OS v2.0
==========================================*/

"use strict";

console.log("🌱 Moss OS Initialized");

/*==========================================
            DOM ELEMENTS
==========================================*/

const menuBtn = document.querySelector(".menu-btn");

const navbar = document.querySelector(".navbar");

const airTemp = document.getElementById("airTemp");

const humidity = document.getElementById("humidity");

const soilMoisture = document.getElementById("soilMoisture");

const waterLevel = document.getElementById("waterLevel");

const airQuality = document.getElementById("airQuality");

const algaeHealth = document.getElementById("algaeHealth");

const sensorChart = document.getElementById("sensorChart");

const lightBtn = document.getElementById("lightBtn");

const fanBtn = document.getElementById("fanBtn");

const mistBtn = document.getElementById("mistBtn");

const pumpBtn = document.getElementById("pumpBtn");

const autoBtn = document.getElementById("autoBtn");

const emergencyBtn = document.getElementById("emergencyBtn");

/*==========================================
            GLOBAL DATA
==========================================*/

const ecosystem = {

    airTemp:24,

    humidity:76,

    soilMoisture:62,

    waterLevel:84,

    airQuality:"Good",

    algaeHealth:"Healthy"

};

const history = {

    temperature:[],

    humidity:[],

    soil:[],

    water:[]

};

/*==========================================
            UTILITIES
==========================================*/

function random(min,max){

    return Math.floor(

        Math.random()*(max-min+1)

    )+min;

}

/*==========================================
        UPDATE DASHBOARD
==========================================*/

function updateDashboard(){

    airTemp.textContent = ecosystem.airTemp + " °C";

    humidity.textContent = ecosystem.humidity + " %";

    soilMoisture.textContent = ecosystem.soilMoisture + " %";

    waterLevel.textContent = ecosystem.waterLevel + " %";

    airQuality.textContent = ecosystem.airQuality;

    algaeHealth.textContent = ecosystem.algaeHealth;

}

/*==========================================
        SENSOR SIMULATION
==========================================*/

function simulateSensors(){

    ecosystem.airTemp=random(22,28);

    ecosystem.humidity=random(70,82);

    ecosystem.soilMoisture=random(58,75);

    ecosystem.waterLevel=random(78,95);

    history.temperature.push(ecosystem.airTemp);

    history.humidity.push(ecosystem.humidity);

    history.soil.push(ecosystem.soilMoisture);

    history.water.push(ecosystem.waterLevel);

    if(history.temperature.length>20){

        history.temperature.shift();

        history.humidity.shift();

        history.soil.shift();

        history.water.shift();

    }

    updateDashboard();

}

/*==========================================
            MOBILE MENU
==========================================*/

menuBtn.addEventListener("click",()=>{

    navbar.classList.toggle("show-menu");

});

/*==========================================
            INITIALIZE
==========================================*/

updateDashboard();

simulateSensors();

setInterval(simulateSensors,3000);

/*==========================================
        CONTROL BUTTON STATES
==========================================*/

const controls = {

    lights: "AUTO",

    fan: "OFF",

    mist: "OFF",

    pump: "OFF",

    auto: "ON"

};

/*==========================================
        UPDATE BUTTONS
==========================================*/

function updateButtons(){

    lightBtn.querySelector("span").textContent = controls.lights;

    fanBtn.querySelector("span").textContent = controls.fan;

    mistBtn.querySelector("span").textContent = controls.mist;

    pumpBtn.querySelector("span").textContent = controls.pump;

    autoBtn.querySelector("span").textContent = controls.auto;

}

/*==========================================
        TOGGLE STATES
==========================================*/

function toggleState(current){

    if(current==="OFF"){

        return "ON";

    }

    return "OFF";

}

fanBtn.addEventListener("click",()=>{

    controls.fan = toggleState(controls.fan);

    updateButtons();

});

mistBtn.addEventListener("click",()=>{

    controls.mist = toggleState(controls.mist);

    updateButtons();

});

pumpBtn.addEventListener("click",()=>{

    controls.pump = toggleState(controls.pump);

    updateButtons();

});

lightBtn.addEventListener("click",()=>{

    if(controls.lights==="AUTO"){

        controls.lights="ON";

    }

    else if(controls.lights==="ON"){

        controls.lights="OFF";

    }

    else{

        controls.lights="AUTO";

    }

    updateButtons();

});