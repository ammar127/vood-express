module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'username', {
      type: Sequelize.STRING(50),
      allowNull: true, // Temporarily allow null
      unique: true,
    });

    // Copy email to username
    await queryInterface.sequelize.query(`
      UPDATE users
      SET username = email
    `);

    // Set username to not null
    await queryInterface.changeColumn('users', 'username', {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    });

    await queryInterface.addColumn('users', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'cover', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
    await queryInterface.addColumn('users', 'stripe_customer_id', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'stripe_account_linked_id', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'stripe_subscription_id', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'subscription_fee', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'username');
    await queryInterface.removeColumn('users', 'image');
    await queryInterface.removeColumn('users', 'cover');
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.removeColumn('users', 'status');
    await queryInterface.removeColumn('users', 'stripe_customer_id');
    await queryInterface.removeColumn('users', 'stripe_account_linked_id');
    await queryInterface.removeColumn('users', 'stripe_subscription_id');
    await queryInterface.removeColumn('users', 'subscription_fee');
  },
};
