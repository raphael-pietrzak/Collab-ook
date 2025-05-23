import bcrypt from 'bcrypt';

export async function seed(knex) {
  await knex('users').del();
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await knex('users').insert([
    {
      username: 'user1',
      email: 'user1@example.com',
      password: hashedPassword
    },
    {
      username: 'user2',
      email: 'user2@example.com',
      password: hashedPassword
    }
  ]);
}
