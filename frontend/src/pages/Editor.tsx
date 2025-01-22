import { useParams } from 'react-router-dom';
import ChaptersSidebar from '../components/editor/ChaptersSidebar';
import SharedEditor from '../components/editor/SharedEditor';

export default function Editor() {
  const { bookId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {bookId && <ChaptersSidebar bookId={bookId} />}
      <SharedEditor />
    </div>
  );
}