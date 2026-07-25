Chart.register(window['chartjs-plugin-annotation']);
const historyLength = 20;

let humidityHistory = [];
let airTempHistory = [];
let soilMoistureHistory = [];
let soilTempHistory = [];
let waterLevelHistory = [];
let events = []; 

const humidityCtx =
document.getElementById("humidityChart");

const humidityChart =
new Chart(humidityCtx,{

    type:"line",

    data:{

        labels:[],

        datasets:[

{
    label:"Humidity",
    data:[],
    borderColor:"#3b82f6",
    backgroundColor:"transparent",
    borderWidth:4,
    tension:.45,
    pointRadius:2,
    pointHoverRadius:6,
    fill:false
},

{
    label:"Air Temp",
    data:[],
    borderColor:"#ef4444",
    backgroundColor:"transparent",
    borderWidth:4,
    tension:.45,
    pointRadius:2,
    pointHoverRadius:6,
    fill:false
},

{
    label:"Soil Moisture",
    data:[],
    borderColor:"#22c55e",
    backgroundColor:"transparent",
    borderWidth:4,
    tension:.45,
    pointRadius:2,
    pointHoverRadius:6,
    fill:false
},

{
    label:"Soil Temp",
    data:[],
    borderColor:"#f59e0b",
    backgroundColor:"transparent",
    borderWidth:4,
    tension:.45,
    pointRadius:2,
    pointHoverRadius:6,
    fill:false
},

{
    label:"Water Level",
    data:[],
    borderColor:"#8b5cf6",
    backgroundColor:"transparent",
    borderWidth:4,
    tension:.45,
    pointRadius:2,
    pointHoverRadius:6,
    fill:false
}

]

    },

    options:{

        responsive:true,

        animation:{
                 duration:600,
                 easing:"easeOutQuart"
                  },

        plugins:{

            legend:{

                labels:{

                    color:"white"

                }

            }

        },

        scales:{

            x:{

                ticks:{
                    color:"white"
                },

                grid:{
                    color:"rgba(255,255,255,.08)"
                }

            },

            y:{

                min:0,

                max:100,

                ticks:{
                    color:"white"
                },

                grid:{
                    color:"rgba(255,255,255,.1)"
                }

            }

        }

    }

});

function updateGraph(){

    humidityHistory.push(humidity);
    airTempHistory.push(airTemp);
    soilMoistureHistory.push(soilMoisture);
    soilTempHistory.push(soilTemp);
    waterLevelHistory.push(waterLevel);

    if(humidityHistory.length>historyLength){

    humidityHistory.shift();
    airTempHistory.shift();
    soilMoistureHistory.shift();
    soilTempHistory.shift();
    waterLevelHistory.shift();

}

function addEvent(name){

    events.push({

        index:humidityHistory.length,

        label:name

    });

}

    humidityChart.data.labels =
    humidityHistory.map((_,i)=>i+1);

    humidityChart.data.datasets[0].data = humidityHistory;
    humidityChart.data.datasets[1].data = airTempHistory;
    humidityChart.data.datasets[2].data = soilMoistureHistory;
    humidityChart.data.datasets[3].data = soilTempHistory;
    humidityChart.data.datasets[4].data = waterLevelHistory;

    humidityChart.update();

}