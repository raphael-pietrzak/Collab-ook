const Chapter = require('../models/chapter.model');



exports.createChapter = async (req, res) => {
    try {
        const { title, book_id } = req.body;
        const chapter = await Chapter.create({ title, book_id, created_at: new Date() });
        res.status(201).json(chapter);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create chapter' });
    }
}


exports.getChapterById = async (req, res) => {
    try {
        const chapter = await Chapter.findByPk(req.params.chapterId);
        if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
        res.json(chapter);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chapter' });
    }
}

exports.getAllChapters = async (req, res) => {
    try {
        const chapters = await Chapter.findAll({ where: { book_id: req.params.id } });
        res.json(chapters);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chapters' });
    }
}

exports.updateChapter = async (req, res) => {
    try {
        const { title, book_id } = req.body;
        const [updated] = await Chapter.update(
            { title, book_id },
            { where: { id: req.params.chapterId } }
        );
        if (updated) {
            const updatedChapter = await Chapter.findByPk(req.params.id);
            res.json(updatedChapter);
        } else {
            res.status(404).json({ error: 'Chapter not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update chapter' });
    }
}

exports.deleteChapter = async (req, res) => {

    try {
        const deleted = await Chapter.destroy({ where: { id: req.params.chapterId } });
        if (deleted) {
            res.json({ message: 'Chapter deleted' });
        } else {
            res.status(404).json({ error: 'Chapter not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete chapter' });
    }
}