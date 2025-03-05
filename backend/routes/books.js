import express from 'express';
import Books from '../models/Books.js';

const router = express.Router();

router.get('/api/books', async (req, res) => {
    try {
        const books = await Books.findAll();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
    }
);

router.post('/api/books', async (req, res) => {
    try {
        const [book] = await Books.create({ title: '', author: '', description: '' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create book' });
    }
});

export default router;
