import Sequelize, { Model } from 'sequelize';

class Doctor extends Model {
  static init(sequelize) {
    super.init(
      {
        specialty: Sequelize.STRING,
        crm: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Doctor;
