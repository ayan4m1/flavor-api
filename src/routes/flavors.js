import { Router } from 'express';
import { query } from 'express-validator';

import { authenticate, ensurePermission } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import {
  handleCount,
  handleFindAll,
  handleValidationErrors
} from 'modules/utils/request';

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
  ensurePermission('flavors', 'read'),
  [
    (query('offset')
      .optional()
      .isNumeric()
      .toInt(),
    query('limit')
      .optional()
      .isNumeric()
      .toInt())
  ],
  handleValidationErrors(),
  handleFindAll(Flavor, req => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset - 1 || 0;

    log.info(`request for flavors ${limit}`);
    return {
      limit,
      offset,
      include: [
        {
          model: Vendor,
          require: true
        }
      ]
    };
  })
);

/**
 * GET Flavor Stats
 */
router.get(
  '/count',
  authenticate(),
  ensurePermission('flavors', 'read'),
  handleCount(Flavor)
);

export default router;
