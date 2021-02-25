
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('blockdays', 'blockdays', 'days', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn('blockdays', 'days');
  },
};
