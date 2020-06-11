import { Op } from 'sequelize';
import User from '../models/User';
import File from '../models/File';
import Doctor from '../models/Doctor';

class ProviderController {
  async index(req, res) {
    const providers = await Doctor.findAll({
      // where provider: true / trocado para id dos providers que eu quero
      // producao where: { id: ['11', '4', '5', '13', '10', '9', '3', '34'] },
      // dev where: { id: ['5', '3'] },
      where: {
        [Op.or]: {
          mon: {
            [Op.not]: '',
          },
          tue: {
            [Op.not]: '',
          },
          wed: {
            [Op.not]: '',
          },
          thu: {
            [Op.not]: '',
          },
          fri: {
            [Op.not]: '',
          },
          sat: {
            [Op.not]: '',
          },
          sun: {
            [Op.not]: '',
          },
        },
      },
      attributes: ['crm', 'specialty'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'phone', 'email', 'avatar_id'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(providers);
  }
}

export default new ProviderController();
