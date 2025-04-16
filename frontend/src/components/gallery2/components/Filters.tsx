import { Search, SlidersHorizontal } from 'lucide-react';
import { FilterState, Genre } from '../types';
import { useState } from 'react';

const GENRES: Genre[] = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "Thriller",
  "Horror",
  "Biography",
  "History"
];

const LANGUAGES = ["English", "French", "Spanish", "German", "Italian"];

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function Filters({ filters, onFilterChange }: FiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher des livres..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all duration-300"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          />
        </div>
        <button 
          className="flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-300"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="font-medium">Filtres</span>
        </button>
      </div>

      {showFilters && (
        <div className="transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Genre
              </label>
              <select
                className="w-full bg-gray-50 border-0 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all duration-300"
                value={filters.genre}
                onChange={(e) => onFilterChange({ ...filters, genre: e.target.value as Genre | "all" })}
              >
                <option value="all">Tous les genres</option>
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Langue
              </label>
              <select
                className="w-full bg-gray-50 border-0 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all duration-300"
                value={filters.language}
                onChange={(e) => onFilterChange({ ...filters, language: e.target.value })}
              >
                <option value="">Toutes les langues</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Trier par
              </label>
              <select
                className="w-full bg-gray-50 border-0 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all duration-300"
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as "title" | "date"})}
              >
                <option value="title">Titre</option>
                <option value="date">Date de publication</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={filters.publicOnly}
                onChange={(e) => onFilterChange({ ...filters, publicOnly: e.target.checked })}
                className="w-5 h-5 rounded-lg text-blue-500 border-gray-300 focus:ring-blue-200"
              />
              <span className="text-sm text-gray-700">Afficher uniquement les livres publics</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}