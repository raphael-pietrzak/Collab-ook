import { useState, useEffect } from 'react';
import { useChaptersStore } from '../../store/useChaptersStore';
import { Plus, Trash2, Edit2, ChevronRight, Loader2 } from 'lucide-react';

const DEMO_BOOK_ID = 'demo-book-1';

export default function ChaptersSidebar({ bookId }: { bookId: string }) {
  const { chapters, isLoading, error, addChapter, removeChapter, fetchChapters } = useChaptersStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchChapters(token);
  }, [fetchChapters, bookId, token]);

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;

    await addChapter({
      bookId: DEMO_BOOK_ID,
      title: newChapterTitle
    }, token);

    setNewChapterTitle('');
    setIsAdding(false);
  };

  const handleRemoveChapter = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      await removeChapter(id, token);
    }
  };

  return (
    <div className={`h-full bg-gray-50 border-r border-gray-200 transition-all duration-300 ${
      isExpanded ? 'w-64' : 'w-12'
    }`}>
      <div className="p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${
            isExpanded ? 'transform rotate-90deg)' : ''
          }`} />
          {isExpanded && <span className="ml-2 font-medium">Chapters</span>}
        </button>
      </div>

      {isExpanded && (
        <div className="px-4">
          {isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="space-y-2">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
              >
                <span className="text-sm truncate">{chapter.title}</span>
                <div className="flex space-x-1">
                  <button
                    className="p-1 hover:text-indigo-600"
                    title="Edit chapter"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => chapter.id && handleRemoveChapter(chapter.id)}
                    className="p-1 hover:text-red-600"
                    title="Delete chapter"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {isAdding ? (
            <form onSubmit={handleAddChapter} className="mt-4">
              <input
                type="text"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                placeholder="Chapter title"
                className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="mt-4 flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Chapter</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}