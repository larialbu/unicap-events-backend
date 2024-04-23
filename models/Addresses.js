const { Model } = require('objection');

class Address extends Model {
  static get tableName() {
    return 'addresses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['sub_event_id', 'block', 'room'],
      properties: {
        id: { type: 'integer' },
        sub_event_id: { type: 'integer' },
        block: { type: 'string' },
        room: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  static get relationMappings() {
    const SubEvent = require('./SubEvent');

    return {
      subEvent: {
        relation: Model.BelongsToOneRelation,
        modelClass: SubEvent,
        join: {
          from: 'addresses.sub_event_id',
          to: 'sub_events.id',
        },
      },
    };
  }
}

module.exports = Address;