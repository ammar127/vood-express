import { body, query } from 'express-validator';

export const listVideosRules = [
  query('page').optional().isInt().toInt(),
  query('perPage').optional().isInt().toInt(),
];

export const createVideoRules = [

  body('title').exists().withMessage('Title is required').isString()
    .withMessage('Title must be a string'),
  body('categories').isArray().withMessage('Categories must be an array')
    .custom((value) => {
      if (!value.every((item) => typeof item === 'string')) {
        throw new Error('Categories must be an array of strings');
      }
      if (value.length < 1) {
        throw new Error('At least one category is required');
      }
      return true;
    }),
  body('fileKey').exists().withMessage('File key is required').isString()
    .withMessage('File key must be a string'),
  body('thumbnailKey').optional().isString().withMessage('Thumbnail key must be a string'),
  body('visibility').optional().isInt().withMessage('Visibility must be an integer'),
  body('playerType').optional().isInt().withMessage('Player type must be an integer'),
  body('description').exists().withMessage('Description is required').isString()
    .withMessage('Description must be a string'),
  body('duration').optional().isInt().withMessage('Duration must be an integer'),
  body('frameCount').optional().isInt().withMessage('Number of frames must be an integer'),
  body('width').optional().isInt().withMessage('Width must be an integer'),
  body('height').optional().isInt().withMessage('Height must be an integer'),
  body('aspectRatio').optional().isString().withMessage('Aspect ratio must be a string'),


];
