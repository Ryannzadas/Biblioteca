import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Users, BookCopy, Search, Moon, Sun, Home, BookOpen } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useLibrary();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary-700 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
  };
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="ml-2 text-xl font-bold text-primary-700 dark:text-primary-400">LibraryPro</span>
            </Link>
            
            <div className="hidden md:ml-6 md:flex md:space-x-2">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
              >
                <Home className="inline-block w-4 h-4 mr-1" />
                Dashboard
              </Link>
              
              <Link 
                to="/books" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/books')}`}
              >
                <Book className="inline-block w-4 h-4 mr-1" />
                Books
              </Link>
              
              <Link 
                to="/loans" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/loans')}`}
              >
                <BookCopy className="inline-block w-4 h-4 mr-1" />
                Loans
              </Link>
              
              <Link 
                to="/users" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/users')}`}
              >
                <Users className="inline-block w-4 h-4 mr-1" />
                Users
              </Link>
              
              <Link 
                to="/search" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/search')}`}
              >
                <Search className="inline-block w-4 h-4 mr-1" />
                Search
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-5 text-xs">
          <Link 
            to="/" 
            className={`flex flex-col items-center py-2 ${isActive('/') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          
          <Link 
            to="/books" 
            className={`flex flex-col items-center py-2 ${isActive('/books') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}
          >
            <Book className="h-5 w-5" />
            <span>Books</span>
          </Link>
          
          <Link 
            to="/loans" 
            className={`flex flex-col items-center py-2 ${isActive('/loans') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}
          >
            <BookCopy className="h-5 w-5" />
            <span>Loans</span>
          </Link>
          
          <Link 
            to="/users" 
            className={`flex flex-col items-center py-2 ${isActive('/users') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}
          >
            <Users className="h-5 w-5" />
            <span>Users</span>
          </Link>
          
          <Link 
            to="/search" 
            className={`flex flex-col items-center py-2 ${isActive('/search') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;