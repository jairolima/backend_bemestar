import User from '../models/User';

class NewGestorUserUpdateController {

  async update(req, res) {

    if (req.params.token != process.env.GENERAL_TOKEN) {
      return res.status(400).json({ error: 'Invalid env token' });
    }

    const user = await User.findByPk(req.params.id);

    await user.update({
      name: req.body.name,
      phone: req.body.phone,
      password_hash: req.body.password_hash
    });

    return res.json(req.body);
  }
}

export default new NewGestorUserUpdateController();
