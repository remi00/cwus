const url = require('url');
const request = require('request-promise-native');
const util = require('util');

const get = async (city) => {
  const weatherUrl = url.format({
    protocol: 'https:',
    host: 'query.yahooapis.com',
    pathname: '/v1/public/yql',
    query: {
      format: 'json',
      end: 'store://datatables.org/alltableswithkeys',
      q: `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${city}")`,
    },
  });
  try {
    const weatherRes = await request.get(weatherUrl);
    if (weatherRes) {
      const weather = JSON.parse(weatherRes);
      if (weather && weather.query && weather.query.results && weather.query.results.channel) {
        return weather.query.results.channel;
      }
    }
    return false;
  } catch (error) {
    console.warn(`Fetching weather for ${city} error: ${util.inspect(error)}`);
    return false;
  }
}

module.exports = {
  get,
};
