import authRouter from '@/routes/auth';
import indexRouter from '@/routes/index';
import tweetRouter from '@/routes/tweet';
import stripeRouter from '@/routes/stripe';
import videoRouter from '@/routes/video';

export default function (app) {
  app.use('/', indexRouter);
  app.use('/auth', authRouter);
  app.use('/tweets', tweetRouter);
  app.use('/stripe', stripeRouter);
  app.use('/video', videoRouter);
}
