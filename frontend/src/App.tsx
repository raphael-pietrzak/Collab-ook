import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthenticatedRoute from './components/auth/AuthenticatedRoute';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Editor from './pages/Editor';
import Home from './pages/Home';
import Gallery from './pages/BookGallery';
import { SharedEditor } from './components/editor/SharedEditor';


function App() {
  return (
    <AuthProvider>
      <Router>
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
                <SharedEditor />
              </AuthenticatedRoute>
            }
          />



          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;