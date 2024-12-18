const express = require('express');
const bookController = require('../controllers/book.controller');
const chapterController = require('../controllers/chapter.controller');


const router = express.Router();

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

router.post('/:id/chapters', bookController.createChapter);
router.get('/:id/chapters', chapterController.getAllChapters);  





module.exports = router;