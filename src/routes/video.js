import { Router } from 'express';

import * as videoController from '@/controllers/video';
import * as videoValidations from '@/routes/validations/video';
import { isAuthenticated, validate } from '@/middleware';
import commentsRouter from './comment'; // Adjust the path as necessary


const router = Router();

router.route('/signed-urls')
  .post(videoController.getSignedUrls);

router.get('/most-watched', validate(videoValidations.listVideosRules), videoController.getMostWatchedVideos);
router.get('/top-videos-by-categories', videoController.getTopVideosByCategory);
router.get('/top-categories', videoController.getTopCategoriesRoute);
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

router.route('/:id/view', isAuthenticated, validate(videoValidations.getVideoRules))
  .post(videoController.addView);

router.route('/:id/like', isAuthenticated, validate(videoValidations.getVideoRules))
  .post(videoController.likeVideo)
  .delete(videoController.unlikeVideo);

router.use('/:videoId/comment', isAuthenticated, validate(videoValidations.getVideoIdRules), commentsRouter);

export default router;
