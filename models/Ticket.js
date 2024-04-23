const { Model } = require('objection');

class Ticket extends Model {
  static get tableName() {
    return 'tickets';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'sub_event_id', 'status', 'codigo_ingresso'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        sub_event_id: { type: 'integer' },
        status: { type: 'string' },
        codigo_ingresso: { type: 'string', unique: true },
        created_at: { type: 'string', format: 'date-time', default: () => new Date().toISOString() },
      },
    };
  }

  static get relationMappings() {
    const User = require('./User');
    const SubEvent = require('./SubEvent');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tickets.user_id',
          to: 'users.id',
        },
      },
      subEvent: {
        relation: Model.BelongsToOneRelation,
        modelClass: SubEvent,
        join: {
          from: 'tickets.sub_event_id',
          to: 'sub_events.id',
        },
      },
    };
  }
}

module.exports = Ticket;