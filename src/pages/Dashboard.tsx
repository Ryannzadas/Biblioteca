import React from 'react';
import { BookOpen, Users, BookCopy, AlertCircle } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/dashboard/StatCard';

const Dashboard: React.FC = () => {
  const { getLibraryStats, books, loans, getOverdueLoans } = useLibrary();
  const stats = getLibraryStats();
  const overdueLoans = getOverdueLoans();
  
  // Sample overdue loans for display
  const recentOverdueLoans = overdueLoans.slice(0, 5);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Library Dashboard" 
        description="Overview of your library system"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Books"
          value={stats.totalBooks}
          icon={<BookOpen className="h-6 w-6" />}
          color="primary"
        />
        <StatCard 
          title="Available Books"
          value={stats.availableBooks}
          icon={<BookOpen className="h-6 w-6" />}
          color="success"
          description={`${Math.round((stats.availableBooks / stats.totalBooks || 0) * 100)}% of collection`}
        />
        <StatCard 
          title="Active Loans"
          value={stats.activeLoans}
          icon={<BookCopy className="h-6 w-6" />}
          color="secondary"
        />
        <StatCard 
          title="Overdue Loans"
          value={stats.overdueLoans}
          icon={<AlertCircle className="h-6 w-6" />}
          color="danger"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Overdue Books */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Overdue Books
          </h2>
          
          {recentOverdueLoans.length > 0 ? (
            <div className="space-y-3">
              {recentOverdueLoans.map(loan => {
                const book = books.find(b => b.id === loan.bookId);
                return (
                  <div key={loan.id} className="flex items-center p-3 bg-danger-50 dark:bg-danger-900/20 rounded-md">
                    <div className="text-danger-600 dark:text-danger-400 mr-3">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{book?.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Due: {new Date(loan.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No overdue books!
            </p>
          )}
          
          {overdueLoans.length > 5 && (
            <div className="mt-4 text-right">
              <a href="/loans" className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium">
                View all overdue books →
              </a>
            </div>
          )}
        </div>
        
        {/* Library Statistics */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Library Status
          </h2>
          
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-4">
              <div 
                className="bg-primary-500 h-4 rounded-full" 
                style={{ width: `${Math.round((stats.availableBooks / stats.totalBooks || 0) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{stats.availableBooks} books available</span>
              <span>{stats.totalBooks - stats.availableBooks} books checked out</span>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary-500" />
                  {stats.totalUsers}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-500 dark:text-gray-400">Loan Ratio</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {stats.totalUsers > 0 
                    ? (stats.activeLoans / stats.totalUsers).toFixed(1) 
                    : '0'} 
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">per user</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;