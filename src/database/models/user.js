import { compare, hash } from 'bcrypt';
import { DataTypes, Model } from 'sequelize';

import { tokenHelper, mailHelper } from '@/helpers';

export default function (sequelize) {
  class User extends Model {
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }

    generateToken(expiresIn = '1y') {
      const data = { id: this.id, email: this.email };
      return tokenHelper.generateToken(data, expiresIn);
    }

    validatePassword(plainPassword) {
      return compare(plainPassword, this.password);
    }

    sendMail(mail) {
      const payload = { ...mail, to: `${this.fullName} <${this.email}>` };
      return mailHelper.sendMail(payload);
    }

    static associate(models) {
      User.hasMany(models.tweet, { foreignKey: 'userId' });
      User.hasMany(models.video, { foreignKey: 'userId' });
      User.hasMany(models.like, { foreignKey: 'userId' });
      User.hasMany(models.dislike, { foreignKey: 'userId' });
      User.hasMany(models.view, { foreignKey: 'userId' });
      User.hasMany(models.comment, { foreignKey: 'userId' });
    }
  }

  User.init({
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    stripe_customer_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stripe_account_linked_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stripe_subscription_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscription_fee: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  }, {
    modelName: 'user',
    sequelize,
    paranoid: false,
  });

  User.addHook('beforeSave', async (instance) => {
    if (instance.changed('password')) {
      // eslint-disable-next-line no-param-reassign
      instance.password = await hash(instance.password, 10);
    }
  });

  User.addHook('afterCreate', (instance) => {
    // Send welcome message to user.
    const payload = {
      subject: 'Welcome to VoodVR',
      html: 'Your account is created successfully!',
    };
    instance.sendMail(payload);
  });

  User.addHook('afterDestroy', (instance) => {
    // Send good by message to user.
    const payload = {
      subject: 'Sorry to see you go',
      html: 'Your account is destroyed successfully!',
    };
    instance.sendMail(payload);
  });

  return User;
}
