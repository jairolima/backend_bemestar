/* eslint-disable prefer-destructuring */
import * as Yup from 'yup';
import Filter from '../models/Filter';

class FilterController {

  async store(req, res) {
    const schema = Yup.object().shape({
      filter: Yup.string().required().min(1),
      price: Yup.string().required().min(1),
      commission: Yup.string().required().min(1),
      prerequisite: Yup.string().required().min(1)
    });

    if (req.body.token != process.env.GENERAL_TOKEN) {
      return res.status(400).json({ error: 'Invalid env token' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      filter,
      price,
      commission,
      prerequisite
    } = await Filter.create(req.body);

    return res.json({
      filter,
      price,
      commission,
      prerequisite
    });
  }

  async update(req, res) {

    //run env
    if (req.body.token != process.env.GENERAL_TOKEN) {
      return res.status(400).json({ error: 'Invalid env token' });
    }

    const filterId = await Filter.findByPk(req.params.id);

    const filter = await Filter.findOne({
      where: { id: filterId.id },
    });

    await filter.update({
      filter: req.body.filter,
      price: req.body.price,
      commission: req.body.commission,
      prerequisite: req.body.prerequisite
    });

    return res.json({
      filter: req.body.filter,
      price: req.body.price,
      commission: req.body.commission,
      prerequisite: req.body.prerequisite
    });
  }

  async delete(req, res) {

    if (req.body.token != process.env.GENERAL_TOKEN) {
      return res.status(400).json({ error: 'Invalid env token' });
    }

    const filterId = await Filter.findByPk(req.params.id);

    const filter = await Filter.findOne({
      where: { id: filterId.id },
    });

    await filter.destroy();

    return res.json({ message: 'success' });
  }

  async index(req, res) {

    const filters = await Filter.findAll({
      attributes: ['id', 'filter', 'price', 'commission', 'prerequisite'],
      order: ['createdAt']
    });

    return res.json(filters);
  }
}

export default new FilterController();
