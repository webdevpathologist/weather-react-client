import React, { useContext, useState, useEffect } from "react";
import {BiMicrophone} from 'react-icons/bi';
import {VscSearch} from 'react-icons/vsc';

import { WeatherContext } from "../contexts/WeatherContext";
import { UnsplashContext } from "../contexts/UnsplashContext";
import { ThemeContext } from "../contexts/ThemeContext";
import Loader from "./Loader";
import { clearCities, getCities } from "../utils/localStorage";

export default function WeatherCardGeo(props) {
  const {
    weather,
    query,
    setQuery,
    greetMsg,
    searchCity,
    loading,
    setGreetMsg,
    units,
    changeUnits,
  } = useContext(WeatherContext);

  const [country, setCountry] = useState("IN");
  const [cities, setCities] = useState([]);

  const { imageURL } = useContext(UnsplashContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    setCountry(weather && weather.country);
    setCities(getCities());
  }, [weather]);

  useEffect(() => {
    const greetHide = setInterval(() => {
      setGreetMsg("");
    }, 3000);

    return () => {
      clearTimeout(greetHide);
    };
  }, [greetMsg]);

  const handleSpeech = (e) => {
    const button = document.getElementById("speechReg");

    let listening = false;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (typeof SpeechRecognition !== "undefined") {
      const recognition = new SpeechRecognition();

      const stop = () => {
        recognition.stop();
      };

      const start = () => {
        recognition.start();
      };

      const onResult = (event) => {
        for (const res of event.results) {
          const text = res[0].transcript;
          console.log(text);
          searchCity({
            from: "voice",
            city:text
          });
        }
      };
      // recognition.continuous = true;
      // recognition.interimResults = true;
      recognition.addEventListener("result", onResult);
      button.addEventListener("click", (event) => {
        listening ? stop() : start();
        listening = !listening;
      });
    } else {
      setGreetMsg(() => "Sorry, We couldn't recognise your voice");
    }
  };

  return (
    <>
      {loading ? (
        <div className="grid grid-cols-1 grid-rows-2 justify-items-center place-content-center ">
          <div>
            <h1 className={`${theme ? theme.textColor : "bg-slate-800"}`}>
              {greetMsg}
            </h1>
          </div>
          <div>
            <Loader height="120" width="120" />
          </div>
        </div>
      ) : (
        <div className="">
          {weather && weather?.city && (
            <div
              className={`relative overflow-hidden group rounded-2xl ${theme.textColor}  ${theme.cardColor} flex items-center justify-center lg:mt-16 drop-shadow-xl`}
            >
              <img
                className="absolute inset-0 object-cover w-full h-full opacity-40"
                src={imageURL}
                alt="unsplash api is used here,but failed"
              />
              <div className="relative p-4">
                {/* city name with country flag */}
                <p
                  className={`uppercase align-baseline flex items-center justify-center text-center p-2`}
                >
                  {/* <span className="relative overflow-hidden rounded-lg m-2">
                    <img
                      src={`https://countryflagsapi.com/svg/${country}`}
                      alt="n/a"
                      className="blur-[0.8px] inset-0 object-cover w-12 h-8"
                    />
                  </span> */}

                  <span className="mr-1 p-1 text-4xl flex-col align-baseline tracking-widest font-semibold">
                    {" "}
                    {weather ? weather.city : ""}
                  </span>
                  <sup className="py-0.5 px-1.5 rounded-lg text-sm text-white bg-emerald-900 font-xs uppercase align-top">
                    {country}
                  </sup>
                </p>

                {/* city temperature */}
                <div className="m-6 p-8 flex items-center justify-center proportional-nums rounded-xl">
                  <h1
                    className={`text-9xl font-bold ${theme.textColor} tracking-wide align-bottom`}
                  >
                    {weather && units === "metric"
                      ? Math.round(weather.temp_c)
                      : Math.round(weather.temp_f)}
                    <sup className="text-2xl  align-top">
                      {units === "metric" ? "°C" : "°F"}
                    </sup>
                  </h1>
                </div>

                {/* temperature feels like & description*/}
                <div className="flex flex-row m-1 p-1 w-full items-center justify-center">
                  <img
                    className="w-16 h-16 align-top float-right"
                    src={`https://openweathermap.org/img/wn/${
                      weather && weather.icon
                    }@2x.png`}
                    alt={weather && weather.description}
                  />
                  <p className="tracking-wide">
                    feels like{" "}
                    {weather && units === "metric"
                      ? Math.round(weather.temp_feels_c)
                      : Math.round(weather.temp_feels_f)}
                    {units === "metric" ? "°C" : "°F"}
                    {/* with {weather && weather.description} */}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div
            className={`${
              theme ? theme.textColor : "bg-slate-800"
            } flex items-start justify-center m-1 align-text-bottom`}
          >
            {Object.keys(weather).length <= 0 ? (
              <p className="text-base font-thin tracking-wide">
                We couldn't retrieve your Geo Location 😐 Enter nearby city name
                👇
                {/* <img
                      src={TypeBelowGIF}
                      className="m-1"
                      alt="enter city name below"
                      width="480"
                      height="240"
                      frameBorder="0"
                    ></img> */}
              </p>
            ) : (
              <p className="text-base font-thin mt-2 tracking-wide">
                {greetMsg}
              </p>
            )}
          </div>
          {/* city search box & unit selection */}
          <div className="mt-4 flex items-center text-light justify-items-center text-black">
            <label
              htmlFor="clear"
              className="cursor-pointer w-9 h-full items-center justify-center mr-3"
            >
              <button
                id="clear"
                name="city_history_clear"
                className="ml-1 py-1.5 px-1 bg-zinc-100 rounded-lg items-center justify-center border-2 w-full h-full"
                onClick={() =>
                  clearCities(() => {
                    setCities(getCities());
                  })
                }
              >
                🔄️
              </button>
            </label>

            <label
              htmlFor="city-box"
              className="cursor-pointer w-5/6 h-4/6 flex flex-row justify-end items-center relative"
            >
              <input
                id="city-box"
                name="city_name"
                type="text"
                className="bg-zinc-100 rounded-lg text-center border-2 p-1.5 w-full h-full"
                placeholder={"Enter Your City"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => searchCity(e)}
              />
              <button
                className="absolute w-10 mr-6 float-left"
                id="speechReg"
                onClick={(e) => handleSpeech(e)}
              >
                <BiMicrophone/>
              </button>
              <button
                id="submit"
                name="city_name"
                className="absolute w-8"
                onClick={() =>
                  searchCity({
                    from: "submit",
                  })
                }
              >
                <VscSearch/>
              </button>
            </label>

            <label
              htmlFor="temperatureToggle"
              className="relative h-8 w-16 md:w-14 cursor-pointer ml-2"
            >
              <input
                type="checkbox"
                id="temperatureToggle"
                className="peer sr-only [&:checked_+_span_p[data-unchecked]]:hidden [&:checked_+_span_p[data-checked]]:block"
                checked={units === "metric" ? true : false}
                onChange={(e) => changeUnits(e)}
              />

              <span className="absolute inset-0 z-10 m-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-zinc-600 transition peer-checked:translate-x-6 peer-checked:text-indigo-600/60">
                <p
                  data-unchecked
                  className={`text-sm font-xs font-thin align-baseline flex items-center justify-center text-center`}
                >
                  <sup className="align-top">o</sup>
                  <span className="flex-col align-baseline tracking-widest">
                    F
                  </span>
                </p>

                <p
                  data-checked
                  className={`hidden text-sm font-xs font-thin align-baseline items-center justify-center text-center`}
                >
                  <sup className="">o</sup>
                  <span className="flex-col align-baseline tracking-widest">
                    C
                  </span>
                </p>
              </span>

              <span className="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-indigo-500"></span>
            </label>
          </div>
          {/* history of last 6 cities tag */}
          <div className="mt-4 grid grid-cols-3 gap-3 items-center text-light justify-items-center text-black">
            {cities.map((el, index) => (
              <button
                key={index}
                className={` p-2 w-full ${theme.buttonColor}  ${theme.buttonTextColor} capitalize rounded-lg transition-full duration-300 hover:bg-slate-600 hover:text-zinc-200`}
                onClick={() =>
                  searchCity({
                    from: "history",
                    data: el,
                  })
                }
              >
                {el.city}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
