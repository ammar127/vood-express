import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.user, { foreignKey: 'userId' });
      Comment.belongsTo(models.video, { foreignKey: 'videoId' });
    }
  }

  Comment.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
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
    modelName: 'comment', // Ensure modelName is 'comment' (singular)
    paranoid: false,
    tableName: 'comment', // Explicitly specify the table name if different from modelName
  });

  return Comment;
}
