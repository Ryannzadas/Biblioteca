import React from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Map, Book as BookIcon } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { formatLocation } from '../utils/helpers';
import PageHeader from '../components/layout/PageHeader';
import SearchForm from '../components/search/SearchForm';

const Search: React.FC = () => {
  const { searchResults, searchFilters, setSearchFilters } = useLibrary();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Search Books" 
        description="Find books by title, author, or keyword"
      />
      
      <div className="mb-8">
        <SearchForm
          filters={searchFilters}
          onFilterChange={setSearchFilters}
        />
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Search Results
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({searchResults.length} {searchResults.length === 1 ? 'book' : 'books'} found)
          </span>
        </h2>
      </div>
      
      {searchResults.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
            <SearchIcon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            No matching books found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {searchResults.map(book => (
              <li key={book.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <Link to={`/books/${book.id}`} className="block">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {book.title}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Author:</span> {book.author}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Publisher:</span> {book.publisher}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Year:</span> {book.year}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">ISBN:</span> {book.isbn}
                            </p>
                          </div>
                          
                          <div className="flex items-center">
                            <Map className="h-4 w-4 text-gray-400 mr-1" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatLocation(
                                book.location.block,
                                book.location.row,
                                book.location.section
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${book.status === 'available' ? 'bg-success-100 text-success-700' :
                            book.status === 'borrowed' ? 'bg-warning-100 text-warning-700' :
                            book.status === 'reserved' ? 'bg-accent-100 text-accent-700' :
                            'bg-danger-100 text-danger-700'}`}
                        >
                          <BookIcon className="h-3 w-3 mr-1" />
                          {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;