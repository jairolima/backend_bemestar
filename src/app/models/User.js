import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING,
          validate: {
            notEmpty: {
              msg: 'The field cannot be empty',
            },
          },
        },

        email: Sequelize.STRING,

        password_hash: {
          type: Sequelize.STRING,
          validate: {
            notEmpty: {
              msg: 'The field cannot be empty',
            },
          },
        },

        provider: Sequelize.BOOLEAN,

        phone: {
          type: Sequelize.STRING,
          validate: {
            len: [8, 16],
            notEmpty: {
              msg: 'The field cannot be empty',
            },
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
    this.belongsTo(models.Doctor, { foreignKey: 'doctor_id', as: 'doctor' });
  }
}

export default User;
