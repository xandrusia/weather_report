const api_url = "http://localhost:8080/";
//chart init
const chartSettings = new Chart(document.getElementById("myChart"));

//
//
//
//
// ----------------------- API CALLS ------------------------ ///////////////////////////////////////
async function getData(place) {
  try {
    let response;
    if (place == null) {
      response = await fetch(api_url + "data/");
    } else {
      response = await fetch(api_url + "data/" + place);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getForecast(place) {
  try {
    let response;
    if (place == null) {
      response = await fetch(api_url + "forecast");
    } else {
      response = await fetch(api_url + "forecast/" + place);
    }
    const forecast = await response.json();
    return forecast;
  } catch (error) {
    console.log(error);
  }
}




//------------------------ Useful Methods -------------- ////////////////////////////////////////////

function getUniquePlaces(data) {
  let uniquePlaces = [];
  data.forEach((element) => {
    if (!uniquePlaces.includes(element.place)) {
      uniquePlaces.push(element.place);
    }
  });

  return uniquePlaces;
}

function getYesterday() {
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.getDate();
}



function updateChart(config) {
  if (config != null) {
    chartSettings.config._config = config;
    chartSettings.update();
  }
}

function onClick() {
  var places = document.getElementById("places");
  var charts = document.getElementById("charts");
  var val = places.value;
  if (places.value == 0) {
    val = null;
  }
  switch (charts.value) {
    case "1":
      hourlyForecast(val);
      break;
    case "2":
      latestMeasurement(val);
      break;
    case "3":
      minTemp(val);
      break;
    case "4":
      maxTemp(val);
      break;
    case "5":
      totalPrecipitation(val);
      break;
    case "6":
      avgWindSpeed(val);
      break;
    default:
      console.log("default");
      hourlyForecast(val);
      break;
  }
}




//------------- ASSIGNMENT REQUIREMENTS --------------------//////////////////////////////////////////
//•	The hourly forecast for the next 24 hours
async function hourlyForecast(place) {
  const forecasts = await getForecast(place);
  let _uniquePlaces = getUniquePlaces(forecasts);
  const _data = { labels: [], datasets: [] };
  _uniquePlaces.forEach((item) => {
    let myChart = forecasts
      .filter(
        (element) =>
          element.place.toLowerCase() == item.toLowerCase() &&
          element.type.toLowerCase() == "temperature"
      )
      .map(forecast);
    const dataset = {
      label: item,
      data: [],
      borderColor: `rgb(255,${Math.floor(Math.random() * 254)}, ${Math.floor(
        Math.random() * 254
      )})`,
    };

    myChart.forEach((element) => {
      if (!_data.labels.includes(element.weatherData.getTime())) {
        _data.labels.push(element.weatherData.getTime());
      }
      dataset.data.push(element.range.getTo());
    });

    _data.datasets.push(dataset);
  });
let newDate=[];
  _data.labels.forEach(element => {
    newDate.push(new Date(element).getUTCHours()+":00")
  });
  _data.labels=newDate;
  const line_config = {
    type: "line",
    data: _data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Line Chart",
        },
      },
    },
  };
  document.getElementById("results").innerHTML = "";
  updateChart(line_config);
}

//•	All data for the latest measurement of each kind
async function latestMeasurement(place) {
  let data = await getData(place);
  const historicData = data.map(HistoricData);
  let output = "";

  let parsedDate = historicData
    .map((element) => new Date(element.weatherData.getTime()))
    .map(Date.parse);

  let max = Math.max(...parsedDate);
  const latestData = historicData.filter(
    (element) => new Date(element.weatherData.getTime()).getTime() === max
  );

  latestData.forEach((element) => {
    let date = new Date(element.weatherData.getTime()).toDateString();

    output += `<div class="col-md-3 card">`;
    output += `<div>Place: ${element.weatherData.getPlace()} <br>
                    Type: ${element.weatherData.getType()} <br>
                    Unit: ${element.weatherData.getUnit()} <br>
                    Value: ${element.getValue()} <br>                                                   
                    Time: ${date}</div> <br>`;
    output += "</div>";
  });
  document.getElementById("results").innerHTML = output;
}

//•	Minimum temperature for the last day
async function minTemp(place) {
  let data = await getData(place);
  let _uniquePlaces = getUniquePlaces(data);
  let output = "";
  let date = new Date(data[1].time).toDateString();
  _uniquePlaces.forEach((item) => {
    let myChart = data
      .filter(
        (element) =>
          element.type.toLowerCase() == "temperature" &&
          element.place.toLowerCase() == item.toLowerCase() &&
          new Date(element.time).getDate() == getYesterday()
      )
      .map(HistoricData);

    let min = Math.min(...myChart.map((item) => item.getValue()));
    let result = myChart.filter((item) => item.getValue() === min);

    output += `<div class="col-md-3 card">`;
    output += `<div>Place: ${item} <br>
                    Min Temperature: ${result[0].getValue()}<br>                                                   
                    Time: ${date}</div> <br>`;
    output += "</div>";
  });
  document.getElementById("results").innerHTML = output;
}

//•	Maximum temperature for the last day
async function maxTemp(place) {
  let data = await getData(place);
  let _uniquePlaces = getUniquePlaces(data);
  let output = "";
  let date = new Date(data[1].time).toDateString();
  _uniquePlaces.forEach((item) => {
    let myList = data
      .filter(
        (element) =>
          element.type == "temperature" &&
          element.place.toLowerCase() == item.toLowerCase() &&
          new Date(element.time).getDate() == getYesterday()
      )
      .map(HistoricData);

    let max = Math.max(...myList.map((item) => item.getValue()));
    let result = myList.filter((item) => item.getValue() === max);

    output += `<div class="col-md-3 card">`;
    output += `<div>Place: ${item} <br>
                    Max Temperature: ${result[0].getValue()}<br>                                                   
                    Time: ${date}</div> <br>`;
    output += "</div>";
  });
  document.getElementById("results").innerHTML = output;
}

//•	Total precipitation for the last day
async function totalPrecipitation(place) {
  const data = await getData(place);
  let output = "";
  let myList = data
    .filter(
      (element) =>
        element.type == "precipitation" &&
        new Date(element.time).getDate() == getYesterday()
    )
    .map(forecast);

  let date = new Date(myList[0].weatherData.getTime()).toDateString();
  myList.forEach((element) => {
    output += `<div class="col-md-2 card">`;
    output += `<div>Place: ${element.weatherData.getPlace()} <br>
                        Value: ${element.getValue()}<br>                                                   
                        Type: ${element.getPrecipitationTypes()}<br>                                                   
                        Time: ${date}</div> <br>`;
    output += "</div>";
  });
  document.getElementById("results").innerHTML = output;
}

//•	Average wind speed for the last day
async function avgWindSpeed(place) {
  const data = await getData(place);
  let _uniquePlaces = getUniquePlaces(data);
  let output = "";
  _uniquePlaces.forEach((element) => {
    let myList = data
      .filter(
        (element) =>
          element.type == "wind speed" &&
          new Date(element.time).getDate() == getYesterday()
      )
      .map(forecast);

    let date = new Date(myList[0].weatherData.getTime()).toDateString();
    const fuck =
      myList.map((element) => element.getValue()).reduce((a, b) => a + b, 0) /
      myList.length;

    output += `<div class="col-md-2 card">`;
    output += `<div>Place: ${element} <br>
                    Value: ${fuck} m/s <br>                                            
                    Time: ${date} </div> <br>`;
    output += "</div>";
  });

  document.getElementById("results").innerHTML = output;
}

//------------------- DOC LOADED METHOD ------------------/////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", async () => {
  hourlyForecast();
  const selectDrop = document.getElementById("places");

  let uniquePlaces = await getUniquePlaces(await getData());
  let output = `<option value="0">Select a City</option>`;
  uniquePlaces.forEach((element, index) => {
    if (uniquePlaces.indexOf(element) == index)
      output += `<option value=${element}>${element}</option>`;
  });
  selectDrop.innerHTML = output;
});

