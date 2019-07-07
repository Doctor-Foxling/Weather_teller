function setup() {
  noCanvas();

  const button_1 = document.getElementById("myButton");
  const button_2 = document.getElementById("mySave");
  var recieved_data = {};

  button_1.addEventListener("click", async event => {
    document.getElementById("myCheck").checked = true;

    if ("geolocation" in navigator) {
      console.log("geolocation is available");
      navigator.geolocation.getCurrentPosition(async position => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        const api_url = `/weather/${latitude},${longitude}`;
        const response = await fetch(api_url);

        const json = await response.json();

        recieved_data = json;
        const weather_data = json.weather_data;
        const aq_data = json.aq_data;

        console.log(json);
        document.getElementById("weather_info").style.visibility = "visible";
        document.getElementById(
          "timezone"
        ).innerText = weather_data.timezone.split("/")[1];
        document.getElementById("summary").innerText =
          weather_data.currently.summary;
        document.getElementById("temperature").innerText =
          weather_data.currently.temperature;

        console.log(weather_data);
      });
    } else {
      console.log("geo location ain't available");
    }
  });
  button_2.addEventListener("click", async event => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(recieved_data)
    };

    const response = await fetch("/api", options);
    const data_ = await response.json();
  });
}
