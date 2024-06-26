exports.up = function(knex) {
  return knex.schema.createTable('tickets', function(table) {
    table.increments('id').primary();
    table.integer('event_id').unsigned();
    table.foreign('event_id').references('id').inTable('events');
    table.integer('sub_event_id').unsigned().notNullable();
    table.foreign('sub_event_id').references('id').inTable('sub_events');
    table.string('status').notNullable();
    // table.enum('status', ['reservado', 'aguardando pagamento', 'disponivel']);
    table.string('codigo_ingresso').unique();
    table.datetime('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tickets');
};
