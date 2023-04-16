import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

import { saveCity } from "../utils/localStorage";

export const WeatherContext = createContext({
  weather: null,
  setWeather: () => null,
  loading: null,
  setLoading: () => null,
  query: null,
  setQuery: () => null,
  greetMsg: null,
  setGreetMsg: () => null,
  searchCity: () => null,
  msg: "Getting Geo Location",
  fetchWeatherCity: () => null,
  fetchWeatherGeo: () => null,
});

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [greetMsg, setGreetMsg] = useState("");
  let msg = "Getting Geo Location";
  const URL = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = "d36f779355b1fb6850ea4e1ab7126a32";

  const fetchWeatherCity = async (query) => {
    setLoading(true);

    const data = await axios
      .get(URL, {
        params: {
          q: query,
          units: "metric",
          APPID: API_KEY,
        },
      })
      .then((res) => {
        // console.log(res.data);
        setLoading(false);
        return res.data;
      })
      .catch((err) => {
        setLoading(false);
        return {};
      });

    return data;
  };

  const fetchWeatherGeo = async (lat, lon) => {
    setLoading(true);

    const { data } = await axios.get(URL, {
      params: {
        lat: lat,
        lon: lon,
        units: "metric",
        APPID: API_KEY,
      },
    });
    setLoading(false);

    return data;
  };

  const searchCity = async (e) => {
    console.log(e);
    if (e.key === "Enter" || e.from === "history" || e.from === "submit") {
      setGreetMsg("Fetching Weather Data");
      const city = e.from === "history" ? e.city : query;
      const data = await fetchWeatherCity(city);

      if (data && Object.keys(data).length > 0) {
        setWeather(data);
        saveCity(city);
        setGreetMsg("Hope it is correct 👍");
        setQuery("");
        // e.target.blur();
      } else {
        setGreetMsg("Sorry, We couldn't find your city 🥴");
        navigator.vibrate([500, 50, 300]);
        setQuery("");
      }
    }
  };

  useEffect(() => {
    const geoOptions = {
      timeout: 5000,
      enableHighAccuracy: true,
    };

    if (!navigator.geolocation) {
      setLoading(false);
    } else {
      navigator.geolocation.getCurrentPosition(
        async function (position) {
          const { latitude, longitude } = position.coords;

          const data = await fetchWeatherGeo(latitude, longitude);

          setWeather(data);
        },
        () => {
          setLoading(false);
          setQuery("");
        },
        geoOptions
      );
    }
  }, []);

  const value = {
    weather,
    setWeather,
    loading,
    setLoading,
    query,
    setQuery,
    greetMsg,
    setGreetMsg,
    searchCity,
    msg,
    fetchWeatherCity,
    fetchWeatherGeo,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};
