/* eslint-disable prefer-destructuring */
// import { stripeHelper } from '@/helpers';
import Stripe from 'stripe';
import { startConversion } from './video';
import { updateStripeEnabled } from './auth';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


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

export const webhook = async (req, res) => {
  const event = req.body;
  // console.log('🚀 ~ webhook ~ event.data.object:', event.data.object);
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('🚀 ~ webhook ~ paymentIntent:', paymentIntent.client_reference_id);

      await startConversion(+paymentIntent.client_reference_id);

      // Handle successful payment here
      break;
    }
    case 'account.updated': {
      const account = event.data.object;
      console.log('Account is successfully linked:', account.id, account.charges_enabled);
      if (account.charges_enabled) {
        await updateStripeEnabled(account.id);
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};
