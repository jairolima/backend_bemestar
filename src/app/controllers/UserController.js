import * as Yup from 'yup';
import File from '../models/File';
import User from '../models/User';
import Doctor from '../models/Doctor';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      password_hash: Yup.string()
        .required()
        .min(6),
      phone: Yup.string()
        .required()
        .min(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const {
      id,
      name,
      email,
      provider,
      phone,
      password_hash,
    } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
      phone,
      password_hash,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
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
      doctor,
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
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'specialty', 'crm'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
      doctor,
      provider,
      phone,
      password_hash,
    });
  }
}

export default new UserController();
