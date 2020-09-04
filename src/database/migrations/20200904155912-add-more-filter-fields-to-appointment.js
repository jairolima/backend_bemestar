module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('appointments', 'commission', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('appointments', 'discount', {
        type: Sequelize.STRING,
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('appointments', 'commission'),
      queryInterface.removeColumn('appointments', 'discount'),
    ]);
  },
};
