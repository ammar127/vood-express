export default {

  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('videos', 'transaction_id', {
      type: Sequelize.STRING, // Adjust the data type according to your requirements
      allowNull: true, // Set to false if transaction_id is required for every video
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('videos', 'transaction_id');
  },
};
