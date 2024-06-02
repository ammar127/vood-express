const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Dislike extends Model {
    static associate(models) {
      Dislike.belongsTo(models.Video, { foreignKey: 'videoId' });
    }
  }
  Dislike.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    videoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Dislike',
  });
  return Dislike;
};
