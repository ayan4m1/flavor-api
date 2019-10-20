import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import stats from './stats';
import database from '../modules/database';
import { captureTestErrors } from '../modules/util';

describe('stats route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(stats);

  const request = captureTestErrors(app);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid stats', done => {
    request.get('/dashboard').expect(200, done);
  });

  it('returns 404 for page not found', done => {
    request.get('/error').expect(404, done);
  });
});
