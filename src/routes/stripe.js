import { Router } from 'express';

import * as stripeController from '@/controllers/stripe';
import * as stripeValidations from '@/routes/validations/stripe';
import { validate } from '@/middleware';

const router = Router();

router.post(
  '/create-video-payment-intent/',
  validate(stripeValidations.stripeContentRules),
  stripeController.createVideoPaymentIntent,
);

router.post('/webhook', stripeController.webhook);


export default router;
