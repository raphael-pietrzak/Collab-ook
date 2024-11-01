import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Book, Bookmark, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Chapter } from '../types';

export default function Editor() {
  const { bookId } = useParams<{ bookId: string }>();
  const { token } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (bookId) {
      fetchChapters();
    }
  }, [bookId]);


  const fetchChapters = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/books/${bookId}/chapters`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch chapters');
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const handleContentChange = async (content: string) => {
    if (!chapters[currentChapter]) return;

    const updatedChapters = [...chapters];
    updatedChapters[currentChapter].content = content;
    setChapters(updatedChapters);
  };

  const saveChapter = async () => {
    if (!chapters[currentChapter]) return;

    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:3000/api/chapters/${chapters[currentChapter].id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: chapters[currentChapter].title,
          content: chapters[currentChapter].content
        })
      });

      if (!response.ok) throw new Error('Failed to save chapter');
    } catch (error) {
      console.error('Error saving chapter:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addChapter = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/books/${bookId}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `Chapitre ${chapters.length + 1}`,
          content: ''
        })
      });

      if (!response.ok) throw new Error('Failed to create chapter');
      const newChapter = await response.json();
      setChapters([...chapters, newChapter]);
    } catch (error) {
      console.error('Error creating chapter:', error);
    }
  };
  console.log(bookId);



  if (chapters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-gray-600 mb-4">Aucun chapitre n'existe encore.</p>
        <button
          onClick={addChapter}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Créer le premier chapitre
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Book className="w-8 h-8 text-amber-700" />
            <h1 className="text-3xl font-serif font-bold text-amber-900">Écrivons Ensemble</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={saveChapter}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button
              // onClick={() => window.location.href = `/export/${bookId}`}
              className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
            >
              Exporter
            </button>
          </div>

        </header>

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1 bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Chapitres</h2>
              <button 
                onClick={addChapter}
                className="text-amber-700 hover:text-amber-800"
              >
                + Nouveau
              </button>
            </div>
            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => setCurrentChapter(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    currentChapter === index 
                      ? 'bg-amber-100 text-amber-900' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    {chapter.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-3 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                  disabled={currentChapter === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {isEditing ? (
                  <input
                    type="text"
                    value={chapters[currentChapter].title}
                    onChange={(e) => {
                      const updatedChapters = [...chapters];
                      updatedChapters[currentChapter].title = e.target.value;
                      setChapters(updatedChapters);
                    }}
                    onBlur={() => setIsEditing(false)}
                    className="text-xl font-serif font-semibold px-2 py-1 border-b-2 border-amber-200 focus:border-amber-500 outline-none"
                    autoFocus
                  />
                ) : (
                  <h2 
                    onClick={() => setIsEditing(true)}
                    className="text-xl font-serif font-semibold cursor-pointer hover:text-amber-700"
                  >
                    {chapters[currentChapter].title}
                  </h2>
                )}
                <button 
                  onClick={() => setCurrentChapter(Math.min(chapters.length - 1, currentChapter + 1))}
                  disabled={currentChapter === chapters.length - 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <textarea
              value={chapters[currentChapter].content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full h-[calc(100vh-300px)] p-4 border rounded-lg font-serif text-lg leading-relaxed resize-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 outline-none"
              placeholder="Commencez à écrire votre histoire..."
            />

            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>{chapters[currentChapter].content.length} caractères</span>
              <span>{chapters[currentChapter].content.split(/\s+/).filter(Boolean).length} mots</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}