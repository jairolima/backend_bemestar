import Sequelize, { Model } from 'sequelize';

class Block extends Model {
  static init(sequelize) {
    super.init(
      {
        days: Sequelize.STRING,
        doctor_ids: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'blockdays'
      }
    );

    return this;
  }
}

export default Block;
