import Sequelize, { Model } from 'sequelize';

class Filter extends Model {
  static init(sequelize) {
    super.init(
      {
        filter: Sequelize.STRING,
        price: Sequelize.STRING,
        commission: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Filter;
