/* eslint-disable eqeqeq */
import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const { providerId } = req.params;

    if (providerId == 9) {
      const schedule = [
        '08:00',
        '08:15',
        '08:30',
        '08:45',
        '09:00',
        '09:15',
        '09:30',
        '09:45',
        '10:00',
        '10:15',
        '10:30',
        '10:45',
        '11:00',
        '11:15',
        '11:30',
        '11:45',
        '12:00',
        '12:15',
        '12:30',
        '12:45',
        '13:00',
      ];

      const avaiable = schedule.map(time => {
        const [hour, minute] = time.split(':');
        const value = setSeconds(
          setMinutes(setHours(searchDate, hour), minute),
          0
        );

        return {
          time,
          value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
          avaiable:
            isAfter(value, new Date()) &&
            !appointments.find(a => format(a.date, 'HH:mm') === time),
        };
      });

      return res.json(avaiable);
    }

    const schedule = [
      '08:00', // 2018-06-23 07:00:00 time zone change
      '08:20',
      '08:40',
      '09:00',
      '09:20',
      '09:40',
      '10:00',
      '10:20',
      '10:40',
      '11:00',
      '11:20',
      '11:40',
      '12:00',
      '12:20',
      '12:40',
      '13:00',
    ];

    const avaiable = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        avaiable:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time),
      };
    });

    return res.json(avaiable);
  }
}

export default new AvailableController();
