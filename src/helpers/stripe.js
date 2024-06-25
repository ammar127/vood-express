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

export const createAccount = async ({
  id,
  email,
  firstName,
  lastName,
}) => {
  const account = await stripe.accounts.create({
    type: 'standard',
    email,
    business_type: 'individual',
    individual: {
      first_name: firstName,
      last_name: lastName,
      email,
    },
    business_profile: {
      mcc: '5815', // Merchant Category Code
      url: 'https://www.voodvr.co/',
    },
    metadata: {
      id,
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

export const createOrUpdateProductPrice = async ({
  sellerAccountId,
  price = null,
  priceId = null,
  productId = null,
}) => {
  let updatedProductId = productId;
  let updatedPriceId = priceId;

  if (!productId) {
    const product = await stripe.products.create({
      name: 'VoodVR Channel Subscription',
      type: 'service',
      metadata: {
        sellerAccountId,
      },
    }, {
      stripeAccount: sellerAccountId,
    });
    updatedProductId = product.id;
  }

  if (priceId) {
    await stripe.prices.update(priceId, {
      unit_amount: price * 100,
    }, {
      stripeAccount: sellerAccountId,
    });
  } else {
    const updatedPrice = await stripe.prices.create({
      unit_amount: price * 100,
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      product: updatedProductId,
    }, {
      stripeAccount: sellerAccountId,
    });
    updatedPriceId = updatedPrice.id;
  }
  return { updatedProductId, updatedPriceId };
};

export default stripe;
