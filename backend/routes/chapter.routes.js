const express = require('express');
const chapterController = require('../controllers/chapter.controller');

const router = express.Router({ mergeParams: true });


router.get('/', chapterController.getAllChapters);
router.get('/:chapterId', chapterController.getChapterById);
router.post('/', chapterController.createChapter);
router.put('/:chapterId', chapterController.updateChapter);
router.delete('/:chapterId', chapterController.deleteChapter);

module.exports = router;