exports.up = function(knex) {
  return knex.schema.createTable('certificates', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').inTable('users');
    table.integer('sub_event_id').unsigned();
    table.foreign('sub_event_id').references('id').inTable('sub_events');
    table.datetime('created_at').defaultTo(knex.fn.now());
    table.string('verification_code').notNullable().unique();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('certificates');
};
