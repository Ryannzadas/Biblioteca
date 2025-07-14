// Book related types
export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
  isbn: string;
  location: BookLocation;
  status: BookStatus;
  coverImage?: string;
}

export interface BookLocation {
  block: string;
  row: number;
  section: string;
}

export type BookStatus = 'available' | 'borrowed' | 'reserved' | 'maintenance';

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  memberSince: string;
  role: UserRole;
}

export type UserRole = 'member' | 'librarian' | 'admin';

// Loan related types
export interface Loan {
  id: string;
  bookId: string;
  userId: string;
  checkoutDate: string;
  dueDate: string;
  returnDate?: string;
  status: LoanStatus;
}

export type LoanStatus = 'active' | 'returned' | 'overdue';

// Search related types
export interface SearchFilters {
  query: string;
  field?: 'title' | 'author' | 'publisher' | 'isbn' | 'all';
  status?: BookStatus;
  year?: number;
}