export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('videos', 'duration');
    await queryInterface.addColumn('videos', 'duration', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn('videos', 'width', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn('videos', 'height', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn('videos', 'frameCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn('videos', 'aspectRatio', {
      type: Sequelize.STRING,
      defaultValue: '',
    });
    await queryInterface.removeColumn('videos', 'noOfFrame');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('videos', 'duration');
    await queryInterface.removeColumn('videos', 'width');
    await queryInterface.removeColumn('videos', 'height');
    await queryInterface.removeColumn('videos', 'frameCount');
    await queryInterface.removeColumn('videos', 'aspectRatio');
    await queryInterface.addColumn('videos', 'noOfFrame', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },
};
