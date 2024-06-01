import { body } from 'express-validator';

export const stripeContentRules = [
  body('videoDuration').isNumeric().exists(),
  body('videoFrames').isNumeric().exists(),
];

export const stripePaymentRules = [
  body('paymentMethod').exists(),
  body('paymentIntentId').exists(),
];
