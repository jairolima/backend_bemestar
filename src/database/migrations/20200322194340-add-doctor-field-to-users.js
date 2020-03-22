module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'doctor_id', {
      type: Sequelize.INTEGER,
      references: { model: 'doctors', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'doctor_id');
  },
};
