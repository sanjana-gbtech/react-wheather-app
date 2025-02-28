import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast({ weather }) {

  const { data } = weather;
  const [forecastData, setForecastData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);
  console.log(data,'data');
  useEffect(() => {
    console.log("Received Forecast Data in Forecast.js:", weather.forecast);
    setForecastData(weather.forecast);
  }, [weather]);
 
  const getCurrentDate = () =>
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const toggleTemperatureUnit = () => setIsCelsius((prev) => !prev);
  const convertToFahrenheit = (temp) => Math.round((temp * 9) / 5 + 32);
  const renderTemperature = (temp) =>
    isCelsius ? Math.round(temp) : convertToFahrenheit(temp);

  return (
    <div>
      {data.city && (
        <div className="city-name">
          <h2>
            {data.city}, <span>{data.country}</span>
          </h2>
        </div>
      )}

      <div className="date">
        <span>{getCurrentDate()}</span>
      </div>

      {data.temperature && (
        <div className="temp " style={{display:'flex', justifyContent:'center',alignItems:'center'}}>
          {data.icon && (
            <img
              src={`${data.icon}`}
              alt={data.weatherDescription}
              className="temp-icon"
            />
          )}
          <div>{renderTemperature(data.temperature)}</div>
          <sup className="temp-deg" onClick={toggleTemperatureUnit}>
            {isCelsius ? "°C" : "°F"} | {isCelsius ? "°F" : "°C"}
          </sup>
        </div>
      )}

      {data.weatherDescription && (
        <p className="weather-des">{data.weatherDescription}</p>
      )}

      <div className="weather-info">
        <div className="col">
          <ReactAnimatedWeather icon="WIND" size="40" />
          <div>
            <p className="wind">{data.windSpeed} m/s</p>
            <p>Wind Speed</p>
          </div>
        </div>
        <div className="col">
          <ReactAnimatedWeather icon="RAIN" size="40" />
          <div>
            <p className="humidity">{data.humidity}%</p>
            <p>Humidity</p>
          </div>
        </div>
      </div>

      <div className="forecast">
        <h3>5-Day Forecast:</h3>
        <div className="forecast-container">

          {
            
            weather.forecast
              .map((day, index) => {
                console.log("Rendering day:", index, day);
                return (
                  <div className="day" key={day.date}>
                    <p className="day-name">
                    {day.date}
                    </p>
                    <img
                      className="day-icon"
                      src={day.icon}
                      alt={day.weatherDescription}
                    />
                    <p className="day-temperature">{Math.round(day.temp)}°  </p>
                  </div>
                );
              })
          }
        </div>
      </div>
    </div>
  );
}

export default Forecast;
