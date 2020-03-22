module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('doctors', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      specialty: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      crm: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('doctors');
  },
};
