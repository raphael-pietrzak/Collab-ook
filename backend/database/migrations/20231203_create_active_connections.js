export function up(knex) {
  return knex.schema.createTable('active_connections', (table) => {
    table.increments('id').primary();
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.integer('document_id').references('id').inTable('documents').onDelete('CASCADE');
    table.string('socket_id').notNullable();
    table.integer('cursor_position').defaultTo(0);
    table.integer('cursor_line').defaultTo(0);
    table.integer('cursor_column').defaultTo(0);
    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable('active_connections');
}
