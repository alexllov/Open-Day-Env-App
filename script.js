const apiUrl = "http://10.101.65.129:5000/data";

let data = [];

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const dataArray = await response.json();
    const data = dataArray;
    const lastData = data[data.length - 1];
    const aqi = calcAQI(lastData);
    renderData(lastData, aqi);
    // 1 update every 10s -> 360 updates an hour.
    let numHours = 0.02;
    let num = numHours * 6 * 60;
    if (data.length > num) {
      updateCharts(data.slice(data.length - (num + 1), data.length - 1));
    } else {
      updateCharts(data);
    }
  } catch (error) {
    document.getElementById("lastData").innerText = "Error fetching data.";
    console.error("Fetch error:", error);
  }
}

function calcAQISum(last) {
  var aqi = 0;
  // Particulates
  aqi += 0.75 * last["Ultra Fine Particulates (PM1.0 ug/m3)"];
  aqi += 1 * last["Fine Particulates (PM2.5 ug/m3)"];
  aqi += 0.5 * last["Coarse Particulates (PM10 ug/m3)"];
  // General
  aqi += 0.1 * last["Temperature (°C)"];
  aqi += 0.1 * last["Relative Humidity (%)"];
  // Gases
  aqi += 0.25 * last["Oxidising gases (ppm)"];
  aqi += 0.25 * last["Reducing gases (ppm)"];
  aqi += 0.25 * last["NH3 (ppm)"];
  return aqi;
}

function calcAQI(last) {
  var aqi = [];
  // Particulates
  aqi.push(0.75 * last["Ultra Fine Particulates (PM1.0 ug/m3)"]);
  aqi.push(1 * last["Fine Particulates (PM2.5 ug/m3)"]);
  aqi.push(0.5 * last["Coarse Particulates (PM10 ug/m3)"]);
  // General
  aqi.push(0.1 * last["Temperature (°C)"]);
  aqi.push(0.1 * last["Relative Humidity (%)"]);
  // Gases
  aqi.push(0.25 * last["Oxidising gases (ppm)"]);
  aqi.push(0.25 * last["Reducing gases (ppm)"]);
  aqi.push(0.25 * last["NH3 (ppm)"]);
  let avgAqi = aqi.reduce((a, b) => a + b) / aqi.length;
  return avgAqi;
}

function renderData(last, aqi) {
  let html = `<div class="sideSpread">`;
  html += `<p>AQI: ${aqi.toFixed(2)}</p>`;
  html += `<p>Last Reading Taken: ${last["Time"]}</p>`;
  html += `</div>`;
  document.getElementById("lastData").innerHTML = html;
}

// Fetch every 10 seconds - in line with readings
fetchData();
setInterval(fetchData, 10000);

// "Ultra Fine Particulates (PM1.0 ug/m3)": "2"
// "Fine Particulates (PM2.5 ug/m3)": "4",
// "Coarse Particulates (PM10 ug/m3)": "4",
// "Light intensity (Lux)": "41.03365",
// "NH3 (ppm)": "76866.00161768672",
// "Oxidising gases (ppm)": "23336.714159220803",
// "Pressure (hPa)": "1016.4690698772644",
// "Proximity": "0",
// "Reducing gases (ppm)": "274294.9061662199",
// "Relative Humidity (%)": "34.748570427837834",
// "Temperature (°C)": "23.1227974355337",
// "Time": "13/06/2025 14:54:32",

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
  var dataDict = {
    // temp & humid & light
    "Temperature (°C)": [],
    "Relative Humidity (%)": [],
    "Light intensity (Lux)": [],
    // particulates
    "Coarse Particulates (PM10 ug/m3)": [],
    "Fine Particulates (PM2.5 ug/m3)": [],
    "Ultra Fine Particulates (PM1.0 ug/m3)": [],
    // Extra
    "NH3 (ppm)": [],
    "Oxidising gases (ppm)": [],
    "Reducing gases (ppm)": [],
  };
  data.forEach((e) => {
    times.push(e["Time"]);
    // temp & humid & light
    dataDict["Temperature (°C)"].push(e["Temperature (°C)"]);
    dataDict["Relative Humidity (%)"].push(e["Relative Humidity (%)"]);
    dataDict["Light intensity (Lux)"].push(e["Light intensity (Lux)"]);
    // particulates
    dataDict["Coarse Particulates (PM10 ug/m3)"].push(
      e["Coarse Particulates (PM10 ug/m3)"]
    );
    dataDict["Fine Particulates (PM2.5 ug/m3)"].push(
      e["Fine Particulates (PM2.5 ug/m3)"]
    );
    dataDict["Ultra Fine Particulates (PM1.0 ug/m3)"].push(
      e["Ultra Fine Particulates (PM1.0 ug/m3)"]
    );
    // extras
    dataDict["Oxidising gases (ppm)"].push(e["Oxidising gases (ppm)"]);
    dataDict["Reducing gases (ppm)"].push(e["Reducing gases (ppm)"]);
    dataDict["NH3 (ppm)"].push(e["NH3 (ppm)"]);
  });

  if (tempChart) {
    updateChart(tempChart, times, dataDict["Temperature (°C)"]);
  } else {
    createTempChart(times, dataDict["Temperature (°C)"]);
  }
  if (humidChart) {
    updateChart(humidChart, times, dataDict["Relative Humidity (%)"]);
  } else {
    createHumidChart(times, dataDict["Relative Humidity (%)"]);
  }
  if (lightChart) {
    updateChart(lightChart, times, dataDict["Light intensity (Lux)"]);
  } else {
    createLightChart(times, dataDict["Light intensity (Lux)"]);
  }
  if (coarsePChart) {
    updateChart(
      coarsePChart,
      times,
      dataDict["Coarse Particulates (PM10 ug/m3)"]
    );
  } else {
    createCoarsePChart(times, dataDict["Coarse Particulates (PM10 ug/m3)"]);
  }
  if (finePChart) {
    updateChart(finePChart, times, dataDict["Fine Particulates (PM2.5 ug/m3)"]);
  } else {
    createFinePChart(times, dataDict["Fine Particulates (PM2.5 ug/m3)"]);
  }
  if (ultraFinePChart) {
    updateChart(
      ultraFinePChart,
      times,
      dataDict["Ultra Fine Particulates (PM1.0 ug/m3)"]
    );
  } else {
    createUltraFinePChart(
      times,
      dataDict["Ultra Fine Particulates (PM1.0 ug/m3)"]
    );
  }
  if (oxidisingChart) {
    updateChart(oxidisingChart, times, dataDict["Oxidising gases (ppm)"]);
  } else {
    createOxidisingChart(times, dataDict["Oxidising gases (ppm)"]);
  }
  if (reducingChart) {
    updateChart(reducingChart, times, dataDict["Reducing gases (ppm)"]);
  } else {
    createReducingChart(times, dataDict["Reducing gases (ppm)"]);
  }
  if (nh3Chart) {
    updateChart(nh3Chart, times, dataDict["NH3 (ppm)"]);
  } else {
    createNh3Chart(times, dataDict["NH3 (ppm)"]);
  }
}

function updateChart(chart, times, data) {
  chart.data.labels = times;
  chart.data.datasets[0].data = calculateRollingAverage(data);
  chart.data.datasets[1].data = data;
  chart.update({
    duration: 0,
    lazy: false,
  });
}

function calculateRollingAverage(dataArray) {
  const numericData = dataArray.map((val) => Number(val));
  let interval = 20;
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
function createTempChart(times, data) {
  const ctx = document.getElementById("tempChart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  tempChart = new Chart(ctx, {
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
          data: data,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 133, 0.15)",
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
function createHumidChart(times, data) {
  const ctx = document.getElementById("humidChart").getContext("2d");

  const rollingAvg = calculateRollingAverage(data);

  humidChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Rolling Avg",
          data: rollingAvg,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.4,
          clip: false,
        },
        {
          label: "Relative Humidity (%)",
          data: data,
          borderColor: "rgb(99, 232, 255)",
          backgroundColor: "rgba(99, 206, 255, 0.15)",
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
            text: "Relative Humidity (%)",
          },
          beginAtZero: false,
        },
      },
    },
  });
}

let lightChart;
function createLightChart(times, data) {
  const ctx = document.getElementById("lightChart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  lightChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Rolling Avg",
          data: rollingAvg,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.4,
          clip: false,
        },
        {
          label: "Light intensity (Lux)",
          data: data,
          borderColor: "rgb(233, 244, 80)",
          backgroundColor: "rgba(233, 244, 80, 0.15)",
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
            text: "Light intensity (Lux)",
          },
          beginAtZero: false,
        },
      },
    },
  });
}

let coarsePChart;
function createCoarsePChart(times, data) {
  const ctx = document.getElementById("coarsePartChart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  coarsePChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Rolling Avg",
          data: rollingAvg,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.4,
          clip: false,
        },
        {
          label: "Coarse Particulates (PM10 ug/m3)",
          data: data,
          borderColor: "rgb(80, 244, 154)",
          backgroundColor: "rgba(80, 244, 154, 0.15)",
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
            text: "Coarse Particulates (PM10 ug/m3)",
          },
          beginAtZero: false,
        },
      },
    },
  });
}

let finePChart;
function createFinePChart(times, data) {
  const ctx = document.getElementById("finePartChart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  finePChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Rolling Avg",
          data: rollingAvg,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.4,
          clip: false,
        },
        {
          label: "Fine Particulates (PM2.5 ug/m3)",
          data: data,
          borderColor: "rgb(236, 244, 80)",
          backgroundColor: "rgba(236, 244, 80, 0.15)",
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
            text: "Fine Particulates (PM2.5 ug/m3)",
          },
          beginAtZero: false,
        },
      },
    },
  });
}

let ultraFinePChart;
function createUltraFinePChart(times, data) {
  const ctx = document.getElementById("ultraFinePartChart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  ultraFinePChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Rolling Avg",
          data: rollingAvg,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.4,
          clip: false,
        },
        {
          label: "Ultra Fine Particulates (PM1.0 ug/m3)",
          data: data,
          borderColor: "rgb(91, 80, 244)",
          backgroundColor: "rgba(91, 80, 244, 0.15)",
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
            text: "Ultra Fine Particulates (PM1.0 ug/m3)",
          },
          beginAtZero: false,
        },
      },
    },
  });
}

let oxidisingChart;
function createOxidisingChart(times, data) {
  const ctx = document.getElementById("oxidisingChart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  oxidisingChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Rolling Avg",
          data: rollingAvg,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.4,
          clip: false,
        },
        {
          label: "Oxidising gases (ppm)",
          data: data,
          borderColor: "rgb(80, 244, 154)",
          backgroundColor: "rgba(80, 244, 154, 0.15)",
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
            text: "Oxidising gases (ppm)",
          },
          beginAtZero: false,
        },
      },
    },
  });
}

let reducingChart;
function createReducingChart(times, data) {
  const ctx = document.getElementById("reducingChart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  reducingChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Rolling Avg",
          data: rollingAvg,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.4,
          clip: false,
        },
        {
          label: "Reducing gases (ppm)",
          data: data,
          borderColor: "rgb(244, 80, 241)",
          backgroundColor: "rgba(244, 80, 241, 0.15)",
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
            text: "Reducing gases (ppm)",
          },
          beginAtZero: false,
        },
      },
    },
  });
}

let nh3Chart;
function createNh3Chart(times, data) {
  const ctx = document.getElementById("nh3Chart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  nh3Chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Rolling Avg",
          data: rollingAvg,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.4,
          clip: false,
        },
        {
          label: "NH3 (ppm)",
          data: data,
          borderColor: "rgb(80, 228, 244)",
          backgroundColor: "rgba(80, 228, 244, 0.15)",
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
            text: "NH3 (ppm)",
          },
          beginAtZero: false,
        },
      },
    },
  });
}
