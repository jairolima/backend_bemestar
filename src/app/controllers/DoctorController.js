import * as Yup from 'yup';

import Doctor from '../models/Doctor';
import User from '../models/User';

class DoctorController {
  async update(req, res) {
    const schema = Yup.object().shape({
      specialty: Yup.string(),
      crm: Yup.string().min(3),
      user_id: Yup.string(),
      mon: Yup.string(),
      tue: Yup.string(),
      wed: Yup.string(),
      thu: Yup.string(),
      fri: Yup.string(),
      sat: Yup.string(),
      sun: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const user = await User.findByPk(req.userId);

    const doctorExists = await Doctor.findOne({
      where: { user_id: user.id },
    });

    if (doctorExists) {
      // Update doctor

      await doctorExists.update(req.body);

      // Find doctor
      const {
        specialty,
        crm,
        mon,
        tue,
        wed,
        thu,
        fri,
        sat,
        sun,
      } = await Doctor.findOne({
        where: { user_id: user.id },
      });
      // Response doctor
      return res
        .json({
          specialty,
          crm,
          mon,
          tue,
          wed,
          thu,
          fri,
          sat,
          sun,
        })
        .status(200)
        .json({ message: 'Doctor Exist Update' });
    }

    // const { specialty, crm, user_id } = await Doctor.create({
    //   user_id: req.userId,
    //   crm: req.body,
    //   specialty: req.body,
    // });

    const {
      specialty,
      crm,
      user_id,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      sun,
    } = await Doctor.create(req.body);

    return res
      .json({
        specialty,
        crm,
        user_id,
        mon,
        tue,
        wed,
        thu,
        fri,
        sat,
        sun,
      })
      .status(200)
      .json({ message: 'Doctor Doesnt Exist, Im Creating' });
  }
}

export default new DoctorController();
