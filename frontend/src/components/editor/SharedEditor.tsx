// components/SharedEditor.tsx
import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useChaptersStore } from '../../store/useChaptersStore';
import { useCollaboration } from '../../hooks/useCollaboration';


export const SharedEditor = () => {
    const chapterId = "votre-id-chapitre";
    const token = "votre-token";
    const { fetchChapterById, updateChapter } = useChaptersStore();
    const [content, setContent] = useState('');
    const { collaborators, sendUpdate } = useCollaboration(chapterId);

  useEffect(() => {
    const loadChapter = async () => {
      const chapter = await fetchChapterById(chapterId, token);
      if (chapter) {
        setContent(chapter.content);
      }
    };
    loadChapter();
  }, [chapterId]);

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
    sendUpdate(newContent);
    updateChapter(chapterId, { content: newContent }, token);
  };

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center space-x-2">
        <span className="text-sm text-gray-500">
          {collaborators.length} utilisateur(s) en ligne
        </span>
      </div>
      <Editor
        apiKey="votre-clé-tinymce"
        value={content}
        onEditorChange={handleEditorChange}
        init={{
          height: '100%',
          menubar: false,
          plugins: ['lists', 'link', 'image', 'paste'],
          toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist',
          content_style: 'body { font-family: -apple-system, system-ui, sans-serif; }'
        }}
      />
    </div>
  );
};