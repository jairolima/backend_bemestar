import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';

class QuantityappointmentController {
  async index(req, res) {
    const today = new Date();
    const searchDate = Number(today);

    const quantityappointments = await Appointment.findAndCountAll({
      where: {
        canceled_at: null,
        date: {
          [Op.gt]: startOfDay(searchDate),
        },
      },
      attributes: ['id'],
    });

    const dailyappointments = await Appointment.findAndCountAll({
      where: {
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
      attributes: [],
    });

    const quantityusers = await User.findAndCountAll({
      where: {
        provider: false,
      },
      attributes: [],
    });

    const quantityproviders = await User.findAndCountAll({
      where: {
        provider: true,
      },
      attributes: [],
    });

    const numusers = quantityusers.count;
    const numdaily = dailyappointments.count;
    const numproviders = quantityproviders.count;
    const numappointments = quantityappointments.count;

    return res.json({ numdaily, numusers, numproviders, numappointments });
  }
}

export default new QuantityappointmentController();
