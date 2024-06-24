import { body, param } from 'express-validator';

export const loginRules = [
  body('email').isEmail().exists(),
  body('password').exists(),
];

export const googleRules = [
  body('token').exists(),
];

export const facebookRules = [
  body('firstName').exists(),
  body('lastName').exists(),
  body('email').isEmail().exists(),
];

export const registerRules = [
  body('firstName').exists(),
  body('lastName').exists(),
  body('email').isEmail().exists(),
  body('password').isLength({ min: 6 }).exists(),
];

export const updateProfileRules = [
  body('firstName').optional(),
  body('lastName').optional(),
  body('email').isEmail().optional(),
];

export const changePasswordRules = [
  body('current').exists()
    .withMessage('Current password is required.'),
  body('password').exists().withMessage('Password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
];


export const refreshTokenRules = [
  body('refreshToken').exists(),
];

export const getUserRules = [
  param('username').exists()
    .withMessage('username is required.'),
];
