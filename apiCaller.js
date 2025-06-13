const apiUrl = "http://10.101.65.129:5000/data";

let data = [];

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const dataArray = await response.json();
    data = dataArray;
    renderData(data[data.length - 1]);
    // 1 update every 10s -> 360 updates an hour.
    if (data.length > 360) {
      updateCharts(data.slice(data.length - 361, data.length - 1));
    } else {
      updateCharts(data);
    }
  } catch (error) {
    document.getElementById("lastData").innerText = "Error fetching data.";
    console.error("Fetch error:", error);
  }
}

function renderData(last) {
  let html = "<ul>";
  //dataToDisplay.forEach((entry) => { <- add back if displaying more than 1
  html += `<li>
          <strong>Time:</strong> ${last["Time"]} |
          <strong>Temp:</strong> ${last["Temperature (°C)"]} °C |
          <strong>Humidity:</strong> ${last["Relative Humidity (%)"]} %
          </li>`;
  html += "</ul>";

  document.getElementById("lastData").innerHTML = html;
}

// Fetch every 10 seconds - in line with readings
fetchData();
setInterval(fetchData, 10000);

// "Coarse Particulates (PM10 ug/m3)": "4",
// "Fine Particulates (PM2.5 ug/m3)": "4",
// "Light intensity (Lux)": "41.03365",
// "NH3 (Ohms)": "76866.00161768672",
// "Oxidising gases (Ohms)": "23336.714159220803",
// "Pressure (hPa)": "1016.4690698772644",
// "Proximity": "0",
// "Reducing gases (Ohms)": "274294.9061662199",
// "Relative Humidity (%)": "34.748570427837834",
// "Temperature (°C)": "23.1227974355337",
// "Time": "13/06/2025 14:54:32",
// "Ultra Fine Particulates (PM1.0 ug/m3)": "2"

// Handler Func to update all charts
function updateCharts(data) {
  var times = [];
  var temps = [];
  var coarseParts = [];
  var fineParts = [];
  var ultraFineParts = [];
  var light = [];
  var nh3 = [];
  var oxidisingGasses = [];
  var reducingGasses = [];
  var relativeHumidity = [];
  data.forEach((e) => {
    times.push(e["Time"]);
    temps.push(e["Temperature (°C)"]);
    coarseParts.push(e["Coarse Particulates (PM10 ug/m3)"]);
    fineParts.push(e["Fine Particulates (PM2.5 ug/m3)"]);
    ultraFineParts.push(e["Ultra Fine Particulates (PM1.0 ug/m3)"]);
    light.push(e["Light intensity (Lux)"]);
    nh3.push(e["NH3 (Ohms)"]);
    oxidisingGasses.push(e["Oxidising gases (Ohms)"]);
    reducingGasses.push(e["Reducing gases (Ohms)"]);
    relativeHumidity.push(e["Relative Humidity (%)"]);
  });
  updateTempChart(times, temps);
  updateHumidChart(times, relativeHumidity);
}

function calculateRollingAverage(dataArray, interval) {
  const numericData = dataArray.map((val) => Number(val));
  let index = interval - 1;
  const length = dataArray.length + 1;
  let results = [];

  while (index < length && index < length - interval) {
    index = index + 1;
    const intervalSlice = numericData.slice(index - interval, index);
    const sum = intervalSlice.reduce((prev, curr) => prev + curr, 0);
    results.push(sum / interval);
  }
  return results;
}

let tempChart;
function updateTempChart(times, temps) {
  const tempctx = document.getElementById("tempChart").getContext("2d");

  if (tempChart) {
    tempChart.destroy();
  }

  const rollingAvg = calculateRollingAverage(temps, 20);

  tempChart = new Chart(tempctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Rolling Avg",
          data: rollingAvg,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.4,
          clip: false,
        },
        {
          label: "Temperature (°C)",
          data: temps,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: "start",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Time",
          },
        },
        y: {
          title: {
            display: true,
            text: "Temperature (°C)",
          },
          beginAtZero: false,
        },
      },
    },
  });
}

let humidChart;
function updateHumidChart(times, relativeHumidity) {
  const humidctx = document.getElementById("humidChart").getContext("2d");

  if (humidChart) {
    humidChart.destroy();
  }

  humidChart = new Chart(humidctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Relative Humidity (%)",
          data: relativeHumidity,
          borderColor: "rgb(99, 232, 255)",
          backgroundColor: "rgba(99, 206, 255, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Time",
          },
        },
        y: {
          title: {
            display: true,
            text: "Relative Humidity (%)",
          },
          beginAtZero: false,
        },
      },
    },
  });
}
