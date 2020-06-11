module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('doctors', 'mon', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('doctors', 'tue', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('doctors', 'wed', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('doctors', 'thu', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('doctors', 'fri', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('doctors', 'sat', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('doctors', 'sun', {
        type: Sequelize.STRING,
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('doctors', 'mon'),
      queryInterface.removeColumn('doctors', 'tue'),
      queryInterface.removeColumn('doctors', 'wed'),
      queryInterface.removeColumn('doctors', 'thu'),
      queryInterface.removeColumn('doctors', 'fri'),
      queryInterface.removeColumn('doctors', 'sat'),
      queryInterface.removeColumn('doctors', 'sun'),
    ]);
  },
};
