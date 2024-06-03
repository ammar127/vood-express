import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
  class Video extends Model {
    static associate(models) {
      Video.belongsTo(models.user, { foreignKey: 'userId' });
      Video.hasMany(models.like, { foreignKey: 'videoId' });
      Video.hasMany(models.dislike, { foreignKey: 'videoId' });
      Video.hasMany(models.view, { foreignKey: 'videoId' });
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
    width: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    height: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    frameCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    aspectRatio: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    isConvert: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: 'video',
  });
  return Video;
}
