/* eslint-disable prefer-destructuring */
// import { stripeHelper } from '@/helpers';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_WEBHOOK_ACCOUNTS_SECRET = process.env.STRIPE_WEBHOOK_ACCOUNTS_SECRET;
const STRIPE_EVENT_TYPES = {
  PAYMENT_INTENT: 'payment_intent.succeeded',
  ACCOUNT_LINKED: 'account.application.authorized',
};


/**
 * POST /stripe/create-payment-intent
 * Create payment intent
 */
export const createVideoPaymentIntent = async (req, res, next) => {
  try {
    const { videoDuration, videoFrames } = req.body;

    let product;
    let quantity = 1;

    if (videoDuration <= 60) {
      [product] = (await stripe.products.search({
        query: 'active:\'true\' AND metadata[\'maxDuration\']:\'60\'',
      })).data; // 1 mint
    } else if (videoDuration <= 180) {
      [product] = (await stripe.products.search({
        query: 'active:\'true\' AND metadata[\'minDuration\']:\'61\' AND metadata[\'maxDuration\']:\'180\'',
      })).data; // 1 to 3 mints
    } else {
      [product] = (await stripe.products.search({
        query: 'active:\'true\' AND metadata[\'minDuration\']:\'181\'',
      })).data; // 3+ mints
      quantity = Math.ceil(videoFrames); // Quantity based on frames
    }

    const price = await stripe.prices.retrieve(product.default_price);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount * quantity,
      currency: price.currency,
    });

    res.json({ clientSecret: paymentIntent.client_secret, amount: paymentIntent.amount, ...paymentIntent });
  } catch (err) {
    next(err);
  }
};

export const webhook = async (req, res, next) => {
  console.log('🚀 ~ webhook ~ req, res, next:', req, res, next);

  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const eventData = event.data.object;
  console.log('🚀 ~ webhook ~ eventData:', eventData);
  console.log('🚀 ~ webhook ~ event.type:', event.type);
  res.json({ received: true });


  try {
    // switch (event.type) {
    //   case STRIPE_EVENT_TYPES.PAYMENT_INTENT:
    //     const paymentMethod = event.data.object;
    //     break;

    //   default:
    //     break;
    // }
    res.json({ received: true });
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  res.status(200).end();
};

export const accountsWebhook = async (req, res, next) => {
  console.log('🚀 ~ webhook ~ req, res, next:', req, res, next);
  res.json({ received: true });
};
