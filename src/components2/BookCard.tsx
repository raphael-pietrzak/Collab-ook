import React, { useState } from 'react';
import { Edit3, Trash } from 'lucide-react';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  progress: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ id, title, author, synopsis, progress, onEdit, onDelete }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="bg-white shadow-md p-4 rounded-lg w-full max-w-md"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(id)} className="text-blue-500 hover:text-blue-700">
            <Edit3 size={20} />
          </button>
          <button onClick={() => onDelete(id)} className="text-red-500 hover:text-red-700">
            <Trash size={20} />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-2">par {author}</p>
      <p className="text-gray-700 mb-4">{synopsis}</p>
      <div className="relative w-full h-4 bg-gray-200 rounded-full">
        <div
          className="h-4 bg-blue-600 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-right text-sm text-gray-600 mt-1">{progress}% complété</p>
    </div>
  );
};

export default BookCard;