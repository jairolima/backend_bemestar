import Sequelize, { Model } from 'sequelize';

class Doctor extends Model {
  static init(sequelize) {
    super.init(
      {
        specialty: Sequelize.STRING,
        crm: Sequelize.STRING,
        mon: Sequelize.STRING,
        tue: Sequelize.STRING,
        wed: Sequelize.STRING,
        thu: Sequelize.STRING,
        fri: Sequelize.STRING,
        sat: Sequelize.STRING,
        sun: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Doctor;
