import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../types';
import { formatLocation, getBookStatusText } from '../../utils/helpers';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const statusColors = {
    available: 'bg-success-100 text-success-700',
    borrowed: 'bg-warning-100 text-warning-700',
    reserved: 'bg-accent-100 text-accent-700',
    maintenance: 'bg-danger-100 text-danger-700'
  };
  
  return (
    <div className="card card-hover h-full">
      <div className="p-4 flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1 text-primary-700 dark:text-primary-400 truncate">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            by {book.author}
          </p>
          
          <div className="mb-3">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[book.status]}`}>
              {getBookStatusText(book.status)}
            </span>
          </div>
          
          <div className="text-sm mb-3">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Publisher:</span> {book.publisher}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Year:</span> {book.year}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">ISBN:</span> {book.isbn}
            </p>
          </div>
          
          <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Location:</p>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {formatLocation(book.location.block, book.location.row, book.location.section)}
            </p>
          </div>
        </div>
        
        <div className="mt-auto">
          <Link 
            to={`/books/${book.id}`} 
            className="block w-full text-center btn-primary"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;