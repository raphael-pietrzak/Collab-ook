import express from 'express';
import Document from '../models/Document.js';

const router = express.Router();

router.get('/api/documents', async (req, res) => {
  try {
    const documents = await Document.findAll();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

router.post('/api/documents', async (req, res) => {
  try {
    const [document] = await Document.create({ content: '' });
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create document' });
  }
});

export default router;
