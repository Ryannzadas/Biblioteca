import { format, addDays, parseISO, isAfter } from 'date-fns';
import { Book, Loan, SearchFilters } from '../types';

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Format date to display
export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM dd, yyyy');
};

// Calculate due date (typically 14 days from checkout)
export const calculateDueDate = (checkoutDate: string): string => {
  const date = parseISO(checkoutDate);
  return format(addDays(date, 14), 'yyyy-MM-dd');
};

// Check if a loan is overdue
export const isLoanOverdue = (dueDate: string): boolean => {
  return isAfter(new Date(), parseISO(dueDate));
};

// Search books based on filters
export const searchBooks = (books: Book[], filters: SearchFilters): Book[] => {
  const { query, field, status, year } = filters;
  
  if (!query && !status && !year) return books;
  
  return books.filter((book) => {
    // Check status if provided
    if (status && book.status !== status) return false;
    
    // Check year if provided
    if (year !== undefined && book.year !== year) return false;
    
    // Check query if provided
    if (query) {
      const normalizedQuery = query.toLowerCase();
      
      if (field === 'title' || field === 'all') {
        if (book.title.toLowerCase().includes(normalizedQuery)) return true;
      }
      
      if (field === 'author' || field === 'all') {
        if (book.author.toLowerCase().includes(normalizedQuery)) return true;
      }
      
      if (field === 'publisher' || field === 'all') {
        if (book.publisher.toLowerCase().includes(normalizedQuery)) return true;
      }
      
      if (field === 'isbn' || field === 'all') {
        if (book.isbn.toLowerCase().includes(normalizedQuery)) return true;
      }
      
      return false;
    }
    
    return true;
  });
};

// Get book availability status text
export const getBookStatusText = (status: Book['status']): string => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'borrowed':
      return 'Borrowed';
    case 'reserved':
      return 'Reserved';
    case 'maintenance':
      return 'Under Maintenance';
    default:
      return 'Unknown Status';
  }
};

// Get loan status text
export const getLoanStatusText = (status: Loan['status']): string => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'returned':
      return 'Returned';
    case 'overdue':
      return 'Overdue';
    default:
      return 'Unknown Status';
  }
};

// Get today's date in ISO format
export const getTodayISO = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

// Format location text
export const formatLocation = (block: string, row: number, section: string): string => {
  return `Block ${block}, Row ${row}, Section ${section}`;
};