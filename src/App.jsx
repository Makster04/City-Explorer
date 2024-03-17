import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import './App.css';
import RadarImage from "./assets/radar2.gif";
import WeatherComponent from './WeatherComponent.jsx';
import MoviesComponent from './MoviesComponent.jsx';

const API_KEY = import.meta.env.VITE_CITY_EXPLORER_API_KEY;

function App() {
  const [responseData, setResponseData] = useState(null);
  const [weatherResponseData, setWeatherResponseData] = useState(null);
  const [movieResponseData, setMovieResponseData] = useState(null); 
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRadar, setShowRadar] = useState(true);

  const handleInput = (event) => {
    const value = event.target.value;
    setCity(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city) {
      setError('Please enter a city name.');
      return;
    }
    try {
      setLoading(true);
      setShowRadar(false);
      const response = await axios.get(`https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${city}&format=json`);
      const cityResponse = response.data;
      const weatherResponse = await axios.get(`${API_KEY}/${cityResponse[0].lat}_${cityResponse[0].lon}`);
      const movieResponse = await axios.get(`${API_KEY}/${city}`);
      setResponseData(cityResponse[0]);
      setWeatherResponseData(weatherResponse.data);
      setMovieResponseData(movieResponse.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <header className="header">
        <h1 className="main-title">Location Watchlist</h1>
        <h2>Geolocation:</h2>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control type="text" placeholder="Search a City" onChange={handleInput} />
            </Col>
            <Col>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Loading...' : 'Search'}
              </Button>
            </Col>
          </Row>
        </Form>
        {showRadar && <img src={RadarImage} alt="Radar" />}
      </header>
      {error && <div className="alert alert-danger">{error}</div>}
      {responseData && (
        <Row>
          <Col>
            <Card className="location-card">
              <Card.Body>
                <Card.Title>Location Details</Card.Title>
                <Row>
                  <Col>
                    <p><strong>DISPLAY NAME:</strong> {responseData.display_name}</p>
                    <p><strong>LATITUDE:</strong> {responseData.lat}</p>
                    <p><strong>LONGITUDE:</strong> {responseData.lon}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <img src={`https://maps.locationiq.com/v3/staticmap?key=${API_KEY}&center=${responseData.lat},${responseData.lon}&zoom=9`} style={{ width: '100%' }} alt="Map" />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {weatherResponseData && <WeatherComponent weatherResponseData={weatherResponseData} />}
      {movieResponseData && <MoviesComponent movieResponseData={movieResponseData} />}
    </Container>
  );
}

export default App;
