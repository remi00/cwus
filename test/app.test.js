'use strict';

const request = require('supertest');
const assert = require('assert');
const app = require('../app');

describe('cwus webservice tests', () => {
  let agent;

  before((done) => {
    agent = request.agent(app);
    done();
  });

  it('should respond to cities', (done) => {
    agent
      .get('/cities')
      .send()
      .expect('content-type', /json/)
      .expect(200)
      .then((res) => {
        assert.ok(res.body.length);
        done();
      });
  });

  it('should respond on supported city', (done) => {
    agent
      .get('/cities/10001')
      .send()
      .expect('content-type', /json/)
      .expect(200)
      .then((res) => {
        assert.ok(res.body.name);
        assert.ok(res.body.state);
        assert.ok(res.body.zip);
        done();
      });
  });

  it('should respond with 404 wrong/unsupported city usage', (done) => {
    agent
      .get('/cities/wrongcity')
      .send()
      .expect('content-type', /json/)
      .expect(404, done);
  });

  it('should get full weather response for supported city', (done) => {
    agent
      .get('/weather/10001')
      .send()
      .expect(200)
      .then((res) => {
        assert.ok(res.body.astronomy);
        assert.ok(res.body.atmosphere);
        assert.ok(res.body.item);
        assert.ok(res.body.location);
        assert.ok(res.body.units);
        done();
      });
  });

  it('should respond with 404 wrong/unsupported city usage', (done) => {
    agent
      .get('/weather/wrongcity')
      .send()
      .expect('content-type', /json/)
      .expect(404, done);
  });

  it('should respond with all available weather forecast on POST request', (done) => {
    agent
      .post('/weather')
      .send({
        zips: [10001, 90001, 12345],
      })
      .expect('content-type', /json/)
      .expect(200)
      .then((res) => {
        assert.ok(res.body.length, 2);
        done();
      });
  });
});
