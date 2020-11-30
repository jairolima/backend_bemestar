/* eslint-disable prefer-destructuring */

import Appointment from '../models/Appointment';

class WhatsappConfirmationController {
  async update(req, res) {
    const { bookingId } = req.body;

    const appointment = await Appointment.findByPk(bookingId);

    await appointment.update({
      confirmed: req.body.confirmed,
    });

    return res.json({ message: 'success' });
  }
}

export default new WhatsappConfirmationController();
