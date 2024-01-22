import "./App.css";
import { useEffect, useState } from "react";
import WeatherCard from "./component/weather"; // Updated import
import "./App.css";
import SearchIcon from "./component/search.svg";

function App() {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [wcity, setWCity] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(function (pos) {
        setLat(pos.coords.latitude);
        setLong(pos.coords.longitude);
      });

      if (lat !== null && long !== null) {
        try {
          const response = await fetch(
            `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${long}&key=0912a0fc464b48e4812329cc41dfc0db	`
          );
          const result = await response.json();
          setData(result);
          console.log(result);
        } catch (error) {
          console.error("Fetch error:", error);
        }
      }
    };
    fetchData();
  }, [lat, long]);

  //For cities
  const searchCity = async (city) => {
    const response = await fetch(
      `https://api.weatherbit.io/v2.0/current?city=${city}&key=0912a0fc464b48e4812329cc41dfc0db`
    );
    const result = await response.json();
    setData(result);
  };
  useEffect(() => {
    searchCity();
  }, []);

  return (
    <div className="App">
      <h1>Weatherteller</h1>
      {data ? <WeatherCard Wdata={data} /> : <div>Loading...</div>}
      <br />
      <br />
      <div>
        <h1>Search for your Country/City</h1>
        <div className="search">
          <input
            placeholder="Search for your City"
            value={wcity}
            onChange={(e) => setWCity(e.target.value)}
          />
          <img
            src={SearchIcon}
            alt="Search"
            onClick={() => searchCity(wcity)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
