import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import preparations from './preparations';
import database from '../modules/database';
import { captureTestErrors } from '../modules/util';

describe('preparations route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(preparations);

  const request = captureTestErrors(app);

  afterAll(() => {
    database.sequelize.close();
  });

  it('returns valid list of 2 preparations', done => {
    request.get('/?limit=2').expect(200, done);
  });

  it('returns 200 for preparations list', done => {
    request.get('/?offset=9000000').expect(200, done);
  });

  it('returns 400 for invalid preparations list', done => {
    request.get('/?limit=stop').expect(400, done);
  });
});
