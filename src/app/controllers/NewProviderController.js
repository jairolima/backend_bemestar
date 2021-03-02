import User from '../models/User';

class NewProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: {
        provider: true
      },
      attributes: ['id', 'name'],
    });

    return res.json(providers);
  }
}

export default new NewProviderController();
