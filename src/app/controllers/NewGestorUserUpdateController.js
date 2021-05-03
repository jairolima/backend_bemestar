import * as Yup from 'yup';
import File from '../models/File';
import User from '../models/User';

class NewGestorUserUpdateController {

  async update(req, res) {
    const schema = Yup.object().shape({
      userId: Yup.number(),
      name: Yup.string(),
      email: Yup.string().email(),
      phone: Yup.string().min(8),
      password_hash: Yup.string().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

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
      email,
      avatar,
      provider,
      phone,
      password_hash,
    });
  }
}

export default new NewGestorUserUpdateController();
