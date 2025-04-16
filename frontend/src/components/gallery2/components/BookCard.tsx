import { Book as BookIcon, Globe, Lock } from 'lucide-react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 p-6 transition-all duration-300 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50">
      <div className="absolute top-4 right-4">
        {book.isPublic ? (
          <Globe className="w-4 h-4 text-blue-400" />
        ) : (
          <Lock className="w-4 h-4 text-gray-400" />
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-serif text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {book.title}
          </h3>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            {book.author}
          </p>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">
          {book.description}
        </p>

        <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <BookIcon className="w-4 h-4" />
            <span>{book.pages} pages</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">
              {book.genre}
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
              {book.language}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}