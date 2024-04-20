exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('addresses').del()
    .then(function () {
      // Inserts seed entries
      return knex('addresses').insert([
        { sub_event_id: 1, block: 'A', floor: '202' },
        { sub_event_id: 2, block: 'B', floor: '303' },
        // Adicione mais endereços falsos aqui, se necessário
      ]);
    });
};
