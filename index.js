const express = require("express");
const app = express();
const Datastore = require("nedb");
const fetch = require("node-fetch");
require("dotenv").config();

//console.log(process.env.API_KEY);

app.listen(3000, () => console.log("listening at 3000"));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const database = new Datastore("database.db");
database.loadDatabase();

app.get("/api", (req, res) => {
  console.log("pam");
  database.find({}, (err, data) => {
    if (err) {
      console.log("well shit");
      res.end();
    }
    res.json(data);
  });
});

app.post("/api", (req, res) => {
  console.log(req.body);
  const data = req.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  function myFunction() {
    database.insert(data);
    res.json(data);
  }
  myFunction();
});

app.get("/weather/:latlon", async (req, res) => {
  console.log(req.params);
  const latlon = req.params.latlon.split(",");
  const lat = latlon[0];
  const lon = latlon[1];

  const weather_response = await fetch(
    `https://api.darksky.net/forecast/${process.env.API_KEY}/${lat},${lon}`
  );
  const weather_data = await weather_response.json();

  const timestamp = Date.now();

  const aq_response = await fetch(
    `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`
  );
  const aq_data = await aq_response.json();

  const data = {
    lat,
    lon,
    timestamp,
    weather_data,
    aq_data
  };

  res.json(data);
});
