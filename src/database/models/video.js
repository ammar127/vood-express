const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    static associate(models) {
      Video.belongsTo(models.User, { foreignKey: 'userId' });
      Video.hasMany(models.Like, { foreignKey: 'videoId' });
      Video.hasMany(models.Dislike, { foreignKey: 'videoId' });
      Video.hasMany(models.View, { foreignKey: 'videoId' });
    }
  }
  Video.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categories: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    fileKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    convertedFileKey: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    thumbnailKey: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    visibility: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    playerType: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    noOfFrame: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isConvert: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Video',
  });
  return Video;
};
