import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import Logo from './Logo'; // Importe o Logo (que agora é só a imagem)

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO + TEXTO MANUALMENTE AQUI 👇 */}
          {/* flex items-center: Alinha Imagem e Texto na horizontal */}
          {/* gap-2: O espaçamento que você queria */}
          <Link to="/" className="group hover:opacity-80 transition-opacity flex items-center gap 0">
            <Logo className="h-10" /> 
            
            {/* O Texto Nexus, controlado APENAS aqui no Header */}
            <span className="font-bold text-2xl tracking-tight text-slate-800 dark:text-white pt-1">
              Nexus
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-lg text-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-yellow-400"
              title="Mudar Tema"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>

            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="hidden sm:block text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mr-2"
                >
                  @{user.username}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 transition-colors">Registrar</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default MenuBar;