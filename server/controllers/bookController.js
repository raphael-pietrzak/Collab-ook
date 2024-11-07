
// bookController.js


exports.createBook = async (req, res) => {
    try {
        const { title } = req.body;
        const result = await db.execute({
          sql: 'INSERT INTO books (title, user_id) VALUES (?, ?) RETURNING id',
          args: [title, req.user.id]
        });
        res.status(201).json({ id: result.rows[0].id, title, user_id: req.user.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getBooks = async (req, res) => {
    try {
        const result = await db.execute({
          sql: 'SELECT * FROM books WHERE user_id = ?',
          args: [req.user.id]
        });
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateBook = async (req, res) => {
    try {
        const { title } = req.body;
        const { id } = req.params;
        await db.execute({
          sql: 'UPDATE books SET title = ? WHERE id = ? AND user_id = ?',
          args: [title, id, req.user.id]
        });
        res.json({ id, title, user_id: req.user.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}