import { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = import.meta.env.VITE_CITY_EXPLORER_API_KEY;

function App() {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInput = (event) => {
    const value = event.target.value;
    setCity(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(`https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${city}&format=json`);
      setResponseData(response.data[0]);
      setError(null);
    } catch (error) {
      console.error('Error fetching location:', error);
      setError('Error fetching location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        <h1>Geolocation</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Enter a city name" onChange={handleInput} />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
        </form>
      </header>
      {error && <div className="alert alert-danger">{error}</div>}
      {responseData && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Location Details</h5>
            <p><strong>Display Name:</strong> {responseData.display_name}</p>
            <p><strong>Latitude:</strong> {responseData.lat}</p>
            <p><strong>Longitude:</strong> {responseData.lon}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
