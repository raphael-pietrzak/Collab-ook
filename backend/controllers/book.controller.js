const Book = require('../models/book.model');

// Création d'un livre

exports.createBook = async (req, res) => {
  try {
    const { title } = req.body;

    const book = await Book.create({  title, user_id:1, created_at: new Date() });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book' });
  }
};

// Récupération de tous les livres
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

// Récupération d'un livre par son ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
};

// Mise à jour d'un livre
exports.updateBook = async (req, res) => {
  try {
    const { title, author, publishedYear, genre } = req.body;
    const [updated] = await Book.update(
      { title, author, publishedYear, genre },
      { where: { id: req.params.id } }
    );
    if (updated) {
      const updatedBook = await Book.findByPk(req.params.id);
      res.json(updatedBook);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update book' });
  }
};

// Suppression d'un livre
exports.deleteBook = async (req, res) => {
  try {
    const deleted = await Book.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: 'Book deleted' });
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
};


// Création d'un chapitre

exports.createChapter = async (req, res) => {
  try {
    const { title, content } = req.body;
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    const chapter = await book.createChapter({ title, content });
    res.status(201).json(chapter);
  }
  catch (error) {
    res.status(500).json({ error: 'Failed to create chapter' });
  }
}
