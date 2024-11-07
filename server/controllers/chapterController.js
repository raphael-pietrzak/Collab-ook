// chapterController.js

exports.getChapters = async (req, res) => {
    try {
        const { bookId } = req.params;
        const result = await db.execute({
          sql: 'SELECT * FROM chapters WHERE book_id = ? ORDER BY order_index',
          args: [bookId]
        });
        res.json(result.rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

exports.createChapter = async (req, res) => {
    try {
        const { title, content } = req.body;
        const { bookId } = req.params;

        // Get the next order index
        const result = await db.execute({
          sql: 'SELECT MAX(order_index) as max_order FROM chapters WHERE book_id = ?',
          args: [bookId]
        });
        const nextOrder = (result.rows[0].max_order || 0) + 1;

        const chapter = await db.execute({
          sql: 'INSERT INTO chapters (title, content, book_id, order_index) VALUES (?, ?, ?, ?) RETURNING id',
          args: [title, content, bookId, nextOrder]
        });

        res.status(201).json({ id: chapter.rows[0].id, title, content, book_id: bookId, order_index: nextOrder });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

exports.updateChapter = async (req, res) => {
    try {
        const { title, content } = req.body;
        const { id } = req.params;

        await db.execute({
          sql: 'UPDATE chapters SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          args: [title, content, id]
        });

        res.json({ id, title, content });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}