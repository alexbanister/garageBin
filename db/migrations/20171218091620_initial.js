
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('employees', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('position');
      table.string('email');
      table.string('phone');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('employees_projects')
  ]);
};
