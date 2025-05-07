import { Routes, Route, useParams } from 'react-router-dom';
import AuthenticatedRoute from '../components/auth/AuthenticatedRoute';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import Home from '../pages/Home';
import Gallery from '../pages/BookGallery';
import Document from '../components/editor/Document';
import Navbar from '../components/shared/Navbar';
import SharedDocument from '../components/SharedDocument';
import GalleryPage from '../components/gallery2/GalleryPage';
import Settings from '../pages/Settings';


// Composant wrapper pour récupérer l'ID du document et le token
const SharedDocumentWrapper = () => {
  const { documentId } = useParams();
  const token = localStorage.getItem('token');
  const userId = '1'; // À remplacer par une extraction depuis le token décodé
  const username = 'test'; // À remplacer par une extraction depuis le token décodé
  const serverUrl = 'http://localhost:3000';
  
  return (
    <SharedDocument 
      documentId={documentId || '10'}
      username={username}
      userId={userId} 
      serverUrl={serverUrl}
      token={token || ''}
    />
  );
};

const Router = () => {
  return (
    <>
      <Navbar />
      <div className="h-16" />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/gallery-test" element={<GalleryPage />} />

        <Route 
          path="/gallery" 
          element={
            <AuthenticatedRoute>
              <Gallery />
            </AuthenticatedRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route 
          path="/shared-editor/:documentId" 
          element={
            <AuthenticatedRoute>
              <SharedDocumentWrapper />
            </AuthenticatedRoute>
          }
        />
        <Route path="/editor" element={<Document />} />
        <Route 
          path="/settings" 
          element={
            <AuthenticatedRoute>
              <Settings />
            </AuthenticatedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default Router;
