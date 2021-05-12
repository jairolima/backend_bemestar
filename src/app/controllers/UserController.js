import * as Yup from 'yup';
import File from '../models/File';
import User from '../models/User';
import axios from 'axios';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required().trim(),
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
      where: { password_hash: req.body.password_hash },
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


    try {
      axios.get(
        `https://api.dr.help/message?number=55${phone.replace(/\D/gim, '')}&message=*Lembrete Bem Estar*%0a%0a*Bella:* Olá _${name}_, o seu cadastro foi realizado com sucesso no site de agendamentos da policlínica bem estar, agora você pode acessar pelo link: https://agenda.policlinicabemestar.com e aceder com seu número de telefone e cpf&token=${process.env.ZAP_TOKEN}`
      );
      axios.get(
        `https://api.dr.help/message?number=5583988736747&message=*Lembrete Bem Estar*%0a%0a*Bella:* Olá _${name}_, o seu cadastro foi realizado com sucesso no site de agendamentos da policlínica bem estar, agora você pode acessar pelo link: https://agenda.policlinicabemestar.com e aceder com seu número de telefone e cpf&token=${process.env.ZAP_TOKEN}`
      );
    } catch (error) {
      console.log('nao enviou msg zap')
    }

    // axios.get(
    //   `https://api.dr.help/message?number=558391389448&message=*Lembrete Bem Estar*%0a%0a*Bella:* Olá _${name}_, o seu cadastro foi realizado com sucesso no site de agendamentos da policlínica bem estar, agora você pode acessar pelo link: https://agenda.policlinicabemestar.com e aceder com seu número de telefone e cpf&token=${process.env.ZAP_TOKEN}`
    // );


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

export default new UserController();
