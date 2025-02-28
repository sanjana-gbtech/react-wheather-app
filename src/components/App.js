import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchEngine from "./SearchEngine";
import Forecast from "./Forecast";

import "../styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    forecast: [],
    error: false,
  });

  const toDate = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    const currentDate = new Date();
    return `${days[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
  };

  const fetchWeather = async (city) => {
    setWeather({ ...weather, loading: true });

    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    try {
      // 🌍 Fetch city coordinates
      const geoRes = await axios.get(geoUrl);
      if (geoRes.data.length === 0) {
        setWeather({ ...weather, data: {}, forecast: [], error: true });
        return;
      }

      const { lat, lon, name, country } = geoRes.data[0];

      // 🌦️ Fetch current weather data
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const weatherRes = await axios.get(weatherUrl);

      // 📅 Fetch 5-day forecast data
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const forecastRes = await axios.get(forecastUrl);

      // Process forecast data (filter every 8th entry for 5-day forecast)
      const forecastData = forecastRes.data.list.filter((_, index) => index % 8 === 0).map((item) => ({
        date: item.dt_txt.split(" ")[0],
        temp: item.main.temp,
        weatherDescription: item.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      }));

      // ✅ Update state with both current weather & forecast
      setWeather({
        data: {
          city: name,
          country,
          temperature: weatherRes.data.main.temp,
          humidity: weatherRes.data.main.humidity,
          windSpeed: weatherRes.data.wind.speed,
          weatherDescription: weatherRes.data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${weatherRes.data.weather[0].icon}@2x.png`
        },
        forecast: forecastData,
        loading: false,
        error: false
      });

      
    } catch (error) {
      setWeather({ ...weather, data: {}, forecast: [], error: true });
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeather("Mumbai"); // Default city on load
  }, []);

  const search = (event) => {
    event.preventDefault();
    if (event.type === "click" || (event.type === "keypress" && event.key === "Enter")) {
      fetchWeather(query);
    }
  };

  return (
    <div className="App">
      {/* Search Component */}
      <SearchEngine query={query} setQuery={setQuery} search={search} />

      {weather.loading && (
        <>
          <br />
          <br />
          <h4>Searching...</h4>
        </>
      )}

      {weather.error && (
        <>
          <br />
          <br />
          <span className="error-message">
            <span style={{ fontFamily: "font" }}>
              Sorry, city not found. Please try again.
            </span>
          </span>
        </>
      )}

      {weather.data.city && (
        // Forecast Component
        <Forecast weather={weather} toDate={toDate} />
      )}
    </div>
  );
}

export default App;
