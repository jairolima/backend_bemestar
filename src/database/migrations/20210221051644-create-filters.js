module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('filters', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      filter: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      commission: {
        type: Sequelize.STRING,
        allowNull: false,
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
    return queryInterface.dropTable('filters');
  },
};
