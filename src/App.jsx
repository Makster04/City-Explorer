import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import './App.css';

const API_KEY = import.meta.env.VITE_CITY_EXPLORER_API_KEY;

function App() {
  const [responseData, setResponseData] = useState(null);
  const [weatherResponseData, setWeatherResponseData] = useState(null);
  const [movieResponseData, setMovieResponseData] = useState(null); // New state for movie data
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
      const weatherResponse = await axios.get(`http://localhost:3000/weather/${cityResponse[0].lat}_${cityResponse[0].lon}`);
      const movieResponse = await axios.get(`http://localhost:3000/movies/${city}`); // Fetch movie data
      setResponseData(cityResponse[0]);
      setWeatherResponseData(weatherResponse.data);
      setMovieResponseData(movieResponse.data); // Update movie data state
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
      <header>
        <h1>Location Watchlist</h1>
        <h2>Geolocation:</h2>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control type="text" placeholder="Only Seattle, Paris, Amman for now" onChange={handleInput} />
            </Col>
            <Col>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Loading...' : 'Search'}
              </Button>
            </Col>
          </Row>
        </Form>
        {showRadar && <img src="radar2.gif" alt="Radar" />}
      </header>
      {error && <div className="alert alert-danger">{error}</div>}
      {responseData && (
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Location Details</Card.Title>
                <Row>
                  <Col>
                    <p><strong>DISPLAY NAME:</strong> {responseData.display_name}</p>
                  </Col>
                  <Col>
                    <p><strong>LATITUDE:</strong> {responseData.lat}</p>
                  </Col>
                  <Col>
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
      {weatherResponseData && (
        <Row>
          <Col>
            <Card id="weather-card">
              <Card.Body id="weather-body">
                <Card.Title id="weather-title">Weather Forecast</Card.Title>
                <Row id="weather-row">
                  {weatherResponseData.map((forecast, index) => (
                    <Col key={index}>
                      <p><strong>DATE:</strong> {forecast.date}</p>
                      <p><strong>DESCRIPTION:</strong> {forecast.description}</p>
                      <p><strong>HIGH:</strong> {forecast.high}</p>
                      <p><strong>SLOW:</strong> {forecast.low}</p>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      {movieResponseData && (
        <Row>
          <Col>
            <Card id="movie-card">
              <Card.Body id="movie-body">
                <Card.Title id="movie-title">Movies</Card.Title>
                <Row id="movie-row">
                  {movieResponseData.map((movie, index) => (
                    <Col key={index}>
                      <p>TITLE: {movie.title}</p>
                      <p>RELEASE DATE: {movie.releaseDate}</p>
                      <p>OVERVIEW: {movie.overview}</p>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default App;