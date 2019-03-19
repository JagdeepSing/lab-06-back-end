'use strict';

require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT;

// location route, returns location object
// Keys: search_query, formatted_query, latitude and longitude
app.get('/location', (req, res) => {
  if (req.query.data.length === 0) {
    res.status(500).send('Invalid Location');
  } else { 
    const locationData = searchToLatLong(req.query);
    res.send(locationData);
  }
});

// weather route, returns an array of forecast objects
// Keys: forecast, time
app.get('/weather', (req, res) => {
  const forecastData = searchToDailyForecast(req.query);
  res.send(forecastData);
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

// HELPER FUNCTIONS

// takes search request and convert to location object
function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(geoData, Object.values(query)[0]);
  return location;
}

// Location object constructor
function Location(data, query) {
  this.search_query = query;
  this.formatted_query = data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;
}

// returns array of daily forecasts
function searchToDailyForecast(query) {
  const weatherData = require('./data/darksky.json');
  const dailyForecast = weatherData.daily.data;
  let result = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  dailyForecast.forEach(day => {
    let time = new Date(day.time);
    let formattedTime = `${days[time.getDay()]} ${months[time.getMonth()]} ${time.getDate()} ${time.getFullYear()}`;
    const forecast = new Forecast(day.summary, formattedTime);
    result.push(forecast);
  });
  return result;
}

// Forecast object constructor
function Forecast(forecast, time) {
  this.forecast = forecast;
  this.time = time;
}