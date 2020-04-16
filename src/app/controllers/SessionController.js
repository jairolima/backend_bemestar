import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import File from '../models/File';
import authConfig from '../../config/auth';
import Doctor from '../models/Doctor';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      phone: Yup.string().required(),
      password_hash: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { phone, password_hash } = req.body;

    const user = await User.findOne({
      where: { password_hash },
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

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const pass = await User.findOne({
      where: { password_hash: req.body.password_hash, phone: req.body.phone },
    });
    if (!pass.password_hash) {
      return res.status(401).json({ error: 'User not found' });
    }

    const { id, name, email, avatar, doctor, provider } = user;

    return res.json({
      user: {
        id,
        name,
        phone,
        email,
        provider,
        avatar,
        doctor,
        password_hash,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
