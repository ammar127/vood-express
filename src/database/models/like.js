import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.video, { foreignKey: 'videoId' });
    }
  }
  Like.init({
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
    modelName: 'like',
  });
  return Like;
}
