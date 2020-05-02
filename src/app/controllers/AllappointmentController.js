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
      attributes: ['date'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
        {
          model: User,
          as: 'provider',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });

    const formate = allappointments.map(appointment => {
      const { date } = appointment;
      const username = appointment.user.name;
      const providername = appointment.provider.name;

      return {
        username,
        providername,
        date: format(date, "d 'de' MMMM HH:mm"),
      };
    });

    const rows = formate;

    return res.json({
      columns: [
        {
          label: 'Usuario',
          field: 'username',
          sort: 'asc',
          width: 250,
        },
        {
          label: 'Servico',
          field: 'providername',
          sort: 'asc',
          width: 250,
        },
        {
          label: 'Data',
          field: 'date',
          sort: 'asc',
          width: 320,
        },
      ],
      rows,
    });
  }
}

export default new AllappointmentController();
