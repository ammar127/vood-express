import { body, param } from 'express-validator';

export const createCommentRules = [
  body('content').exists().withMessage('Text is required').isString()
    .withMessage('Text must be a string'),
];
export const getCommentRules = [
  param('commentId').exists().withMessage('Comment ID is required').isInt(),
];
export const updateCommentRules = [
  body('content').exists().withMessage('Text is required').isString()
    .withMessage('Text must be a string'),
  param('commentId').exists().withMessage('Comment ID is required').isInt(),

];
