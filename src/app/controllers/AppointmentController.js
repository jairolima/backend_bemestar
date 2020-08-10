/* eslint-disable consistent-return */
import * as Yup from 'yup';
import { parseISO, isBefore, format, subHours } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
// import Notification from '../schemas/Notification';
// import Doctor from '../models/Doctor';

// import CancellationMail from '../jobs/CancellationMail';
// import Queue from '../../lib/Queue';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    const formate = appointments.map(appointment => {
      const { date, id, past, cancelable, provider, name } = appointment;

      return {
        id,
        past,
        cancelable,
        provider,
        name,
        date: format(date, "d 'de' MMMM HH:mm"),
      };
    });

    return res.json(formate);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date, filter } = req.body;

    /**
     * Check if provider_id is a provider
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointment with providers' });
    }

    /**
     * Check for past dates
     */
    const hourStart = parseISO(date);

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /**
     * Check date availiability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    // Find doctor
    // const { crm } = await Doctor.findOne({
    //   where: { user_id: provider_id },
    // });

    // if (crm === null) {
    //   return res.status(200).json({ message: 'Provider crm is null' });
    // }

    function thePrice() {
      switch (filter) {
        case 'Cardiologista':
          return 0;
        case 'Clinico Geral':
          return 0;
        case 'Dermatologista':
          return 0;
        case 'Endocrinologista':
          return 0;
        case 'Fonoaudióloga':
          return 0;
        case 'Gastroenterologista':
          return 0;
        case 'Geriatra':
          return 0;
        case 'Ginecologista':
          return 0;
        case 'Medicina do trabalho':
          return 0;
        case 'Medicina Integ. e Longevidade':
          return 0;
        case 'Ortopedista':
          return 0;
        case 'Otorrino':
          return 0;
        case 'Pediatra':
          return 0;
        case 'Psicóloga':
          return 0;
        case 'Psiquiatra':
          return 0;
        case 'Reumatologista':
          return 0;
        case 'Ultrassonografista':
          return 0;
        case 'Urologista':
          return 0;
        case 'Holter':
          return 150;
        case 'Ecocardiograma':
          return 150;
        case 'Eletrocardiograma':
          return 50;
        case 'Peeling':
          return 80;
        case 'Blefaroplastia':
          return 2500;
        case 'Retirada cisto':
          return 200;
        case 'Retirada lipoma':
          return 200;
        case 'Retirada sinais':
          return 80;
        case 'Audiometria tonal':
          return 25;
        case 'Audiometria vocal':
          return 25;
        case 'Avaliação e terapia de linguagem oral e escrita':
          return 70;
        case 'Terapia de voz':
          return 70;
        case 'Motricidade orofacial e disfagia':
          return 80;
        case 'Colposcopia':
          return 180;
        case 'Citológico':
          return 50;
        case 'Biopsia colo útero':
          return 250;
        case 'Lavagem cada ouvido':
          return 30;
        case 'Raio X geral':
          return 60;
        case 'Raio X de coluna lombar completa':
          return 150;
        case 'Abdomen superior':
          return 0;
        case 'Abdomen total':
          return 0;
        case 'Cervical/Pescoço':
          return 0;
        case 'Doppler de carótidas e vertebrais':
          return 0;
        case 'Doppler de membro inferior (Ambos)':
          return 0;
        case 'Doppler de membro inferior (Um membro)':
          return 0;
        case 'Inguinal bilateral':
          return 0;
        case 'Inguinal':
          return 0;
        case 'Mamaria':
          return 0;
        case 'Morfologica':
          return 0;
        case 'Obstétrica':
          return 0;
        case 'Obstétrica com doppler':
          return 0;
        case 'Obstétrica gemelar com doppler':
          return 0;
        case 'Pequenas partes':
          return 0;
        case 'Transvaginal com doppler':
          return 0;
        case 'Pelvica':
          return 0;
        case 'Prostata pelvica':
          return 0;
        case 'Tireoide com doppler':
          return 0;
        case 'Translucencia nucal':
          return 0;
        case 'Transvaginal':
          return 0;
        case 'Vias urinarias':
          return 0;
        default:
          break;
      }
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
      filter,
      price: thePrice(),
    });

    /**
     * Notify appointment provider
     */
    // const user = await User.findByPk(req.userId);
    // const formattedDate = format(
    //   hourStart,
    //   "'dia' dd 'de' MMMM', às' H:mm'h'",
    //   { locale: pt }
    // );

    // await Notification.create({
    //   content: `Novo agendamento de ${user.name} para ${formattedDate}`,
    //   user: provider_id,
    // });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    // await Queue.add(CancellationMail.key, {
    //   appointment,
    // });

    return res.json(appointment);
  }
}

export default new AppointmentController();
