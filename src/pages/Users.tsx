import React, { useState } from 'react';
import { PlusCircle, Users as UsersIcon, Eye, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { User } from '../types';
import PageHeader from '../components/layout/PageHeader';
import Modal from '../components/common/Modal';
import UserForm from '../components/users/UserForm';
import EmptyState from '../components/common/EmptyState';

const Users: React.FC = () => {
  const { users, addNewUser, updateExistingUser, getUserLoans } = useLibrary();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  
  const handleOpenModal = (user?: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(undefined);
  };
  
  const handleSubmit = (user: User) => {
    if (editingUser) {
      updateExistingUser(user);
    } else {
      addNewUser(user);
    }
    handleCloseModal();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Users" 
        description="Manage library members and staff"
        actions={
          <button 
            onClick={() => handleOpenModal()} 
            className="btn-primary flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add User
          </button>
        }
      />
      
      {users.length === 0 ? (
        <EmptyState
          title="No users yet"
          description="Add users to your library to track book loans and returns."
          icon={<UsersIcon className="h-8 w-8" />}
          action={
            <button 
              onClick={() => handleOpenModal()} 
              className="btn-primary"
            >
              Add Your First User
            </button>
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Member Since
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Active Loans
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => {
                const userLoans = getUserLoans(user.id);
                const activeLoans = userLoans.filter(loan => 
                  loan.status === 'active' || loan.status === 'overdue'
                ).length;
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.memberSince).toLocaleDateString()}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.role === 'admin' ? 'bg-primary-100 text-primary-700' : 
                          user.role === 'librarian' ? 'bg-secondary-100 text-secondary-700' : 
                          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {activeLoans}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/users/${user.id}`}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300 flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      </div>
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
        title={editingUser ? 'Edit User' : 'Add New User'}
        size="md"
      >
        <UserForm
          initialData={editingUser}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Users;