'use strict';

require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT;

app.get('/location', (req, res) => {
  const locationData = searchToLatLong(req.query);
  res.send(locationData);
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

// HELPER FUNCTIONS

// takes search request and convert to lat and long
function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(geoData, Object.values(query)[0]);
  return location;
}

function Location(data, query) {
  this.search_query = query;
  this.formatted_query = data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;
}