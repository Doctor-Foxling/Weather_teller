var mymap = L.map("mapid").setView([1, 1], 1);
//const marker = L.marker([0, 0]).addTo(mymap);

L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken:
      "pk.eyJ1IjoiZHJmb3hsaW5nIiwiYSI6ImNqeG9uN3lzcTAwZWozbXI4b3F2b2NpYWwifQ.WKH-Tln22_bCvCgFwewJiQ"
  }
).addTo(mymap);

getAll();
async function getAll() {
  const response = await fetch("/api");
  const data = await response.json();

  for (item of data) {
    const weather_data = item.weather_data;
    const aq_data = item.aq_data.results[0];

    const marker = L.marker([item.lat, item.lon]).addTo(mymap);
    const root = document.createElement("div");
    root.className = "logs_root";
    const weather = document.createElement("div");
    weather.textContent = `weather: ${weather_data.currently.summary}`;
    const geo = document.createElement("div");
    geo.textContent = `geo: ${(item.lat, item.lon)}`;
    const date = document.createElement("div");
    const dateString = new Date(item.timestamp).toLocaleString();
    date.textContent = `Date: ${dateString}`;
    const temperature = document.createElement("div");
    temperature.textContent = `temperature: ${
      weather_data.currently.temperature
    }`;
    const no2_amount = document.createElement("div");
    const city = document.createElement("div");
    try {
      no2_amount.textContent = `NO2 in the air is ${
        aq_data.measurements[0].value
      } ${aq_data.measurements[0].unit}`;
      city.textContent = `City: ${aq_data.city}`;
    } catch {
      no2_amount.textContent = "Results Not Found";
      city.textContent = `City: ${weather_data.timezone}`;
    }

    const txt = `The weather in ${weather_data.timezone.split("/")[1]} is ${
      weather_data.currently.summary
    } and the temperature is ${weather_data.currently.temperature}. ${
      no2_amount.textContent
    }`;

    marker.bindPopup(txt);

    root.append(weather, geo, date, temperature, no2_amount, city);
    document.body.append(root);
    console.log(aq_data);
  }
  //   console.log(data);
}
