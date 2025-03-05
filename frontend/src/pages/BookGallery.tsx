import React, { useEffect } from 'react';
import { Book, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookCard from '../components/gallery/BookCard';

import 'react-toastify/dist/ReactToastify.css';
import { useBooksStore } from '../store/useBooksStore';

// Type definition for Book
interface Book {
  id: string;
  title: string;
  author: string;
  progress: number;
  synopsis?: string;
  genre?: string;
  startDate?: string;
}

const BookGallery: React.FC = () => {
  const { books, fetchBooks, isLoading, error, addBook, removeBook } = useBooksStore();
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchAllBooks = async () => {
      console.log('fetching books');
      console.log(token);
      await fetchBooks(token);
    };

    fetchAllBooks();
  }, [fetchBooks]);


  const handleAddBook = async () => {
    await addBook({ title: 'TITRE', author: 'Moi', progress: 20 }, token);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Livres en Cours d'Écriture
        </h1>
        <button
          onClick={handleAddBook}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 mb-4"
        >
          Créer un livre
        </button>
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center">
              <Book className="animate-pulse text-blue-500" size={64} />
              <p className="mt-4 text-gray-600">Chargement des livres...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">
            <BookOpen className="mx-auto mb-4" size={18} />
            <p>Erreur de chargement : {error}</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center text-gray-500">
            Aucun livre trouvé.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                synopsis={book.synopsis || ''}
                progress={book.progress}
                onEdit={() => navigate(`/editor/${book.id}`)}
                onDelete={() => removeBook(book.id, token)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookGallery;