import React from "react";
import moment from "moment"; // Import moment properly
import "./styles.css";

const WeatherCard = ({ Wdata }) => {
  if (Wdata.count === 0) {
    return <div>No weather data available</div>;
  }

  const cityWeather = Wdata.data[0]; // Get weather details for the city

  return (
    <div className="main">
      <p className="header">{cityWeather.city_name}</p>
      <div className="flex">
        <p className="day">Day: {moment().format("dddd")}</p>
        <p className="day">{moment().format("LL")}</p>
      </div>
      <div className="flex">
        <p className="temp">Temperature: {cityWeather.app_temp}°C</p>
        <p className="temp">AQI: {cityWeather.aqi}</p>
        <p className="temp">Clouds: {cityWeather.clouds}%</p>
      </div>
    </div>
  );
};

export default WeatherCard;
