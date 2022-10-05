function post() {
  let type = document.getElementById("type").value;
  let time = document.getElementById("time").value;
  let place = document.getElementById("place").value;
  let precipitation_type = document.getElementById("precipitationType").value;
  let value = document.getElementById("value").value;
  let unit = document.getElementById("unit").value;
  let body = {
    type: type,
    time: time,
    place: place,
    unit: unit,
    precipitation_type: precipitation_type,
    value: value,
  };
  fetch("http://localhost:8080/data", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => coansole.log(data));
}
