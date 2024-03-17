// MoviesComponent.jsx
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const MoviesComponent = ({ movieResponseData }) => {
  return (
    <Row>
      <Col>
        <Card className="movie-card">
          <Card.Body>
            <Card.Title>Movies</Card.Title>
            <Row className="movie-row">
              {movieResponseData.map((movie, index) => (
                <Col key={index}>
                  <p><strong>TITLE:</strong> {movie.title}</p>
                  <p><strong>- RELEASE DATE:</strong> {movie.releaseDate}</p>
                  <p><strong>- OVERVIEW:</strong> {movie.overview}</p>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default MoviesComponent;
