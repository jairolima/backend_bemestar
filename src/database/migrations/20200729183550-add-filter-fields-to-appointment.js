module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('appointments', 'filter', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('appointments', 'price', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('appointments', 'health_insurance', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('appointments', 'confirmed', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('appointments', 'showed_up', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('appointments', 'description', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('appointments', 'payment_option', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('appointments', 'recepcionist', {
        type: Sequelize.STRING,
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('appointments', 'filter'),
      queryInterface.removeColumn('appointments', 'price'),
      queryInterface.removeColumn('appointments', 'health_insurance'),
      queryInterface.removeColumn('appointments', 'confirmed'),
      queryInterface.removeColumn('appointments', 'showed_up'),
      queryInterface.removeColumn('appointments', 'description'),
      queryInterface.removeColumn('appointments', 'payment_option'),
      queryInterface.removeColumn('appointments', 'recepcionist'),
    ]);
  },
};
