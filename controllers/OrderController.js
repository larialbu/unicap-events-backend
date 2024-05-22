const knex = require('../database/knex');

// Criar um novo pedido
exports.createOrder = async (req, res) => {
  const { userId, ticketIds, totalValue, paymentMethod, statusPayment } = req.body;

  try {
    const [orderId] = await knex('orders').insert({
      user_id: userId,
      ticket_ids: JSON.stringify(ticketIds), // Armazenando o array como string JSON
      total_value: totalValue,
      payment_method: paymentMethod,
      status_payment: statusPayment,
    });

    const order = await knex('orders').where('id', orderId).first();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obter todos os pedidos
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await knex('orders').select('*');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obter um pedido por ID
exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await knex('orders').where('id', id).first();
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    // Converter a string JSON de ticket_ids de volta para um array
    order.ticket_ids = JSON.parse(order.ticket_ids);

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Atualizar um pedido
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { userId, ticketIds, totalValue, paymentMethod, statusPayment, paymentAt, code } = req.body;

  try {
    const order = await knex('orders').where('id', id).first();
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    await knex('orders')
      .where('id', id)
      .update({
        user_id: userId,
        ticket_ids: JSON.stringify(ticketIds), // Armazenando o array como string JSON
        total_value: totalValue,
        payment_method: paymentMethod,
        status_payment: statusPayment,
        payment_at: paymentAt,
        code,
      });

    res.json({ message: 'Pedido atualizado com sucesso' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Excluir um pedido
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await knex('orders').where('id', id).first();
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    await knex('orders').where('id', id).del();
    res.json({ message: 'Pedido excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};