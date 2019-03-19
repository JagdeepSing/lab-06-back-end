'use strict';

require('dotenv').config();

const superagent = require('superagent');
const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT;


// location route, returns location object
// Keys: search_query, formatted_query, latitude and longitude
app.get('/location', searchToLatLong);

// (req, res) => {
//   if (req.query.data.length === 0) {
//     res.status(500).send('Invalid Location');
//   } else { 
//     const locationData = searchToLatLong(req.query);
//     res.send(locationData);
//   }
// });

// weather route, returns an array of forecast objects
// Keys: forecast, time
app.get('/weather', (req, res) => {
  const forecastData = searchToDailyForecast(req.query);
  res.send(forecastData);
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

function handleError(err, res) {
  console.error(err);
  if (res) res.status(500).send('Sorry, something went wrong');
}

// HELPER FUNCTIONS

// takes search request and convert to location object

// TODO: refactor this function
// function searchToLatLong(query) {
//   const geoData = require('./data/geo.json');
//   const location = new Location(geoData, Object.values(query)[0]);
//   return location;
// }

function searchToLatLong(req, res) {
  const mapsURL = `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_MAPS_API_KEY}&address=${req.query.data}`;
  return superagent.get(mapsURL)
    .then(result => {
      res.send(new Location(result.body.results[0], req.query));
    })
    .catch(error => handleError(error));
}


// Location object constructor
function Location(data, query) {
  this.search_query = query;
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

// returns array of daily forecasts
function searchToDailyForecast(query) {
  const weatherData = require('./data/darksky.json');
  const dailyForecast = weatherData.daily.data;
  let result = [];

  dailyForecast.forEach(day => {
    let time = new Date(day.time*1000).toString().slice(0,15);
    result.push(new Forecast(day.summary, time));
  });
  return result;
}

// Forecast object constructor
function Forecast(forecast, time) {
  this.forecast = forecast;
  this.time = time;
}