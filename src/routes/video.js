import { Router } from 'express';

import * as videoController from '@/controllers/video';
import * as videoValidations from '@/routes/validations/video';
import { isAuthenticated, validate } from '@/middleware';

const router = Router();

router.route('/signed-urls')
  .post(videoController.getSignedUrls);
router.route('/')
  // .get(isAuthenticated, validate(tweetValidations.listTweetsRules), tweetController.getTweets)
  .post(validate(videoValidations.createVideoRules), videoController.createVideo);

// router.route('/:id')
//   .get(cache('Tweet', 'req.params.id'), tweetController.getTweetById)
//   .delete(isAuthenticated, tweetController.deleteTweet);

export default router;
