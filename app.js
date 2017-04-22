const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const cities = require('./cities');
const weather = require('./weather');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// For consistency let's make the cities list also a webservice responsibility
app.get('/cities', (req, res) => {
  res.json(cities.all());
});
app.get('/cities/:zip', (req, res) => {
  const requestedCity = cities.byZip(req.params.zip);
  if (!requestedCity || !requestedCity.name || !requestedCity.state) {
    return res.status(404).json({ message: 'City not supported' });
  }
  return res.json(requestedCity);
});


// Simple endpoint using get
app.get('/weather/:zip', async (req, res) => {
  const requestedCity = cities.byZip(req.params.zip);
  if (!requestedCity || !requestedCity.name || !requestedCity.state) {
    return res.status(404).json({ message: 'City not supported' });
  }

  const cityWeather = await weather.get(requestedCity);
  if (cityWeather) {
    return res.json(cityWeather);
  }
  return res.status(500).json({ message: 'Problem fetching city weather' });
});

// For more comprehensive requests (ie multiple zips for fetch multiple cities' weather) use POST
app.post('/weather', async (req, res) => {
  const zips = req.body.zips;
  if (!zips || !zips.length) {
    return res.status(400).json({ message: 'Please provide array of ZIP codes for retrieve multiple cities weather' });
  }

  const requestedCities = zips.map(zip => cities.byZip(zip));
  const citiesWeathers = await Promise.all(
    requestedCities
      .map(requestedCity => weather.get(requestedCity)));

  if (citiesWeathers.some(cw => cw)) {
    return res.json(citiesWeathers);
  }
  return res.status(500).json({ message: 'Problem fetching weather for all cities' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Users service running at http://localhost:${port}/`);
});

