export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('videos', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    title: {
      type: Sequelize.STRING,
    },
    categories: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    fileKey: {
      type: Sequelize.STRING,
    },
    convertedFileKey: {
      type: Sequelize.STRING,
    },
    thumbnailKey: {
      type: Sequelize.STRING,
    },
    visibility: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    playerType: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    description: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    progress: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    duration: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    noOfFrame: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    isConvert: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deletedAt: {
      allowNull: true,
      type: Sequelize.DATE,
    },
  });
  await queryInterface.createTable('likes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    videoId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'videos',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
  await queryInterface.createTable('dislikes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    videoId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'videos',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
  await queryInterface.createTable('views', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    videoId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'videos',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('views');
  await queryInterface.dropTable('dislikes');
  await queryInterface.dropTable('likes');
  await queryInterface.dropTable('videos');
};
