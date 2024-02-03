import React, { useEffect, useState } from "react";
import WeatherCard from "./component/weather";
import SearchIcon from "./component/search.svg";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { auth } from "./component/firebase";

import "./component/css/App.css";

function App() {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [wcity, setWCity] = useState(null);
  const [data, setData] = useState(null);
  const [showUserTable, setShowUserTable] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null);
  const Navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          // user is signed in
          setUser(authUser);
        } else {
          // user is signed out
          setUser(null);
          // user is intentionally unused
        }
      });
      navigator.geolocation.getCurrentPosition(function (pos) {
        setLat(pos.coords.latitude);
        setLong(pos.coords.longitude);
      });

      if (lat !== null && long !== null) {
        try {
          const response = await fetch(
            `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${long}&key=0912a0fc464b48e4812329cc41dfc0db`
          );
          const result = await response.json();
          setData(result);
          console.log(result);
        } catch (error) {
          console.error("Fetch error:", error);
        }
      }
      return () => unsubscribe();
    };
    fetchData();
  }, [lat, long]);

  const searchCity = async (city) => {
    const response = await fetch(
      `https://api.weatherbit.io/v2.0/current?city=${city}&key=0912a0fc464b48e4812329cc41dfc0db`
    );
    const result = await response.json();
    setData(result);
  };

  const handleShowUserTable = () => {
    setShowUserTable(true);
    // Optionally, you can also navigate to a different route here
    // For example: navigate('/user-table');
  };

  return (
    <>
      <head>
        <title>Weatherteller</title>
      </head>
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
        <br />
        <button onClick={handleShowUserTable}>
          {showUserTable ? "Close Active Users" : "Show Active Users"}
        </button>
        {showUserTable && Navigate("/component/Usertable")}
      </div>
    </>
  );
}

export default App;
