module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('videos', 'description', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('videos', 'description', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
