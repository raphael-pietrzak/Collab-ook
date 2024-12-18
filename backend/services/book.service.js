const Book = require('../models/book.model');
const Chapter = require('../models/chapter.model');

exports.createBook = (bookData) => Book.create(bookData);
exports.getAllBooks = () => Book.findAll();
exports.getBookById = (id) => Book.findByPk(id);
exports.updateBook = (id, bookData) => Book.update(bookData, { where: { id } });
exports.deleteBook = (id) => Book.destroy({ where: { id } });
exports.createChapter = (chapterData) => Chapter.create(chapterData);