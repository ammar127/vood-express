import { Router } from 'express';

import * as videoController from '@/controllers/video';
import * as videoValidations from '@/routes/validations/video';
import { isAuthenticated, validate } from '@/middleware';

const router = Router();

router.route('/signed-urls')
  .post(videoController.getSignedUrls);

router.get('/most-watched', validate(videoValidations.listVideosRules), videoController.getMostWatchedVideos);
router.get('/latest', validate(videoValidations.listVideosRules), videoController.getLatestVideos);
router.get('/search', validate(videoValidations.listVideosRules), videoController.searchVideos);
router.get('/feed', validate(videoValidations.listVideosRules), videoController.getFeed);
router.get('/library', validate(videoValidations.listVideosRules), videoController.getLibrary);
router.get('/recommended', validate(videoValidations.listVideosRules), videoController.getRecommendedVideos);
router.get('/related/:id', validate(videoValidations.relatedVideosRules), videoController.getRelatedVideos);

router.route('/')
  .post(validate(videoValidations.createVideoRules), videoController.createVideo);

router.route('/:id', validate(videoValidations.getVideoRules))
  .get(videoController.getVideoById)
  .delete(isAuthenticated, videoController.deleteVideo);

router.route('/:id/views', isAuthenticated, validate(videoValidations.getVideoRules))
  .post(videoController.addView);

router.route('/:id/like', isAuthenticated, validate(videoValidations.getVideoRules))
  .post(videoController.likeVideo)
  .delete(videoController.unlikeVideo);

export default router;
