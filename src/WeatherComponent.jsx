// WeatherComponent.jsx
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const WeatherComponent = ({ weatherResponseData }) => {
  return (
    <Row>
      <Col>
        <Card className="weather-card">
          <Card.Body>
            <Card.Title>Weather Forecast</Card.Title>
            <Row className="weather-row">
              {weatherResponseData.map((forecast, index) => (
                <Col key={index}>
                  <p><strong>DATE:</strong> {forecast.date}</p>
                  <p><strong>DESCRIPTION:</strong> {forecast.description}</p>
                  <p><strong>HIGH:</strong> {forecast.high}</p>
                  <p><strong>LOW:</strong> {forecast.low}</p>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default WeatherComponent;
