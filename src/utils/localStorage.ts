import { Book, User, Loan } from '../types';

// Local Storage Keys
const BOOKS_KEY = 'library_books';
const USERS_KEY = 'library_users';
const LOANS_KEY = 'library_loans';
const THEME_KEY = 'library_theme';

// Books
export const getBooks = (): Book[] => {
  const books = localStorage.getItem(BOOKS_KEY);
  return books ? JSON.parse(books) : [];
};

export const saveBooks = (books: Book[]): void => {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
};

export const addBook = (book: Book): void => {
  const books = getBooks();
  saveBooks([...books, book]);
};

export const updateBook = (updatedBook: Book): void => {
  const books = getBooks();
  const index = books.findIndex((book) => book.id === updatedBook.id);
  if (index !== -1) {
    books[index] = updatedBook;
    saveBooks(books);
  }
};

export const deleteBook = (id: string): void => {
  const books = getBooks();
  saveBooks(books.filter((book) => book.id !== id));
};

export const getBook = (id: string): Book | undefined => {
  const books = getBooks();
  return books.find((book) => book.id === id);
};

// Users
export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const addUser = (user: User): void => {
  const users = getUsers();
  saveUsers([...users, user]);
};

export const updateUser = (updatedUser: User): void => {
  const users = getUsers();
  const index = users.findIndex((user) => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
  }
};

export const deleteUser = (id: string): void => {
  const users = getUsers();
  saveUsers(users.filter((user) => user.id !== id));
};

export const getUser = (id: string): User | undefined => {
  const users = getUsers();
  return users.find((user) => user.id === id);
};

// Loans
export const getLoans = (): Loan[] => {
  const loans = localStorage.getItem(LOANS_KEY);
  return loans ? JSON.parse(loans) : [];
};

export const saveLoans = (loans: Loan[]): void => {
  localStorage.setItem(LOANS_KEY, JSON.stringify(loans));
};

export const addLoan = (loan: Loan): void => {
  const loans = getLoans();
  saveLoans([...loans, loan]);
};

export const updateLoan = (updatedLoan: Loan): void => {
  const loans = getLoans();
  const index = loans.findIndex((loan) => loan.id === updatedLoan.id);
  if (index !== -1) {
    loans[index] = updatedLoan;
    saveLoans(loans);
  }
};

export const deleteLoan = (id: string): void => {
  const loans = getLoans();
  saveLoans(loans.filter((loan) => loan.id !== id));
};

export const getLoan = (id: string): Loan | undefined => {
  const loans = getLoans();
  return loans.find((loan) => loan.id === id);
};

export const getLoansByUser = (userId: string): Loan[] => {
  const loans = getLoans();
  return loans.filter((loan) => loan.userId === userId);
};

export const getLoansByBook = (bookId: string): Loan[] => {
  const loans = getLoans();
  return loans.filter((loan) => loan.bookId === bookId);
};

export const getActiveLoans = (): Loan[] => {
  const loans = getLoans();
  return loans.filter((loan) => loan.status === 'active' || loan.status === 'overdue');
};

export const getOverdueLoans = (): Loan[] => {
  const loans = getLoans();
  return loans.filter((loan) => loan.status === 'overdue');
};

// Theme
export const getTheme = (): 'light' | 'dark' => {
  return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
};

export const saveTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, theme);
};