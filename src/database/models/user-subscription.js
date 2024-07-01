import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
  class UserSubscription extends Model {
    static associate(models) {
      UserSubscription.belongsTo(models.user, { as: 'subscriber', foreignKey: 'subscriberId' });
      UserSubscription.belongsTo(models.user, { as: 'channel', foreignKey: 'channelId' });
    }
  }

  UserSubscription.init({
    subscriberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    channelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    priceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stripeTransactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'userSubscription',
    tableName: 'user_subscriptions',
    // timestamps: true,
  });


  return UserSubscription;
}
