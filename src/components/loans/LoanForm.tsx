import React, { useState, useEffect } from 'react';
import { Book, User } from '../../types';
import { useLibrary } from '../../context/LibraryContext';

interface LoanFormProps {
  onSubmit: (bookId: string, userId: string) => void;
  onCancel: () => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ onSubmit, onCancel }) => {
  const { books, users } = useLibrary();
  
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Filter only available books
  const availableBooks = books.filter(book => book.status === 'available');
  
  useEffect(() => {
    if (availableBooks.length > 0 && !selectedBookId) {
      setSelectedBookId(availableBooks[0].id);
    }
    
    if (users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0].id);
    }
  }, [availableBooks, users, selectedBookId, selectedUserId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!selectedBookId) newErrors.book = 'Please select a book';
    if (!selectedUserId) newErrors.user = 'Please select a user';
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(selectedBookId, selectedUserId);
    } else {
      setErrors(newErrors);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="bookId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Book</label>
        <select
          id="bookId"
          value={selectedBookId}
          onChange={(e) => setSelectedBookId(e.target.value)}
          className={`select mt-1 ${errors.book ? 'border-danger-500' : ''}`}
        >
          <option value="">Select a book</option>
          {availableBooks.map(book => (
            <option key={book.id} value={book.id}>
              {book.title} - {book.author}
            </option>
          ))}
        </select>
        {errors.book && <p className="mt-1 text-xs text-danger-500">{errors.book}</p>}
        
        {availableBooks.length === 0 && (
          <p className="mt-1 text-sm text-warning-700 dark:text-warning-400">
            No books are available for checkout.
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">User</label>
        <select
          id="userId"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className={`select mt-1 ${errors.user ? 'border-danger-500' : ''}`}
        >
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} - {user.email}
            </option>
          ))}
        </select>
        {errors.user && <p className="mt-1 text-xs text-danger-500">{errors.user}</p>}
        
        {users.length === 0 && (
          <p className="mt-1 text-sm text-warning-700 dark:text-warning-400">
            No users are registered in the system.
          </p>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={availableBooks.length === 0 || users.length === 0}
        >
          Checkout Book
        </button>
      </div>
    </form>
  );
};

export default LoanForm;