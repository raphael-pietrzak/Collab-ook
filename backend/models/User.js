
import db from '../config/database.js';

export default {
  findByUsername: (username) => db('users').where('username', username).first(),
  create: (data) => db('users').insert(data).returning('*'),
};