import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      // where provider: true / trocado para id dos providers que eu quero
      // producao where: { id: ['11', '4', '5', '13', '10', '9', '3', '34'] },
      // dev where: { id: ['5', '3'] },
      where: { id: ['11', '4', '5', '13', '10', '9', '3', '34'] },
      attributes: ['id', 'name', 'phone', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(providers);
  }
}

export default new ProviderController();
