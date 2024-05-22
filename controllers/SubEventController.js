const knex = require('../database/knex');

// Criar um novo SubEvent
exports.createSubEvent = async (req, res) => {
  const { name, description, startDate, endDate, eventId, value, quantity } = req.body;

  try {
    const [id] = await knex('sub_events').insert({
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      event_id: eventId,
      value,
      quantity,
    });

    const subEvent = await knex('sub_events').where('id', id).first();
    res.status(201).json(subEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obter todos os SubEvents
exports.getAllSubEvents = async (req, res) => {
  try {
    const subEvents = await knex('sub_events').select('*');
    res.json(subEvents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obter um SubEvent por ID
exports.getSubEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const subEvent = await knex('sub_events').where('id', id).first();
    if (!subEvent) {
      return res.status(404).json({ message: 'SubEvent não encontrado' });
    }
    res.json(subEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Atualizar um SubEvent
exports.updateSubEvent = async (req, res) => {
  const { id } = req.params;
  const { name, description, startDate, endDate, eventId, value, quantity } = req.body;

  try {
    const subEvent = await knex('sub_events').where('id', id).first();
    if (!subEvent) {
      return res.status(404).json({ message: 'SubEvent não encontrado' });
    }

    await knex('sub_events')
      .where('id', id)
      .update({
        name,
        description,
        start_date: startDate,
        end_date: endDate,
        event_id: eventId,
        value,
        quantity,
      });

    res.json({ message: 'SubEvent atualizado com sucesso' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Excluir um SubEvent
exports.deleteSubEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const subEvent = await knex('sub_events').where('id', id).first();
    if (!subEvent) {
      return res.status(404).json({ message: 'SubEvent não encontrado' });
    }

    await knex('sub_events').where('id', id).del();
    res.json({ message: 'SubEvent excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};