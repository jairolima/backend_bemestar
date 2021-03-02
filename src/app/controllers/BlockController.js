/* eslint-disable prefer-destructuring */
import * as Yup from 'yup';
import Block from '../models/Block';

class BlockController {

  async index(req, res) {

    const blockdays = await Block.findAll({
      attributes: ['id', 'days', 'doctor_ids'],
      order: ['createdAt']
    });

    return res.json(blockdays);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      days: Yup.string().required().min(1),
      doctor_ids: Yup.string()
    });

    if (req.body.token != process.env.GENERAL_TOKEN) {
      return res.status(400).json({ error: 'Invalid env token' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      days,
      doctor_ids,
    } = await Block.create(req.body);

    return res.json({
      days,
      doctor_ids,
    });
  }

  async update(req, res) {

    //run env
    if (req.body.token != process.env.GENERAL_TOKEN) {
      return res.status(400).json({ error: 'Invalid env token' });
    }

    const blockId = await Block.findByPk(req.params.id);

    const block = await Block.findOne({
      where: { id: blockId.id },
    });

    await block.update({
      days: req.body.days,
      doctor_ids: req.body.doctor_ids,
    });

    return res.json({
      days: req.body.days,
      doctor_ids: req.body.doctor_ids,
    });
  }

  async delete(req, res) {

    if (req.params.token != process.env.GENERAL_TOKEN) {
      return res.status(400).json({ error: 'Invalid env token' });
    }

    const blockId = await Block.findByPk(req.params.id);

    const block = await Block.findOne({
      where: { id: blockId.id },
    });

    await block.destroy();

    return res.json({ message: 'success' });
  }


}

export default new BlockController();
