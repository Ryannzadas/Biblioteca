import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Edit, Trash, ArrowLeft, BookCopy, MapPin, Calendar, BookOpen
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { formatDate, formatLocation } from '../utils/helpers';
import PageHeader from '../components/layout/PageHeader';
import Modal from '../components/common/Modal';
import BookForm from '../components/books/BookForm';
import LoanForm from '../components/loans/LoanForm';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { 
    getBookById, 
    updateExistingBook, 
    removeBook, 
    getBookLoans, 
    checkoutBook,
    loans,
    users
  } = useLibrary();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  
  const book = getBookById(id || '');
  const bookLoans = id ? getBookLoans(id) : [];
  
  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Book Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => navigate('/books')}
            className="btn-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2 inline-block" />
            Return to Books
          </button>
        </div>
      </div>
    );
  }
  
  const handleDeleteBook = () => {
    removeBook(book.id);
    setIsDeleteModalOpen(false);
    navigate('/books');
  };
  
  const handleCheckout = (bookId: string, userId: string) => {
    checkoutBook(bookId, userId);
    setIsLoanModalOpen(false);
  };
  
  const getLoanHistoryItem = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return null;
    
    const user = users.find(u => u.id === loan.userId);
    
    return (
      <div key={loan.id} className="border-b border-gray-200 dark:border-gray-700 py-4 last:border-0">
        <div className="flex justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {user?.name || 'Unknown User'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user?.email || 'No email'}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Borrowed: {formatDate(loan.checkoutDate)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {loan.returnDate 
                  ? `Returned: ${formatDate(loan.returnDate)}` 
                  : `Due: ${formatDate(loan.dueDate)}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Determine if book can be loaned (only if status is 'available')
  const canBeLoanedOut = book.status === 'available';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title={book.title}
        description={`by ${book.author}`}
        actions={
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/books')}
              className="btn-outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="btn-secondary"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="btn-outline border-danger-500 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </button>
            
            {canBeLoanedOut && (
              <button
                onClick={() => setIsLoanModalOpen(true)}
                className="btn-primary"
              >
                <BookCopy className="h-4 w-4 mr-2" />
                Checkout Book
              </button>
            )}
          </div>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Book Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</h3>
                <p className="text-base text-gray-900 dark:text-gray-100">{book.title}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Author</h3>
                <p className="text-base text-gray-900 dark:text-gray-100">{book.author}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Publisher</h3>
                <p className="text-base text-gray-900 dark:text-gray-100">{book.publisher}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Year</h3>
                <p className="text-base text-gray-900 dark:text-gray-100">{book.year}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ISBN</h3>
                <p className="text-base text-gray-900 dark:text-gray-100">{book.isbn}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
                  ${book.status === 'available' ? 'bg-success-100 text-success-700' :
                    book.status === 'borrowed' ? 'bg-warning-100 text-warning-700' :
                    book.status === 'reserved' ? 'bg-accent-100 text-accent-700' :
                    'bg-danger-100 text-danger-700'}`
                }>
                  {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Loan History */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Loan History</h2>
            
            {bookLoans.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {bookLoans.map(loan => getLoanHistoryItem(loan.id))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                This book has never been borrowed.
              </p>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          {/* Book Location */}
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Location</h2>
              <MapPin className="h-5 w-5 text-secondary-500" />
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Block</p>
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {book.location.block}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Row</p>
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {book.location.row}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Section</p>
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {book.location.section}
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You can find this book at {formatLocation(
                book.location.block,
                book.location.row,
                book.location.section
              )}.
            </p>
          </div>
          
          {/* Book Cover */}
          {book.coverImage && (
            <div className="card p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4 self-start">Cover</h2>
              <img 
                src={book.coverImage} 
                alt={`Cover for ${book.title}`}
                className="rounded-md shadow-md max-h-72 object-cover"
              />
            </div>
          )}
          
          {!book.coverImage && (
            <div className="card p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4 self-start">Cover</h2>
              <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-700 rounded-md h-64 w-48">
                <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                No cover image available
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Book"
        size="lg"
      >
        <BookForm
          initialData={book}
          onSubmit={(updatedBook) => {
            updateExistingBook(updatedBook);
            setIsEditModalOpen(false);
          }}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Book"
        size="sm"
      >
        <div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete "{book.title}"? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteBook}
              className="btn bg-danger-500 hover:bg-danger-600 text-white focus:ring-danger-400"
            >
              Delete Book
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Loan Modal */}
      <Modal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        title="Checkout Book"
        size="md"
      >
        <LoanForm
          onSubmit={(bookId, userId) => handleCheckout(bookId, userId)}
          onCancel={() => setIsLoanModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default BookDetail;