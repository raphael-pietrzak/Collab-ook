import React, { useState, useEffect } from 'react';
import { Book, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookCard from './BookCard';

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
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
        console.log(token);
      try {
        const response = await fetch('http://localhost:3000/api/books', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            }
        });



        const data: Book[] = await response.json();
        setBooks(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);


  const addBook = async () => {
    try {
    const response = await fetch('http://localhost:3000/api/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: 'Nouveau livre' })
    });
    if (!response.ok) throw new Error('Failed to create book');
    const newBook = await response.json();
    navigate(`/editor/${newBook.id}`);
    } catch (error) {
        console.error('Error creating book:', error);
    }
};

const deleteBook = async (id: string) => {
    console.log(id);
    try {
        const response = await fetch(`http://localhost:3000/api/books/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete book');
        setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
        console.error('Error deleting book:', error);
    }
}

  const renderProgressBar = (progress: number) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <Book className="animate-pulse text-blue-500" size={64} />
          <p className="mt-4 text-gray-600">Chargement des livres...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <BookOpen className="mx-auto mb-4" size={48} />
        <p>Erreur de chargement : {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Livres en Cours d'Écriture
      </h1>
      
      {books.length === 0 ? (
        <div className="text-center text-gray-500">
          <BookOpen className="mx-auto mb-4" size={48} />
          <p>Aucun livre en cours d'écriture</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard 
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              synopsis={book.synopsis || ''}
              progress={book.progress}
              onEdit={(id) => navigate(`/editor/${id}`)}
              onDelete={deleteBook}
            />
          ))}
          <button
            onClick={addBook}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
            Créer un livre
            </button>
            <BookCard 
                id="1"
                title="Harry Potter"
                author="J.K. Rowling"
                synopsis="Harry Potter est un jeune orphelin qui découvre qu'il est un sorcier et qu'il est inscrit à l'école de sorcellerie de Poudlard."
                progress={75}
                onEdit={(id) => console.log('Edit book', id)}
                onDelete={(id) => console.log('Delete book', id)}
            />
        </div>
      )}
    </div>
  );
};

export default BookGallery;