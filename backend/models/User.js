
import db from '../config/database.js';

export default {
  findByUsername: (username) => db('users').where('username', username).first(),
  create: (data) => db('users').insert(data).returning('*'),
  findByEmail: (email) => db('users').where('email', email).first(),
  findByUsernameOrEmail: (login) => db('users').where('username', login).orWhere('email', login).first()
};