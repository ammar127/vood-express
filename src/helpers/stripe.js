import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const createSessionURLProduct = async ({
  duration, framesCount, email, id,
}) => {
  let product;
  let quantity = 1;

  if (duration <= 60) {
    [product] = (await stripe.products.search({
      query: 'active:\'true\' AND metadata[\'maxDuration\']:\'60\'',
    })).data; // 1 mint
  } else if (duration <= 180) {
    [product] = (await stripe.products.search({
      query: 'active:\'true\' AND metadata[\'minDuration\']:\'61\' AND metadata[\'maxDuration\']:\'180\'',
    })).data; // 1 to 3 mints
  } else {
    [product] = (await stripe.products.search({
      query: 'active:\'true\' AND metadata[\'minDuration\']:\'181\'',
    })).data; // 3+ mints
    quantity = Math.ceil(framesCount); // Quantity based on frames
  }

  const price = await stripe.prices.retrieve(product.default_price);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: price.id,
        quantity,
      },
    ],
    customer_email: email,
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${process.env.CLIENT_ORIGIN}/payment?transaction_id={CHECKOUT_SESSION_ID}&success=true`,
    cancel_url: `${process.env.CLIENT_ORIGIN}/payment?transaction_id={CHECKOUT_SESSION_ID}&cancel=true`,
    client_reference_id: id,
  });

  return session.url;
};

export const createAccount = async (email) => {
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  return account.id;
};

export const createAccountLink = async (accountID) => {
  const accountLink = await stripe.accountLinks.create({
    account: accountID,
    refresh_url: `${process.env.CLIENT_ORIGIN}/profile`,
    return_url: `${process.env.CLIENT_ORIGIN}/profile`,
    type: 'account_onboarding',
  });

  return accountLink.url;
};

export default stripe;
