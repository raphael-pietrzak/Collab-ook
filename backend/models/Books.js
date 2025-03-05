import db from '../config/database.js';

export default {
    findAll: () => db('books').select('*'),
    create: (data) => db('books').insert(data).returning('*')
};
