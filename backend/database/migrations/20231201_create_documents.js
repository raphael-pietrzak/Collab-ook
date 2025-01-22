export function up(knex) {
  return knex.schema.createTable('documents', (table) => {
    table.increments('id').primary();
    table.text('content').defaultTo('');
    table.timestamp('lastUpdated').defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable('documents');
}
