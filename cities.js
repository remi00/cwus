const cities = require('./dictionaries/cities.json');

const all = () => cities;
const byZip = zip => cities.find(c => c.zip === Number(zip));

module.exports = {
  all,
  byZip,
};
