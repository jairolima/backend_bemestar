module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'phone', {
      type: Sequelize.DOUBLE,
      defaultValue: 88888888,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'phone');
  },
};
