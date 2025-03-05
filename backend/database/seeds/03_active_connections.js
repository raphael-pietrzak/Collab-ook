export async function seed(knex) {
  // Supprime toutes les connexions existantes
  await knex('active_connections').del();
  
  // Récupère les IDs des utilisateurs et documents existants
  const users = await knex('users').select('id');
  const documents = await knex('documents').select('id');
  
  // Crée quelques connexions de test
  await knex('active_connections').insert([
    {
      user_id: users[0].id,
      document_id: 1,
      socket_id: 'test-socket-1',
      cursor_position: 0,
      cursor_line: 0,
      cursor_column: 0
    },
    {
      user_id: users[1].id,
      document_id: 1,
      socket_id: 'test-socket-2',
      cursor_position: 10,
      cursor_line: 1,
      cursor_column: 5
    }
  ]);
}
