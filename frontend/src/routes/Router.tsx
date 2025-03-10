import { Routes, Route } from 'react-router-dom';
import AuthenticatedRoute from '../components/auth/AuthenticatedRoute';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import Editor from '../pages/Editor';
import Home from '../pages/Home';
import Gallery from '../pages/BookGallery';
import SharedEditor from '../components/editor/SharedEditor';
import Document from '../components/editor/Document';
import Navbar from '../components/shared/Navbar';
import Settings from '../pages/Setting';

const Router = () => {
  return (
    <>
      <Navbar />
      <div className="h-16" />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route 
          path="/editor/:bookId" 
          element={
            <AuthenticatedRoute>
              <Editor />
            </AuthenticatedRoute>
          } 
        />
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
          path="/shared-editor/:chapterId" 
          element={
            <AuthenticatedRoute>
              <SharedEditor selectedChapter={{id:'1', content:''}} />
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
