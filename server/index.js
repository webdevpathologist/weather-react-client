import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

app.post("/weather", async (req, res) => {
  const city = req.body.name;

  const apiData = await fetch(
    `${process.env.WEATHER_URL}?q=${city}&APPID=${process.env.WEATHER_KEY}&units=metric`
  )
    .then((res) => res.json())
    .catch((err) => {});

  if (!apiData) {
    res.status(404).send("problem with open weather api");
  } else {
    let weatherData = {};

    // city, country name, temp, image, description, feels like

    weatherData["city"] = apiData && apiData?.name;
    weatherData["countrycode"] = apiData && apiData?.sys?.country;
    weatherData["temp"] = apiData && apiData?.main?.temp;
    weatherData["wtrimage"] = apiData && apiData?.weather[0]?.icon;
    weatherData["wtrdesc"] = apiData && apiData?.weather[0]?.description;
    weatherData["feelslike"] = apiData && apiData?.main?.feels_like;

    res.status(200).send(weatherData);
  }
});

app.post("/unsplash", async (req, res) => {
  const city = req.body.name;

  const apiData = await fetch(
    `${process.env.UNSPLASH_URL}?query=${city}&orientation=landscape&client_id=${process.env.UNSPLASH_KEY}`
  )
    .then((res) => res.json())
    .catch((err) => {});

  if (!apiData) {
    let errorObject = {
      msg:"problem with unsplash api",
      url:"https://www.bing.com/th?id=OHR.MidsummerEve_EN-IN5378541716_1920x1080.jpg&rf=LaDigue_1920x1080.jpg"
    }
    res.status(404).send(errorObject);
  } else {
    let unsplashData = {};
    unsplashData['url'] = apiData && apiData?.urls?.regular;

    res.status(200).send(unsplashData);
  }
});

app.listen(3001, () => {
  console.log("server started listening on port 3001");
});
