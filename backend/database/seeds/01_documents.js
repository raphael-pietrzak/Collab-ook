export async function seed(knex) {
  // Supprime toutes les entrées existantes
  await knex('documents').del();
  
  // Insère des documents de test
  await knex('documents').insert([
    {
      content: 'Document test 1',
      lastUpdated: new Date()
    },
    {
      content: 'Document test 2',
      lastUpdated: new Date()
    }
  ]);
}
