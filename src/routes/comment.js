import { Router } from 'express';
import * as commentController from '@/controllers/comment';
import * as commentValidations from '@/routes/validations/comment';
import { isAuthenticated, validate } from '@/middleware';

const commentsRouter = Router({ mergeParams: true });

commentsRouter.route('/')
  .post(validate(commentValidations.createCommentRules), commentController.createComment)
  .get(commentController.getComments);

commentsRouter.route('/:commentId')
  .get(validate(commentValidations.getCommentRules), commentController.getCommentById)
  .delete(isAuthenticated, validate(commentValidations.getCommentRules), commentController.deleteComment)
  .patch(isAuthenticated, validate(commentValidations.updateCommentRules), commentController.updateComment);

export default commentsRouter;
