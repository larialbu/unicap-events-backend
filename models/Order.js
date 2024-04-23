const { Model } = require('objection');

class Order extends Model {
  static get tableName() {
    return 'orders';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'ticket_id', 'total_value', 'payment_method', 'status_payment'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        ticket_id: { type: 'integer' },
        total_value: { type: 'number' },
        payment_method: { type: 'string', default: 'Boleto' },
        status_payment: { type: 'string', enum: ['Pendente', 'Pago', 'Cancelado'] },
        payment_at: { type: ['string', 'null'], format: 'date-time' },
        code: { type: 'string', unique: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  static get relationMappings() {
    const User = require('./User');
    const Ticket = require('./Ticket');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'orders.user_id',
          to: 'users.id',
        },
      },
      ticket: {
        relation: Model.BelongsToOneRelation,
        modelClass: Ticket,
        join: {
          from: 'orders.ticket_id',
          to: 'tickets.id',
        },
      },
    };
  }
}

module.exports = Order;