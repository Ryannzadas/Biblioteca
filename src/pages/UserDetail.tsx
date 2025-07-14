import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, BookCopy } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { formatDate } from '../utils/helpers';
import PageHeader from '../components/layout/PageHeader';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { getUserById, getUserLoans, books } = useLibrary();
  
  const user = getUserById(id || '');
  const userLoans = id ? getUserLoans(id) : [];
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The user you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => navigate('/users')}
            className="btn-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2 inline-block" />
            Return to Users
          </button>
        </div>
      </div>
    );
  }
  
  // Separate active and returned loans
  const activeLoans = userLoans.filter(loan => loan.status === 'active' || loan.status === 'overdue');
  const returnedLoans = userLoans.filter(loan => loan.status === 'returned');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title={user.name}
        description={user.email}
        actions={
          <button 
            onClick={() => navigate('/users')} 
            className="btn-outline flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </button>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card p-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-primary-600 dark:text-primary-400" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {user.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {user.email}
              </p>
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                ${user.role === 'admin' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-400' : 
                  user.role === 'librarian' ? 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-400' : 
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 dark:text-gray-400">Member Since</span>
                <span className="text-gray-900 dark:text-white">{formatDate(user.memberSince)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Total Checkouts</span>
                <span className="text-gray-900 dark:text-white">{userLoans.length}</span>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Loan Statistics</h2>
              <BookCopy className="h-5 w-5 text-secondary-500" />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Active Loans</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{activeLoans.length}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${(activeLoans.length / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Returned Books</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{returnedLoans.length}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-success-500 h-2 rounded-full"
                    style={{ width: `${Math.min((returnedLoans.length / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Overdue Books</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {activeLoans.filter(loan => loan.status === 'overdue').length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-danger-500 h-2 rounded-full"
                    style={{ width: `${(activeLoans.filter(loan => loan.status === 'overdue').length / 2) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Current Loans</h2>
            
            {activeLoans.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No active loans.
              </p>
            ) : (
              <div className="space-y-4">
                {activeLoans.map(loan => {
                  const book = books.find(b => b.id === loan.bookId);
                  
                  return (
                    <div key={loan.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <BookCopy className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <Link to={`/books/${loan.bookId}`} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                            {book?.title || 'Unknown Book'}
                          </Link>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            by {book?.author || 'Unknown Author'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          <span className={`${
                            loan.status === 'overdue' ? 'text-danger-600 dark:text-danger-400 font-medium' : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            Due: {formatDate(loan.dueDate)}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                            ${loan.status === 'active' ? 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-400' : 
                              'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-400'}`}
                          >
                            {loan.status === 'active' ? 'Active' : 'Overdue'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Loan History</h2>
            
            {returnedLoans.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No loan history.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Book
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Checkout Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Return Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {returnedLoans.map(loan => {
                      const book = books.find(b => b.id === loan.bookId);
                      
                      return (
                        <tr key={loan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Link to={`/books/${loan.bookId}`} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                              {book?.title || 'Unknown Book'}
                            </Link>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(loan.checkoutDate)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {loan.returnDate ? formatDate(loan.returnDate) : 'Not returned'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;