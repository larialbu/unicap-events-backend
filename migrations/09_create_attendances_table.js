exports.up = function(knex) {
    return knex.schema.createTable('attendances', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').inTable('users');
      table.integer('sub_event_id').unsigned().notNullable();
      table.foreign('sub_event_id').references('id').inTable('sub_events');
      table.dateTime('checkin_time').notNullable();
      table.dateTime('checkout_time').nullable();
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('attendances');
  };