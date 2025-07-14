import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { generateId } from '../../utils/helpers';

interface UserFormProps {
  initialData?: User;
  onSubmit: (user: User) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    memberSince: initialData?.memberSince || new Date().toISOString().split('T')[0],
    role: initialData?.role || 'member'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const userToSave: User = {
        id: initialData?.id || generateId(),
        ...formData
      };
      
      onSubmit(userToSave);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`input mt-1 ${errors.name ? 'border-danger-500' : ''}`}
        />
        {errors.name && <p className="mt-1 text-xs text-danger-500">{errors.name}</p>}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`input mt-1 ${errors.email ? 'border-danger-500' : ''}`}
        />
        {errors.email && <p className="mt-1 text-xs text-danger-500">{errors.email}</p>}
      </div>
      
      <div>
        <label htmlFor="memberSince" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</label>
        <input
          type="date"
          id="memberSince"
          name="memberSince"
          value={formData.memberSince}
          onChange={handleChange}
          max={new Date().toISOString().split('T')[0]}
          className="input mt-1"
        />
      </div>
      
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="select mt-1"
        >
          <option value="member">Member</option>
          <option value="librarian">Librarian</option>
          <option value="admin">Admin</option>
        </select>
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
        >
          {isEditing ? 'Update User' : 'Add User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;