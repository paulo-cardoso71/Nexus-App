// client/src/App.tsx

import React, { useContext } from 'react'; // Added useContext
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/auth'; // Import Context

import SinglePost from './pages/SinglePost';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Componente Navbar separado para poder usar o Contexto
function Navbar() {
  // Access the user and logout function from Context
  const { user, logout } = useContext(AuthContext);

  const onLogout = () => {
    logout();
    // Optional: Redirect to login or home after logout
    window.location.href = '/login'; 
  }

  const navBar = user ? (
    // IF LOGGED IN: Show Logout and Username
    <div className="flex items-center gap-4">
      <span className="text-blue-200 font-medium">Hello, {user.username}</span>
      <Link to="/" className="hover:text-white transition-colors">Home</Link>
      <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors">
        Logout
      </button>
    </div>
  ) : (
    // IF LOGGED OUT: Show Login and Register
    <div className="space-x-4">
      <Link to="/login" className="hover:text-blue-200 transition-colors">Login</Link>
      <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition-colors">Register</Link>
    </div>
  );

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl hover:text-blue-200">SocialGraph</Link>
        {navBar}
      </div>
    </nav>
  );
}

function App() {
  return (
    // Wrap everything in AuthProvider
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/posts/:postId" element={<SinglePost />}/>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;