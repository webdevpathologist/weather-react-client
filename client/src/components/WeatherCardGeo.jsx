import React, { useContext, useState, useEffect } from "react";

import { WeatherContext } from "../contexts/WeatherContext";
import { UnsplashContext } from "../contexts/UnsplashContext";
import { ThemeContext } from "../contexts/ThemeContext";
import Loader from "./Loader";

export default function WeatherCardGeo(props) {
  const { weather, query, setQuery, greetMsg, searchCity, loading } =
    useContext(WeatherContext);

  const [country, setCountry] = useState("IN");

  const { imageURL } = useContext(UnsplashContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    setCountry(weather && weather.sys && weather.sys.country);
  }, [weather]);

  // console.log(weather.weather[0].description,country);
  return (
    <>
      {loading ? (
        <div className="grid grid-cols-1 grid-rows-2 justify-items-center place-content-center">
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
        <div>
          {weather && weather.main && weather.sys && (
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
                    {weather ? weather.name : ""}
                  </span>
                  <sup class="py-0.5 px-1.5 rounded-lg text-sm text-white bg-emerald-900 font-xs uppercase align-top">{country}</sup>
                </p>

                {/* city temperature */}
                <div className="m-6 p-8 flex items-center justify-center proportional-nums rounded-xl">
                  <h1
                    className={`text-9xl font-bold ${theme.textColor} tracking-wide align-bottom`}
                  >
                    {Math.round(weather && weather.main.temp)}
                    <sup className="text-2xl  align-top">°C</sup>
                  </h1>
                </div>

                {/* temperature feels like & description*/}
                <div className="flex flex-row m-1 p-1 w-full items-center justify-center">
                  <img
                    className="w-16 h-16 align-top float-right"
                    src={`https://openweathermap.org/img/wn/${
                      weather && weather.weather && weather.weather[0].icon
                    }@2x.png`}
                    alt={weather && weather.weather[0].description}
                  />
                  <p className="tracking-wide">
                    feels like {Math.round(weather && weather.main.feels_like)}°C 
                    {/* with {weather && weather.weather[0].description} */}
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
          <div className="mt-4 flex items-center text-light justify-center text-black">
            <input
              name="city_name"
              type="text"
              className="rounded-lg w-full h-10 text-center border-2"
              // placeholder={greetMsg}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => searchCity(e)}
            />

            {/* <label class="relative w-16 h-8 cursor-pointer">
                    <input type="checkbox" class="sr-only peer" />
        
                    <span class="absolute inset-0 bg-blue-400 rounded-full transition peer-checked:bg-blue-600">C</span>
        
                    <span class="absolute inset-0 w-6 h-6 m-1 bg-white rounded-full transition peer-checked:translate-x-8">F</span>
                  </label> */}
          </div>
        </div>
      )}
    </>
  );
}
