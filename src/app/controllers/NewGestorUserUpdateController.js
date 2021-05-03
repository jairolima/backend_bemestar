import * as Yup from 'yup';
import File from '../models/File';
import User from '../models/User';

class NewGestorUserUpdateController {

  async update(req, res) {

    if (req.params.token != process.env.GENERAL_TOKEN) {
      return res.status(400).json({ error: 'Invalid env token' });
    }

    const schema = Yup.object().shape({
      userId: Yup.number(),
      name: Yup.string(),
      phone: Yup.string().min(8),
      password_hash: Yup.string().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const user = await User.findByPk(req.userId);

    await user.update(req.body);

    const {
      id,
      name,
      avatar,
      phone,
      provider,
      password_hash,
    } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      avatar,
      provider,
      phone,
      password_hash,
    });
  }
}

export default new NewGestorUserUpdateController();
