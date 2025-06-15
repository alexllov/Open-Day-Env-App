const input = 0.08;
const hours = 60 * 60 * input;
const initUrl = `http://10.101.65.129:5000/data?length=${hours}`;
const updateUrl = `http://10.101.65.129:5000/last`;

let data = [];

async function fetchData() {
  try {
    const response = await fetch(initUrl);
    const dataArray = await response.json();
    const data = dataArray;
    const lastData = data[data.length - 1];
    const aqi = calcAQI(lastData);
    renderData(lastData, aqi);
    // 1 update every 10s -> 360 updates an hour.
    //let numHours = 0.16;
    //let num = numHours * 6 * 60;
    //if (data.length > num) {
    //  updateCharts(data.slice(data.length - (num + 1), data.length - 1));
    //} else {
    //  updateCharts(data);
    //}
    updateCharts(data);
  } catch (error) {
    document.getElementById("lastData").innerText = "Error fetching data.";
    console.error("Fetch error:", error);
  }
}

async function fetchUpdateData() {
  try {
    const response = await fetch(updateUrl);
    const dataArray = await response.json();
    const data = dataArray;
    const lastData = data[data.length];
    const aqi = calcAQI(data);
    renderData(data, aqi);
    updateCharts([data]);
  } catch (error) {
    document.getElementById("lastData").innerText = "Error fetching data.";
    console.error("Fetch error:", error);
  }
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
  //html += `<div>`;
  //html += `<label for="slider">Data Range (hours)</label>`;
  //html += `<input id="slider" type="range" min="0.01" max="10">`;
  //html += `</div>`;
  html += `<p class="lastReading">Last Reading Taken: ${last["Time"]}</p>`;
  html += `</div>`;
  document.getElementById("lastData").innerHTML = html;

  let details = `<summary>Reading Data</summary>`;
  details += `<p>Temperature: ${Number(last["Temperature (°C)"]).toPrecision(
    3
  )}</p>`;
  details += `<p>Humidity: ${Number(last["Relative Humidity (%)"]).toPrecision(
    3
  )}</p>`;

  details += `<p>Coarse Particulates: ${Number(
    last["Coarse Particulates (PM10 ug/m3)"]
  ).toPrecision(3)}</p>`;
  details += `<p>Fine Particulates: ${Number(
    last["Fine Particulates (PM2.5 ug/m3)"]
  ).toPrecision(3)}</p>`;
  details += `<p>Ultra-fine Particulates: ${Number(
    last["Ultra Fine Particulates (PM1.0 ug/m3)"]
  ).toPrecision(3)}</p>`;

  details += `<p>Oxidising Gases: ${Number(
    last["Oxidising gases (ppm)"]
  ).toPrecision(3)}</p>`;
  details += `<p>Reducing Gases: ${Number(
    last["Reducing gases (ppm)"]
  ).toPrecision(3)}</p>`;
  details += `<p>NH3: ${Number(last["NH3 (ppm)"]).toPrecision(3)}</p>`;
  document.getElementById("details").innerHTML = details;
}

// Fetch every 10 seconds - in line with readings
// 1000 = 1s
fetchData();
setInterval(fetchData, 1000);

// "Temperature (°C)": "23.1227974355337",
// "Relative Humidity (%)": "34.748570427837834",
// "Light intensity (Lux)": "41.03365",

// "Coarse Particulates (PM10 ug/m3)": "4",
// "Fine Particulates (PM2.5 ug/m3)": "4",
// "Ultra Fine Particulates (PM1.0 ug/m3)": "2"

// "Oxidising gases (ppm)": "23336.714159220803",
// "Reducing gases (ppm)": "274294.9061662199",
// "NH3 (ppm)": "76866.00161768672",

// "Proximity": "0",
// "Pressure (hPa)": "1016.4690698772644",
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

  // CUT TIMES DOWN FOR NICE DISPLAY
  times = times.map((t) => t.split(" ")[1]);

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

// True Update w/ single fresh info.
function appendChart(chart, times, data) {
  chart.data.labels.push(...times);
  chart.data.datasets[1].data.push(...data);
  chart.data.datasets[0].data = calculateRollingAverage(
    chart.data.datasets[1].data
  );
  chart.update({ duration: 0, lazy: false });
}

// Full update (works more consistently although worse for performance [not noticable])
function updateChart(chart, times, data) {
  chart.data.labels = times;
  chart.data.datasets[1].data = data;
  chart.data.datasets[0].data = calculateRollingAverage(data);
  chart.update("none");
}

function calculateRollingAverage(dataArray) {
  const numericData = dataArray.map((val) => Number(val));
  let interval = 50;
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

function createChart(ctx, times, data, dataColor, dataBg, avg, avgColor, text) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Rolling Avg",
          data: avg,
          borderColor: avgColor,
          backgroundColor: "transparent",
          fill: false,
          tension: 0.4,
          clip: false,
        },
        {
          label: text,
          data: data,
          borderColor: dataColor,
          backgroundColor: dataBg,
          fill: "start",
          tension: 0.4,
        },
      ],
    },
    options: {
      elements: { point: { radius: 0, hitRadius: 10 } },
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
            text: text,
          },
          beginAtZero: false,
        },
      },
    },
  });
}

let tempChart;
function createTempChart(times, data) {
  const ctx = document.getElementById("tempChart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  tempChart = createChart(
    ctx,
    times,
    data,
    "rgba(255, 99, 132, 1)",
    "rgba(255, 99, 132, 0.15)",
    rollingAvg,
    "rgba(54, 162, 235, 1)",
    "Temperature (°C)"
  );
}

let humidChart;
function createHumidChart(times, data) {
  const ctx = document.getElementById("humidChart").getContext("2d");

  const rollingAvg = calculateRollingAverage(data);

  humidChart = createChart(
    ctx,
    times,
    data,
    "rgb(99, 232, 255)",
    "rgba(99, 232, 255, 0.15)",
    rollingAvg,
    "rgba(255, 99, 132, 1)",
    "Relative Humidity (%)"
  );
}

let lightChart;
function createLightChart(times, data) {
  const ctx = document.getElementById("lightChart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  lightChart = createChart(
    ctx,
    times,
    data,
    "rgb(233, 244, 80)",
    "rgba(233, 244, 80, 0.15)",
    rollingAvg,
    "rgba(255, 99, 132, 1)",
    "Light intensity (Lux)"
  );
}

let coarsePChart;
function createCoarsePChart(times, data) {
  const ctx = document.getElementById("coarsePartChart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  coarsePChart = createChart(
    ctx,
    times,
    data,
    "rgb(80, 244, 154)",
    "rgba(80, 244, 154, 0.15)",
    rollingAvg,
    "rgba(255, 99, 132, 1)",
    "Coarse Particulates (PM10 ug/m3)"
  );
}

let finePChart;
function createFinePChart(times, data) {
  const ctx = document.getElementById("finePartChart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  finePChart = createChart(
    ctx,
    times,
    data,
    "rgb(236, 244, 80)",
    "rgba(236, 244, 80, 0.15)",
    rollingAvg,
    "rgba(255, 99, 132, 1)",
    "Fine Particulates (PM2.5 ug/m3)"
  );
}

let ultraFinePChart;
function createUltraFinePChart(times, data) {
  const ctx = document.getElementById("ultraFinePartChart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  ultraFinePChart = createChart(
    ctx,
    times,
    data,
    "rgb(91, 80, 244)",
    "rgba(91, 80, 244, 0.15)",
    rollingAvg,
    "rgba(255, 99, 132, 1)",
    "Ultra Fine Particulates (PM1.0 ug/m3)"
  );
}

let oxidisingChart;
function createOxidisingChart(times, data) {
  const ctx = document.getElementById("oxidisingChart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  oxidisingChart = createChart(
    ctx,
    times,
    data,
    "rgb(80, 244, 154)",
    "rgba(80, 244, 154, 0.15)",
    rollingAvg,
    "rgba(255, 99, 132, 1)",
    "Oxidising gases (ppm)"
  );
}

let reducingChart;
function createReducingChart(times, data) {
  const ctx = document.getElementById("reducingChart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  reducingChart = createChart(
    ctx,
    times,
    data,
    "rgb(244, 80, 241)",
    "rgba(244, 80, 241, 0.15)",
    rollingAvg,
    "rgba(255, 99, 132, 1)",
    "Reducing gases (ppm)"
  );
}

let nh3Chart;
function createNh3Chart(times, data) {
  const ctx = document.getElementById("nh3Chart").getContext("2d");
  const rollingAvg = calculateRollingAverage(data);

  nh3Chart = createChart(
    ctx,
    times,
    data,
    "rgb(80, 228, 244)",
    "rgba(80, 228, 244, 0.15)",
    rollingAvg,
    "rgba(255, 99, 132, 1)",
    "NH3 (ppm)"
  );
}
