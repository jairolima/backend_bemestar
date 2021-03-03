/* eslint-disable prefer-destructuring */
import { startOfDay, format, endOfDay } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';

class NewDrAppointmentController {
  async index(req, res) {

    if (req.params.token != process.env.GENERAL_TOKEN) {
      return res.status(400).json({ error: 'Invalid env token' });
    }

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 86400000)

    const allappointments = await Appointment.findAll({
      where: {
        provider_id: req.params.id,
        date: {
          [Op.between]: [startOfDay(tomorrow), endOfDay(tomorrow)],
        },
      },
      attributes: [
        'date',
        'filter',
        'id',
        'price',
        'health_insurance',
        'showed_up',
        'confirmed',
        'payment_option',
        'description',
        'recepcionist',
        'discount',
        'commission',
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'password_hash', 'phone'],
        },
        {
          model: User,
          as: 'provider',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });
    // .map to format every single date
    const formate = allappointments.map(appointment => {
      const {
        date,
        filter,
        id,
        price,
        health_insurance,
        showed_up,
        confirmed,
        payment_option,
        description,
        recepcionist,
        discount,
        commission,
      } = appointment;
      const username = appointment.user.name;
      const password_hash = appointment.user.password_hash;
      const phone = appointment.user.phone;
      const providername = appointment.provider.name;

      return {
        ID: id,
        Cliente: username,
        Prestador: providername,
        Data: format(date, "'dia' dd 'de' MMMM', às ' HH:mm'h'", {
          locale: pt,
        }),
        CPF: password_hash,
        Telefone: phone,
        Filtro: filter,
        Preço: price,
        Plano: health_insurance,
        Compareceu: showed_up,
        Confirmou: confirmed,
        Pagamento: payment_option,
        Descrição: description,
        Recepcionista: recepcionist,
        Desconto: discount,
        Comissão: commission,
      };
    });

    const rows = formate;

    return res.json({
      rows,
    });
  }
}

export default new NewDrAppointmentController();
