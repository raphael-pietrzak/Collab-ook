import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthenticatedRoute from './components2/AuthenticatedRoute';
import LoginForm from './components2/LoginForm';
import RegisterForm from './components2/RegisterForm';
import Editor from './components2/Editor';
import Home from './pages/Home';
import Gallery from './pages/BookGallery';


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

          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;