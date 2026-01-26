import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SinglePost from './pages/SinglePost';
import { AuthProvider } from './context/auth';

import MenuBar from './components/MenuBar';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* CORREÇÃO AQUI: bg-slate-50 no claro, bg-slate-900 no escuro */}
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <MenuBar />
          
          <div className="flex-grow z-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/posts/:postId" element={<SinglePost />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;