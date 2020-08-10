/* eslint-disable prefer-destructuring */
import { startOfDay, format } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';

class AllappointmentController {
  async index(req, res) {
    const today = new Date();
    const searchDate = Number(today);

    const allappointments = await Appointment.findAll({
      where: {
        canceled_at: null,
        date: {
          [Op.gt]: startOfDay(searchDate),
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
      } = appointment;
      const username = appointment.user.name;
      const password_hash = appointment.user.password_hash;
      const phone = appointment.user.phone;
      const providername = appointment.provider.name;

      return {
        ID: id,
        Cliente: username,
        Prestador: providername,
        Data: format(date, "d 'de' MMMM HH:mm"),
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
      };
    });

    const rows = formate;

    return res.json({
      rows,
    });
  }

  async update(req, res) {
    const { id } = req.body;

    const appointment = await Appointment.findByPk(id);

    await appointment.update(req.body);

    return res.json({ message: 'success' });
  }
}

export default new AllappointmentController();
