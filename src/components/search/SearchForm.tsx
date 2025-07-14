import React from 'react';
import { Search } from 'lucide-react';
import { SearchFilters } from '../../types';

interface SearchFormProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ filters, onFilterChange }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    onFilterChange({
      ...filters,
      [name]: name === 'year' && value ? parseInt(value, 10) : value
    });
  };
  
  const handleClearFilters = () => {
    onFilterChange({ query: '', field: 'all' });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            name="query"
            value={filters.query}
            onChange={handleChange}
            placeholder="Search books..."
            className="input pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="field" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search in
            </label>
            <select
              id="field"
              name="field"
              value={filters.field || 'all'}
              onChange={handleChange}
              className="select"
            >
              <option value="all">All fields</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="publisher">Publisher</option>
              <option value="isbn">ISBN</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status || ''}
              onChange={handleChange}
              className="select"
            >
              <option value="">Any status</option>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Publication Year
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={filters.year || ''}
              onChange={handleChange}
              placeholder="Any year"
              className="input"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClearFilters}
            className="btn-outline"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;