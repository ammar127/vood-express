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
    success_url: `${process.env.CLIENT_ORIGIN}/add?success=true`,
    cancel_url: `${process.env.CLIENT_ORIGIN}/add?canceled=true`,
    client_reference_id: id,
  });

  return session.url;
};

export default stripe;
