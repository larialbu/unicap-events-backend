const { Model } = require('objection');

class Submission extends Model {
  static get tableName() {
    return 'submissions';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'work_title', 'description', 'archive'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        sub_event_id: { type: ['integer', 'null'] },
        work_title: { type: 'string' },
        description: { type: 'string' },
        archive: { type: 'binary' },
        submission_date: { type: 'string', format: 'date-time', default: () => new Date().toISOString() },
        status: { type: 'string', default: 'Pending' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
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
          from: 'submissions.user_id',
          to: 'users.id',
        },
      },
      subEvent: {
        relation: Model.BelongsToOneRelation,
        modelClass: SubEvent,
        join: {
          from: 'submissions.sub_event_id',
          to: 'sub_events.id',
        },
      },
    };
  }
}

module.exports = Submission;