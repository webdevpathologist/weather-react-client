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
  console.log(req.body);

  console.log(
    `${process.env.WEATHER_API_URL}?q=${city}&APPID=${process.env.WEATHER_API_KEY}&units=metric`
  );

  const apiData = await fetch(
    `${process.env.WEATHER_API_URL}?q=${city}&APPID=${process.env.WEATHER_API_KEY}&units=metric`
  )
    .then((res) => res.data)
    .catch((err) => {});

  if (!apiData) {
    res.status(404).send("problem with open weather api");
  } else {
  }
});

app.listen(3001, () => {
  console.log("server started listening on port 3001");
});
