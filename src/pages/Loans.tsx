import React, { useState } from 'react';
import { PlusCircle, BookCopy, Check } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { Loan } from '../types';
import { formatDate, getLoanStatusText } from '../utils/helpers';
import PageHeader from '../components/layout/PageHeader';
import Modal from '../components/common/Modal';
import LoanForm from '../components/loans/LoanForm';
import EmptyState from '../components/common/EmptyState';

const Loans: React.FC = () => {
  const { loans, books, users, checkoutBook, returnBook } = useLibrary();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'returned' | 'overdue'>('all');
  
  const handleCloseModal = () => setIsModalOpen(false);
  
  const handleCheckout = (bookId: string, userId: string) => {
    checkoutBook(bookId, userId);
    handleCloseModal();
  };
  
  const handleReturn = (loanId: string) => {
    returnBook(loanId);
  };
  
  const getFilteredLoans = () => {
    if (activeTab === 'all') return loans;
    return loans.filter(loan => loan.status === activeTab);
  };
  
  const filteredLoans = getFilteredLoans();
  
  const getTabClass = (tab: typeof activeTab) => {
    return `px-4 py-2 text-sm font-medium rounded-md ${
      activeTab === tab
        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-400'
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
    }`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Loans" 
        description="Manage book checkouts and returns"
        actions={
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="btn-primary flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Checkout
          </button>
        }
      />
      
      <div className="mb-6 overflow-x-auto">
        <div className="inline-flex space-x-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
          <button
            className={getTabClass('all')}
            onClick={() => setActiveTab('all')}
          >
            All Loans
          </button>
          <button
            className={getTabClass('active')}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button
            className={getTabClass('overdue')}
            onClick={() => setActiveTab('overdue')}
          >
            Overdue
          </button>
          <button
            className={getTabClass('returned')}
            onClick={() => setActiveTab('returned')}
          >
            Returned
          </button>
        </div>
      </div>
      
      {loans.length === 0 ? (
        <EmptyState
          title="No loans yet"
          description="Start by checking out a book to a user."
          icon={<BookCopy className="h-8 w-8" />}
          action={
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="btn-primary"
            >
              Create First Checkout
            </button>
          }
        />
      ) : filteredLoans.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No loans in this category.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Checkout Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLoans.map(loan => {
                const book = books.find(b => b.id === loan.bookId);
                const user = users.find(u => u.id === loan.userId);
                
                return (
                  <tr key={loan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {book?.title || 'Unknown Book'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            by {book?.author || 'Unknown Author'}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {user?.name || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email || 'No email'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(loan.checkoutDate)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(loan.dueDate)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${loan.status === 'active' ? 'bg-secondary-100 text-secondary-700' : 
                          loan.status === 'overdue' ? 'bg-danger-100 text-danger-700' : 
                          'bg-success-100 text-success-700'}`}
                      >
                        {getLoanStatusText(loan.status)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {(loan.status === 'active' || loan.status === 'overdue') && (
                        <button
                          onClick={() => handleReturn(loan.id)}
                          className="text-success-700 dark:text-success-400 hover:text-success-900 dark:hover:text-success-300 flex items-center"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Checkout Book"
        size="md"
      >
        <LoanForm
          onSubmit={handleCheckout}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Loans;