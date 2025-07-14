import React, { useState } from 'react';
import { Book, BookStatus } from '../../types';
import { useLibrary } from '../../context/LibraryContext';
import { generateId } from '../../utils/helpers';

interface BookFormProps {
  initialData?: Book;
  onSubmit: (book: Book) => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState<Omit<Book, 'id'>>({
    title: initialData?.title || '',
    author: initialData?.author || '',
    publisher: initialData?.publisher || '',
    year: initialData?.year || new Date().getFullYear(),
    isbn: initialData?.isbn || '',
    status: initialData?.status || 'available',
    location: initialData?.location || { block: 'A', row: 1, section: 'General' },
    coverImage: initialData?.coverImage || ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'year' ? parseInt(value, 10) : value
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.publisher.trim()) newErrors.publisher = 'Publisher is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (formData.year < 1000 || formData.year > new Date().getFullYear()) {
      newErrors.year = 'Year must be valid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const bookToSave: Book = {
        id: initialData?.id || generateId(),
        ...formData
      };
      
      onSubmit(bookToSave);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input mt-1 ${errors.title ? 'border-danger-500' : ''}`}
          />
          {errors.title && <p className="mt-1 text-xs text-danger-500">{errors.title}</p>}
        </div>
        
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className={`input mt-1 ${errors.author ? 'border-danger-500' : ''}`}
          />
          {errors.author && <p className="mt-1 text-xs text-danger-500">{errors.author}</p>}
        </div>
        
        <div>
          <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Publisher</label>
          <input
            type="text"
            id="publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            className={`input mt-1 ${errors.publisher ? 'border-danger-500' : ''}`}
          />
          {errors.publisher && <p className="mt-1 text-xs text-danger-500">{errors.publisher}</p>}
        </div>
        
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            max={new Date().getFullYear()}
            min={1000}
            className={`input mt-1 ${errors.year ? 'border-danger-500' : ''}`}
          />
          {errors.year && <p className="mt-1 text-xs text-danger-500">{errors.year}</p>}
        </div>
        
        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ISBN</label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            className={`input mt-1 ${errors.isbn ? 'border-danger-500' : ''}`}
          />
          {errors.isbn && <p className="mt-1 text-xs text-danger-500">{errors.isbn}</p>}
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="select mt-1"
          >
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
            <option value="reserved">Reserved</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Book Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="location.block" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Block</label>
            <input
              type="text"
              id="location.block"
              name="location.block"
              value={formData.location.block}
              onChange={handleChange}
              className="input mt-1"
            />
          </div>
          
          <div>
            <label htmlFor="location.row" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Row</label>
            <input
              type="number"
              id="location.row"
              name="location.row"
              value={formData.location.row}
              onChange={handleChange}
              min={1}
              className="input mt-1"
            />
          </div>
          
          <div>
            <label htmlFor="location.section" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Section</label>
            <input
              type="text"
              id="location.section"
              name="location.section"
              value={formData.location.section}
              onChange={handleChange}
              className="input mt-1"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image URL (optional)</label>
        <input
          type="text"
          id="coverImage"
          name="coverImage"
          value={formData.coverImage || ''}
          onChange={handleChange}
          placeholder="https://example.com/book-cover.jpg"
          className="input mt-1"
        />
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
          {isEditing ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
};

export default BookForm;