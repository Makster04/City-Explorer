import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

// Define the API key
const VITE_CITY_EXPLORER_API_KEY = "pk.dd81dbc23d1cff1c42a8f923baf54d5d";

function App() {
  const [city, setCity] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('https://us1.locationiq.com/v1/search.php', {
        params: {
          key: VITE_CITY_EXPLORER_API_KEY,
          q: city,
          format: 'json',
        },
      });
      setLocationData(response.data[0]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error fetching data. Please try again.');
      setLocationData(null);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Explore Cities</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cityInput">Enter a city:</label>
          <input
            type="text"
            className="form-control"
            id="cityInput"
            placeholder="E.g., New York"
            value={city}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Explore!</button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {locationData && (
        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">{locationData.display_name}</h5>
            <p className="card-text">Latitude: {locationData.lat}</p>
            <p className="card-text">Longitude: {locationData.lon}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
