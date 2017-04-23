const assert = require('assert');

const weather = require('../weather');

describe('weather module tests', () => {

  it('should get weather for single valid city', async () => {
    const res = await weather.get({ name: 'Los Angeles', state: 'California' });
    assert.ok(res);
  });

  it('should response with falsy on non-existent city', async () => {
    const res = await weather.get({ name: 'LsoAnglesos', state: 'Alcifronia' });
    assert.equal(res, false);
  });

  it('should response with falsy on wrong city object input', async () => {
    const res = await weather.get({ wrong: 'object' });
    assert.equal(res, false);
  });
});
