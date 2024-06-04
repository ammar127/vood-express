import { getSignedUrl } from '@/helpers/s3Client';
import db from '@/database';
import { createSessionURLProduct } from '@/helpers/stripe';
import { pageNumber, pageSize } from '@/constant';
import sequelize, { Op } from 'sequelize';

export const getSignedUrls = async (req, res, next) => {
  const {
    videoName, videoFileType, thumbnailName, thumbnailFileType,
  } = req.body;
  const videoKey = `${Date.now()}-${videoName}`;
  const thumbnailKey = `${Date.now()}-${thumbnailName}`;
  try {
    const videoSignedUrl = await getSignedUrl(videoKey, videoFileType);
    const thumbnailSignedUrl = await getSignedUrl(thumbnailKey, thumbnailFileType);
    return res.json({
      videoSignedUrl, thumbnailSignedUrl, videoKey, thumbnailKey,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /video
 * Create video request
 */
export const createVideo = async (req, res, next) => {
  try {
    const userId = 1;

    const videoData = { ...req.body, userId };

    const video = await db.models.video.create(videoData);

    const redirectUrl = await createSessionURLProduct({
      duration: video.duration,
      framesCount: video.framesCount,
      email: 'ammar@mailinator.com',
      id: video.id,
    });

    return res.status(201).json({ redirectUrl, video });
  } catch (err) {
    console.log('🚀 ~ createVideo ~ err:', err);
    return next(err);
  }
};

export const getMostWatchedVideos = async (req, res, next) => {
  const { page = pageNumber, perPage = pageSize } = req.query;

  try {
    const videos = await db.models.video.findAll({
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('views.id')), 'viewsCount'],
        ],
      },
      include: [
        {
          model: db.models.view,
          attributes: [],
          required: false,
        },
      ],
      group: ['video.id'],
      order: [[sequelize.literal('COUNT(views.id)'), 'DESC']],
      limit: perPage,
      offset: page * perPage - perPage,
      subQuery: false,
    });
    return res.json(videos);
  } catch (error) {
    return next(error);
  }
};
export const getLatestVideos = async (req, res, next) => {
  const { page = pageNumber, perPage = pageSize } = req.query;
  try {
    const videos = await db.models.video.findAll({
      order: [['createdAt', 'DESC']],
      limit: perPage,
      offset: page * perPage - perPage,
    });
    return res.json(videos);
  } catch (error) {
    return next(error);
  }
};

export const searchVideos = async (req, res, next) => {
  const { page = pageNumber, perPage = pageSize, searchTerm } = req.query;

  try {
    let whereClause = {};

    if (searchTerm) {
      whereClause = {
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    }

    const videos = await db.models.video.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: perPage,
      offset: (page - 1) * perPage,
    });
    return res.json(videos);
  } catch (error) {
    return next(error);
  }
};

export const getFeed = async (req, res, next) => {
  const { page = pageNumber, perPage = pageSize, searchTerm } = req.query; // Set default values for page and perPage

  try {
    let whereClause = {}; // Initialize an empty object for the where clause

    // If searchTerm is provided, add a condition to filter records based on the searchTerm
    if (searchTerm) {
      whereClause = {
        // Add conditions to search in specific columns, adjust as per your schema
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
          // Add more conditions as needed for other columns
        ],
      };
    }

    const videos = await db.models.video.findAll({
      where: whereClause, // Apply the where clause for filtering based on searchTerm
      order: [['createdAt', 'DESC']],
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    return res.json(videos);
  } catch (error) {
    return next(error);
  }
};

export const getLibrary = async (req, res, next) => {
  const {
    page = pageNumber,
    perPage = pageSize,
    searchTerm,
    status,
  } = req.query;

  try {
    const userId = req.user.id; // Assuming user ID is available in the request object

    let whereClause = { userId }; // Filter videos by userId

    // If searchTerm is provided, add conditions to search in specific columns
    if (searchTerm) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
          // Add more conditions as needed for other columns
        ],
      };
    }

    // If status is provided, filter videos by status
    if (status) {
      whereClause = {
        ...whereClause,
        status: +status,
      };
    }

    const videos = await db.models.video.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    return res.json(videos);
  } catch (error) {
    return next(error);
  }
};

export const getRecommendedVideos = async (req, res, next) => {
  try {
    const numberOfRecommendedVideos = 10; // Specify the number of recommended videos you want to fetch

    // Retrieve recommended videos using a basic random selection approach
    const recommendedVideos = await db.models.video.findAll({
      order: sequelize.random(), // Order randomly
      limit: numberOfRecommendedVideos, // Limit the number of recommended videos
    });

    return res.json(recommendedVideos);
  } catch (error) {
    return next(error);
  }
};


export const getRelatedVideos = async (req, res, next) => {
  const { id: videoId } = req.params;

  try {
    // Retrieve the categories of the specified video
    const { categories } = await db.models.video.findByPk(videoId, {
      attributes: ['categories'],
    });

    // If categories are found
    if (categories && categories.length > 0) {
      const numberOfRelatedVideos = 10; // Specify the number of related videos you want to fetch

      // Retrieve related videos with similar categories
      const relatedVideos = await db.models.video.findAll({
        where: {
          id: { [Op.ne]: videoId }, // Exclude the current video
          categories: { [Op.overlap]: categories }, // Find videos with overlapping categories
        },
        order: sequelize.random(), // Order randomly
        limit: numberOfRelatedVideos, // Limit the number of related videos
      });

      return res.json(relatedVideos);
    }
    // If no categories are found for the video
    return res.status(404).json({ message: 'Video categories not found' });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /tweets/:id
 * Get tweet by id
 */
export const getVideoById = async (req, res, next) => {
  try {
    const { id: videoId } = req.params;

    const video = await db.models.video.findByPk(videoId, {
      attributes: {
        include: [
          [
            sequelize.fn('COUNT', sequelize.literal('DISTINCT views.id')),
            'viewsCount',
          ],
          [
            sequelize.fn('COUNT', sequelize.literal('DISTINCT likes.id')),
            'likesCount',
          ],
        ],
      },
      include: [
        {
          model: db.models.like,
          attributes: [],
          required: false,
        },
        {
          model: db.models.view,
          attributes: [],
          required: false,
        },
        {
          model: db.models.user,
          required: true,
        },
      ],
      group: ['video.id', 'user.id'],
      subQuery: false,
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    let meLiked = null;
    let meDisliked = null;

    if (req.user) {
      const userLike = await db.models.like.findOne({
        where: {
          userId: req.user.id,
          videoId,
        },
      });

      meLiked = userLike ? userLike.liked : null;

      const userDisliked = await db.models.dislike.findOne({
        where: {
          userId: req.user.id,
          videoId,
        },
      });

      meDisliked = userDisliked ? userDisliked.disliked : null;
    }


    // Construct the response object
    const response = {
      ...JSON.parse(JSON.stringify(video)),
      // views: video.views[0] ? video.views[0].viewCount : 0,
      // likeCount: video.likes[0] ? video.Likes[0].likeCount : 0,
      // commentCount: video.Comments ? video.Comments.commentCount : 0,
      meLiked,
      meDisliked,
    };

    return res.json(response);
  } catch (error) {
    return next(error);
  }
};


/**
 * DELETE /video/:id
 * Delete video request
 */
export const deleteVideo = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: videoId } = req.params;

    // Find the video by its ID and user ID
    const video = await db.models.video.findOne({
      where: {
        id: videoId,
        userId,
      },
    });

    // If the video is found
    if (video) {
      // Delete the video
      await video.destroy();

      return res.status(204).send(); // Send success response with status code 204 (No Content)
    }
    // If the video is not found or not associated with the current user
    return res.status(404).json({ message: 'Video not found or not authorized to delete' });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /video/:id/views
 * Add view to video
 */
export const addView = async (req, res, next) => {
  try {
    const { id: videoId } = req.params;
    const video = await db.models.video.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await db.models.view.create({
      userId: req.user.id,
      videoId,
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /video/:id/like
 * Like video
 */
export const likeVideo = async (req, res, next) => {
  try {
    const { id: videoId } = req.params;
    const video = await db.models.video.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await db.models.like.create({
      userId: req.user.id,
      videoId,
    });
    await db.models.dislike.destroy({
      where: {
        userId: req.user.id,
        videoId,
      },
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

/**
 * DELETE /video/:id/like
 * Unlike video
 */
export const unlikeVideo = async (req, res, next) => {
  try {
    const { id: videoId } = req.params;
    const video = await db.models.video.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await db.models.dislike.create({
      userId: req.user.id,
      videoId,
    });

    await db.models.like.destroy({
      where: {
        userId: req.user.id,
        videoId,
      },
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
