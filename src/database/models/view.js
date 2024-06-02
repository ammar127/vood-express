const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class View extends Model {
    static associate(models) {
      View.belongsTo(models.Video, { foreignKey: 'videoId' });
    }
  }
  View.init({
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
    modelName: 'View',
  });
  return View;
};
