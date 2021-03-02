/* eslint-disable prefer-destructuring */
import User from '../models/User';

class NewAllUsersController {
  async index(req, res) {

    if (req.params.token != process.env.GENERAL_TOKEN) {
      return res.status(400).json({ error: 'Invalid env token' });
    }

    const allusers = await User.findAll({
      where: {
        provider: false
      },
      attributes: [
        'id',
        'name',
        'phone',
        'password_hash',
      ],
    });
    // .map to format every single date
    const formate = allusers.map(item => {
      const {
        id,
        name,
        phone,
        password_hash,
      } = item;

      return {
        id: id,
        Nome: name,
        Telefone: phone,
        CPF: password_hash,
      };
    });

    return res.json(formate);
  }

}
export default new NewAllUsersController();
