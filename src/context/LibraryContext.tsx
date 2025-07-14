import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, User, Loan, SearchFilters } from '../types';
import * as localStorage from '../utils/localStorage';
import { generateId, calculateDueDate, isLoanOverdue, getTodayISO } from '../utils/helpers';

interface LibraryContextType {
  // Books
  books: Book[];
  addNewBook: (book: Omit<Book, 'id'>) => string;
  updateExistingBook: (book: Book) => void;
  removeBook: (id: string) => void;
  getBookById: (id: string) => Book | undefined;
  
  // Users
  users: User[];
  addNewUser: (user: Omit<User, 'id'>) => string;
  updateExistingUser: (user: User) => void;
  removeUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  
  // Loans
  loans: Loan[];
  checkoutBook: (bookId: string, userId: string) => string;
  returnBook: (loanId: string) => void;
  getUserLoans: (userId: string) => Loan[];
  getBookLoans: (bookId: string) => Loan[];
  getOverdueLoans: () => Loan[];
  
  // Search
  searchResults: Book[];
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Stats
  getLibraryStats: () => {
    totalBooks: number;
    availableBooks: number;
    activeLoans: number;
    overdueLoans: number;
    totalUsers: number;
  };
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

interface LibraryProviderProps {
  children: ReactNode;
}

export const LibraryProvider: React.FC<LibraryProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    field: 'all'
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Load data from localStorage on initial render
  useEffect(() => {
    setBooks(localStorage.getBooks());
    setUsers(localStorage.getUsers());
    setLoans(localStorage.getLoans());
    setTheme(localStorage.getTheme());
  }, []);
  
  // Update search results when books or filters change
  useEffect(() => {
    if (!searchFilters.query && !searchFilters.status && !searchFilters.year) {
      setSearchResults(books);
    } else {
      const filteredBooks = books.filter(book => {
        // Apply status filter
        if (searchFilters.status && book.status !== searchFilters.status) {
          return false;
        }
        
        // Apply year filter
        if (searchFilters.year !== undefined && book.year !== searchFilters.year) {
          return false;
        }
        
        // Apply text search
        if (searchFilters.query) {
          const query = searchFilters.query.toLowerCase();
          const field = searchFilters.field || 'all';
          
          if (field === 'title' || field === 'all') {
            if (book.title.toLowerCase().includes(query)) return true;
          }
          
          if (field === 'author' || field === 'all') {
            if (book.author.toLowerCase().includes(query)) return true;
          }
          
          if (field === 'publisher' || field === 'all') {
            if (book.publisher.toLowerCase().includes(query)) return true;
          }
          
          if (field === 'isbn' || field === 'all') {
            if (book.isbn.toLowerCase().includes(query)) return true;
          }
          
          return false;
        }
        
        return true;
      });
      
      setSearchResults(filteredBooks);
    }
  }, [books, searchFilters]);
  
  // Update localStorage when data changes
  useEffect(() => {
    localStorage.saveBooks(books);
  }, [books]);
  
  useEffect(() => {
    localStorage.saveUsers(users);
  }, [users]);
  
  useEffect(() => {
    localStorage.saveLoans(loans);
    
    // Check for overdue loans
    const updatedLoans = loans.map(loan => {
      if (loan.status === 'active' && !loan.returnDate && isLoanOverdue(loan.dueDate)) {
        return { ...loan, status: 'overdue' as const };
      }
      return loan;
    });
    
    if (JSON.stringify(updatedLoans) !== JSON.stringify(loans)) {
      setLoans(updatedLoans);
    }
  }, [loans]);
  
  useEffect(() => {
    localStorage.saveTheme(theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  // Book operations
  const addNewBook = (book: Omit<Book, 'id'>): string => {
    const id = generateId();
    const newBook: Book = { id, ...book };
    setBooks(prevBooks => [...prevBooks, newBook]);
    return id;
  };
  
  const updateExistingBook = (updatedBook: Book): void => {
    setBooks(prevBooks => 
      prevBooks.map(book => book.id === updatedBook.id ? updatedBook : book)
    );
  };
  
  const removeBook = (id: string): void => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
  };
  
  const getBookById = (id: string): Book | undefined => {
    return books.find(book => book.id === id);
  };
  
  // User operations
  const addNewUser = (user: Omit<User, 'id'>): string => {
    const id = generateId();
    const newUser: User = { id, ...user };
    setUsers(prevUsers => [...prevUsers, newUser]);
    return id;
  };
  
  const updateExistingUser = (updatedUser: User): void => {
    setUsers(prevUsers => 
      prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
  };
  
  const removeUser = (id: string): void => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
  };
  
  const getUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
  };
  
  // Loan operations
  const checkoutBook = (bookId: string, userId: string): string => {
    // Verify book and user exist
    const book = getBookById(bookId);
    const user = getUserById(userId);
    
    if (!book || !user) {
      throw new Error('Book or user not found');
    }
    
    if (book.status !== 'available') {
      throw new Error('Book is not available for checkout');
    }
    
    const today = getTodayISO();
    const dueDate = calculateDueDate(today);
    const id = generateId();
    
    // Create loan
    const newLoan: Loan = {
      id,
      bookId,
      userId,
      checkoutDate: today,
      dueDate,
      status: 'active'
    };
    
    setLoans(prevLoans => [...prevLoans, newLoan]);
    
    // Update book status
    updateExistingBook({
      ...book,
      status: 'borrowed'
    });
    
    return id;
  };
  
  const returnBook = (loanId: string): void => {
    const loan = loans.find(loan => loan.id === loanId);
    
    if (!loan) {
      throw new Error('Loan not found');
    }
    
    if (loan.status === 'returned') {
      throw new Error('Book already returned');
    }
    
    const book = getBookById(loan.bookId);
    
    if (!book) {
      throw new Error('Book not found');
    }
    
    // Update loan
    const updatedLoan: Loan = {
      ...loan,
      returnDate: getTodayISO(),
      status: 'returned'
    };
    
    setLoans(prevLoans => 
      prevLoans.map(loan => loan.id === loanId ? updatedLoan : loan)
    );
    
    // Update book status
    updateExistingBook({
      ...book,
      status: 'available'
    });
  };
  
  const getUserLoans = (userId: string): Loan[] => {
    return loans.filter(loan => loan.userId === userId);
  };
  
  const getBookLoans = (bookId: string): Loan[] => {
    return loans.filter(loan => loan.bookId === bookId);
  };
  
  const getOverdueLoans = (): Loan[] => {
    return loans.filter(loan => loan.status === 'overdue');
  };
  
  // Theme operations
  const toggleTheme = (): void => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  // Statistics
  const getLibraryStats = () => {
    return {
      totalBooks: books.length,
      availableBooks: books.filter(book => book.status === 'available').length,
      activeLoans: loans.filter(loan => loan.status === 'active' || loan.status === 'overdue').length,
      overdueLoans: loans.filter(loan => loan.status === 'overdue').length,
      totalUsers: users.length
    };
  };
  
  const value = {
    books,
    addNewBook,
    updateExistingBook,
    removeBook,
    getBookById,
    
    users,
    addNewUser,
    updateExistingUser,
    removeUser,
    getUserById,
    
    loans,
    checkoutBook,
    returnBook,
    getUserLoans,
    getBookLoans,
    getOverdueLoans,
    
    searchResults,
    searchFilters,
    setSearchFilters,
    
    theme,
    toggleTheme,
    
    getLibraryStats
  };
  
  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};