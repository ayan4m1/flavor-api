import { Router } from 'express';
import { query, validationResult } from 'express-validator';

import { authenticate } from '../modules/auth';
import models from '../modules/database';
import loggers from '../modules/logging';

const router = Router();
const log = loggers('flavors');
const { Flavor, Vendor } = models;

/**
 * GET Flavors
 * @query offset int
 * @query limit int
 */
router.get(
  '/',
  authenticate(),
  [
    query('offset')
      .optional()
      .isNumeric()
      .toInt(),
    query('limit')
      .optional()
      .isNumeric()
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const limit = req.query.limit || 20;

    const offset = req.query.offset - 1 || 0;

    log.info(`request for flavors ${limit}`);
    try {
      const result = await Flavor.findAll({
        limit,
        offset,
        include: [
          {
            model: Vendor,
            require: true
          }
        ]
      });

      if (!Array.isArray(result) || result.length === 0) {
        return res.status(204).end();
      }

      res.type('application/json');
      res.json(result);
    } catch (error) {
      log.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

/**
 * GET Flavor Stats
 */
router.get('/count', authenticate(), async (req, res) => {
  log.info(`request for flavor stats`);
  try {
    // Flavor Stats
    const result = await Flavor.count();

    res.type('application/json');
    res.json(result);
  } catch (error) {
    log.error(error.message);
    res.status(500).send(error.message);
  }
});

export default router;
