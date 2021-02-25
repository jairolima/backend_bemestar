module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('blockdays', 'doctor_ids', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn('blockdays', 'doctor_ids');
  },
};
