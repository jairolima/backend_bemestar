/* eslint-disable no-console */
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
import Doctor from '../models/Doctor';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);

    // consulta pra verificar se o horario ta disponivel
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const weekday = new Date(searchDate).getDay();

    // return res.status(200).json({ message: weekday });

    // Find doctor
    const { mon, tue, wed, thu, fri, sat, sun } = await Doctor.findOne({
      where: { user_id: req.params.providerId },
    });

    // function that returns the day to search in find doctor
    function myweekday() {
      switch (weekday) {
        case 0:
          return sun;
        case 1:
          return mon;
        case 2:
          return tue;
        case 3:
          return wed;
        case 4:
          return thu;
        case 5:
          return fri;
        case 6:
          return sat;
        default:
          break;
      }
      return null;
    }

    // converting string from data base to an array
    const array = Array.from(myweekday().split(','));

    const avaiable = array.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      try {
        return {
          time,
          value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
          avaiable:
            isAfter(value, new Date()) &&
            !appointments.find(a => format(a.date, 'HH:mm') === time),
        };
      } catch (error) {
        return {
          time: 'Atendimento',
          value: 'error',
          avaiable: false,
        };
      }
    });

    return res.json(avaiable);
  }
}

export default new AvailableController();
