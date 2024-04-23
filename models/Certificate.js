const { Model } = require('objection');

class Certificate extends Model {
  static get tableName() {
    return 'certificates';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'sub_event_id', 'verification_code'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        sub_event_id: { type: 'integer' },
        created_at: { type: 'string', format: 'date-time', default: () => new Date().toISOString() },
        verification_code: { type: 'string', unique: true },
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
          from: 'certificates.user_id',
          to: 'users.id',
        },
      },
      subEvent: {
        relation: Model.BelongsToOneRelation,
        modelClass: SubEvent,
        join: {
          from: 'certificates.sub_event_id',
          to: 'sub_events.id',
        },
      },
    };
  }
}

module.exports = Certificate;