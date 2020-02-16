import { Router } from 'express';
import { body, param } from 'express-validator';

import { authenticate } from 'modules/auth';
import models from 'modules/database';
import loggers from 'modules/logging';
import {
  handleFindAll,
  handleModelOperation,
  handleValidationErrors
} from 'modules/utils/request';

const router = Router();
const log = loggers('user');
const {
  Flavor,
  Recipe,
  Role,
  User,
  UsersFlavors,
  UserProfile,
  UsersRoles,
  Vendor
} = models;

/**
 * GET User Info
 * @param userId int
 */
router.get(
  '/:id(\\d+)',
  authenticate(),
  [
    param('id')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleModelOperation(User, 'findOne', req => {
    const { id } = req.params;

    log.info(`request for user ${id}`);
    return [
      {
        where: {
          id
        }
      }
    ];
  })
);
/* PUT /:userId - Update user info. - still trying to figure out the best approach here
 */

/**
 * GET User Profile
 * @param userId int
 */
router.get(
  '/:userId(\\d+)/profile',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleModelOperation(UserProfile, 'findOne', req => {
    const { userId } = req.params;

    log.info(`request for user profile ${userId}`);
    return [
      {
        where: {
          userId
        }
      }
    ];
  })
);
/**
 * PUT Update User's Profile
 * @param userId int
 */
router.put(
  '/:userId(\\d+)/profile',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleModelOperation(UserProfile, 'update', req => {
    const { userId } = req.params;
    const { location, bio, url } = req.body;

    return [
      {
        location,
        bio,
        url
      },
      {
        where: {
          userId
        }
      }
    ];
  })
);
/**
 * GET User Recipes
 * @param userId int
 */
router.get(
  '/:userId(\\d+)/recipes',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleFindAll(Recipe, req => {
    const { userId } = req.params;

    log.info(`request for user recipes ${userId}`);
    return {
      where: {
        userId
      }
    };
  })
);

/**
 * GET User Flavors
 * @param userId int
 */
router.get(
  '/:userId(\\d+)/flavors',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleFindAll(UsersFlavors, req => {
    const { userId } = req.params;

    log.info(`request flavor stash for user ${userId}`);
    return {
      where: {
        userId
      },
      include: [
        {
          model: Flavor,
          required: true,
          include: [
            {
              model: Vendor,
              required: true
            }
          ]
        }
      ]
    };
  })
);
/**
 * GET A User Flavor
 * @param userId int
 * @param flavorId int
 */
router.get(
  '/:userId(\\d+)/flavor/:flavorId(\\d+)',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleFindAll(UsersFlavors, req => {
    const { userId, flavorId } = req.params;

    log.info(`request flavor stash flavor id ${flavorId} for user ${userId}`);
    return {
      where: {
        userId,
        flavorId
      },
      include: [
        {
          model: Flavor,
          required: true,
          include: [
            {
              model: Vendor,
              required: true
            }
          ]
        }
      ]
    };
  })
);
/**
 * POST Add Flavor to User's Flavor Stash
 * @param userId int - User ID
 */
router.post(
  '/:userId(\\d+)/flavor',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleModelOperation(UsersFlavors, 'create', req => {
    const { userId } = req.params;
    const { flavorId, created, minMillipercent, maxMillipercent } = req.body;

    log.info(`create flavor stash for user ${userId}`);
    return [
      {
        userId,
        flavorId,
        created,
        minMillipercent,
        maxMillipercent
      }
    ];
  })
);
/**
 * PUT Update User's Flavor Stash Entry
 * @param userId int
 * @param flavorId int
 */
router.put(
  '/:userId(\\d+)/flavor/:flavorId(\\d+)',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleModelOperation(UsersFlavors, 'update', req => {
    const { minMillipercent, maxMillipercent } = req.body;
    const { userId, flavorId } = req.params;

    log.info(`update user ${userId} flavor ${flavorId}`);
    return [
      {
        minMillipercent,
        maxMillipercent
      },
      {
        where: {
          userId,
          flavorId
        }
      }
    ];
  })
);

/**
 * DELETE Remove User's Flavor Stash Entry
 * @param userId int
 * @param flavorId int
 */
router.delete(
  '/:userId(\\d+)/flavor/:flavorId(\\d+)',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('flavorId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleModelOperation(UsersFlavors, 'destroy', req => {
    const { userId, flavorId } = req.params;

    log.info(`delete from flavor stash for ${flavorId}`);
    return [
      {
        where: {
          userId,
          flavorId
        }
      }
    ];
  })
);
/**
 * GET User Roles
 * @param userId int
 */
router.get(
  '/:userId(\\d+)/roles',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleFindAll(UsersRoles, req => {
    const { userId } = req.params;

    log.info(`request roles for user ${userId}`);
    return {
      where: {
        userId
      },
      include: [
        {
          model: Role,
          required: true
        }
      ]
    };
  })
);
/**
 * GET A User Role
 * @param userId int
 * @param roleId int
 */
router.get(
  '/:userId(\\d+)/role/:roleId(\\d+)',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('roleId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleModelOperation(UsersRoles, 'findOne', req => {
    const { userId, roleId } = req.params;

    log.info(`request role id ${roleId} for user ${userId}`);
    return [
      {
        where: {
          userId,
          roleId
        },
        include: [
          {
            model: Role,
            required: true
          }
        ]
      }
    ];
  })
);
/**
 * POST Add Role to User's Roles
 * @param userId int - User ID
 * @body roleId int
 * @body active boolean
 */
router.post(
  '/:userId(\\d+)/role',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('roleId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('active').isBoolean()
  ],
  handleValidationErrors(),
  handleModelOperation(UsersRoles, 'create', req => {
    const { userId } = req.params;
    const { roleId, active } = req.body;

    log.info(`add role to user ${userId}`);
    return [
      {
        userId,
        roleId,
        active: active || true
      }
    ];
  })
);
/**
 * PUT Update User's Role
 * @param userId int
 * @param roleId int
 * @body active boolean
 */
router.put(
  '/:userId(\\d+)/role/:roleId(\\d+)',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('roleId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    body('active').isBoolean()
  ],
  handleValidationErrors(),
  handleModelOperation(UsersRoles, 'update', req => {
    const { userId, roleId } = req.params;
    const { active } = req.body;

    log.info(`update user ${userId} role ${roleId}`);
    return [
      {
        active
      },
      {
        where: {
          userId,
          roleId
        }
      }
    ];
  })
);

/**
 * DELETE Remove User's Role
 * @param userId int
 * @param roleId int
 */
router.delete(
  '/:userId(\\d+)/role/:roleId(\\d+)',
  authenticate(),
  [
    param('userId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt(),
    param('roleId')
      .isNumeric()
      .isInt({ min: 1 })
      .toInt()
  ],
  handleValidationErrors(),
  handleModelOperation(UsersRoles, 'destroy', req => {
    const { userId, roleId } = req.params;

    log.info(`delete from role ${roleId} from user ${userId}`);
    return [
      {
        where: {
          userId,
          roleId
        }
      }
    ];
  })
);

router.get('/current', authenticate(), async (req, res) => {
  try {
    res.type('application/json');
    res.json(req.user);
  } catch (error) {
    log.error(error.message);
    res.status(500).send(error.message);
  }
});

/**
 * GET User Info by Username
 * @param userName string
 */
router.get(
  '/:name',
  authenticate(),
  [param('name').isString()],
  handleValidationErrors(),
  handleModelOperation(UserProfile, 'findOne', req => {
    const { name } = req.params;

    log.info(`request for username ${name}`);
    return [
      {
        where: {
          name
        },
        include: [
          {
            model: User,
            required: true
          }
        ]
      }
    ];
  })
);

export default router;
