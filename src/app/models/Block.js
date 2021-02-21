import Sequelize, { Model } from 'sequelize';

class Block extends Model {
  static init(sequelize) {
    super.init(
      {
        blockdays: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Block;
