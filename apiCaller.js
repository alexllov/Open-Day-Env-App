const apiUrl = "http://10.101.65.129:5000/data";

let data = [];

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const dataArray = await response.json();
    data = dataArray;
    renderData(data[data.length - 1]);
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
