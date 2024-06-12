import db from '@/database';
import { pageNumber, pageSize } from '@/constant';

export const createComment = async (req, res, next) => {
  const { content } = req.body;
  const { videoId } = req.params;
  const { id: userId } = req.user;

  try {
    const comment = await db.models.comment.create({
      content,
      videoId,
      userId,
    });

    return res.status(201).json({ comment });
  } catch (error) {
    return next(error);
  }
};

export const getComments = async (req, res, next) => {
  const { videoId } = req.params;
  const {
    page = pageNumber,
    perPage = pageSize,
  } = req.query;
  try {
    const { count, rows: comments } = await db.models.comment.findAndCountAll({
      include: [
        {
          model: db.models.user,
          required: true,
        },
      ],
      where: { videoId: +videoId },
      limit: perPage,
      offset: (page - 1) * perPage,
      subQuery: false,
    });

    const response = {
      comments,
      count,
      hasMore: count > page * perPage,
    };

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

export const getCommentById = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    const comment = await db.models.comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    return res.status(200).json({ comment });
  } catch (error) {
    return next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { id: userId } = req.user;
  try {
    const comment = await db.models.comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'You are not allowed to delete this comment' });
    }
    await comment.destroy();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

export const updateComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const { id: userId } = req.user;

  try {
    const comment = await db.models.comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'You are not allowed to update this comment' });
    }
    await comment.update({ content });
    return res.status(200).json({ comment });
  } catch (error) {
    return next(error);
  }
};
