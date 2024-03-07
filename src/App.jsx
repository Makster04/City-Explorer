import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import './App.css';

const API_KEY = import.meta.env.VITE_CITY_EXPLORER_API_KEY;

function App() {
  const [responseData, setResponseData] = useState(null);
  const [weatherResponseData, setWeatherResponseData] = useState(null); // Updated state
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
      const cityResponse = response.data;
      const weatherResponse = await axios.get(`http://localhost:3000/weather/${cityResponse[0].lat}_${cityResponse[0].lon}`);
      setResponseData(cityResponse[0]);
      setWeatherResponseData(weatherResponse.data); // Updated state
      setError(null);
    } catch (error) {
      console.error('Error fetching location:', error);
      setError('Error fetching location. Please try again.');
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
              <Form.Control type="text" placeholder="Enter a city name" onChange={handleInput} />
            </Col>
            <Col>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Loading...' : 'Search'}
              </Button>
            </Col>
          </Row>
        </Form>
      </header>
      {error && <div className="alert alert-danger">{error}</div>}
      {responseData && (
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
      )}
     {weatherResponseData && (
  <Card id="weather-card"> {/* Add unique ID */}
    <Card.Body id="weather-body">
      <Card.Title id="weather-title">Weather Forecast</Card.Title>
      <Row id= "weather-row">
        {weatherResponseData.map((forecast, index) => (
          <Col key={index}>
            <p>DATE: {forecast.date}</p>
            <p>DESCRIPTION: {forecast.description}</p>
            <p>HIGH: {forecast.high}</p>
            <p>LOW: {forecast.low}</p>
          </Col>
        ))}
      </Row>
    </Card.Body>
  </Card>

      )}
    </Container>
  );
}

export default App;
