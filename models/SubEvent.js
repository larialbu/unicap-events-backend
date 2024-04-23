const { Model } = require('objection');

class SubEvent extends Model {
  static get tableName() {
    return 'sub_events';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'description', 'start_date', 'end_date', 'event_id', 'quantity'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'string' },
        start_date: { type: 'string', format: 'date-time' },
        end_date: { type: 'string', format: 'date-time' },
        event_id: { type: 'integer' },
        value: { type: ['number', 'null'] },
        quantity: { type: 'integer' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  static get relationMappings() {
    const Event = require('./Event');

    return {
      event: {
        relation: Model.BelongsToOneRelation,
        modelClass: Event,
        join: {
          from: 'sub_events.event_id',
          to: 'events.id',
        },
      },
    };
  }
}

module.exports = SubEvent;