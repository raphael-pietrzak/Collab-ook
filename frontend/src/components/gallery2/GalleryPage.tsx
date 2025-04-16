import React, { useState } from 'react';
import { Library } from 'lucide-react';
import { Book, FilterState } from './types';
import { BookCard } from './components/BookCard';
import { Filters } from './components/Filters';

const SAMPLE_BOOKS: Book[] = [
  {
    id: "1",
    title: "L'Art de l'Écriture",
    author: "Marie Laurent",
    description: "Un guide complet pour maîtriser l'art de l'écriture créative, de la conception à la réalisation.",
    publishedDate: "2024-02-15",
    genre: "Non-Fiction",
    isPublic: true,
    pages: 324,
    language: "French"
  },
  {
    id: "2",
    title: "Le Mystère du Temps",
    author: "Jean Dubois",
    description: "Une exploration poétique du temps qui passe, mêlant philosophie et fiction dans un récit captivant.",
    publishedDate: "2024-01-20",
    genre: "Fiction",
    isPublic: true,
    pages: 256,
    language: "French"
  },
  {
    id: "3",
    title: "Rêves Numériques",
    author: "Sarah Chen",
    description: "Une plongée fascinante dans un futur où la réalité virtuelle redéfinit les limites de l'expérience humaine.",
    publishedDate: "2024-03-01",
    genre: "Science Fiction",
    isPublic: false,
    pages: 412,
    language: "French"
  }
];

function GalleryPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    genre: "all",
    language: "",
    sortBy: "title",
    publicOnly: false
  });

  const filteredBooks = SAMPLE_BOOKS.filter(book => {
    if (filters.publicOnly && !book.isPublic) return false;
    if (filters.genre !== "all" && book.genre !== filters.genre) return false;
    if (filters.language && book.language !== filters.language) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.description.toLowerCase().includes(searchLower)
      );
    }
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "date":
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      default:
        return a.title.localeCompare(b.title);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Filters filters={filters} onFilterChange={setFilters} />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Aucun livre ne correspond à vos critères</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default GalleryPage;