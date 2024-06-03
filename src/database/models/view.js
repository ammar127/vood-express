import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
  class View extends Model {
    static associate(models) {
      View.belongsTo(models.video, { foreignKey: 'videoId' });
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
    modelName: 'view',
  });
  return View;
}
