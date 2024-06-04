import { DataTypes, Model } from 'sequelize';


export default function (sequelize) {
  class Dislike extends Model {
    static associate(models) {
      Dislike.belongsTo(models.video, { foreignKey: 'videoId' });
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
    modelName: 'dislike',
    paranoid: false,
  });
  return Dislike;
}
