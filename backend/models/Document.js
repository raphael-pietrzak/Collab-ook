import db from '../config/database.js';

export default {
  findAll: () => db('documents').select('*'),
  findByPk: (id) => db('documents').where('id', id).first(),
  create: (data) => db('documents').insert(data).returning('*'),
  update: (id, data) => db('documents').where('id', id).update(data)
};
