import React, { useState } from 'react';
import { PlusCircle, Book as BookIcon } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { Book } from '../types';
import PageHeader from '../components/layout/PageHeader';
import BookCard from '../components/books/BookCard';
import Modal from '../components/common/Modal';
import BookForm from '../components/books/BookForm';
import EmptyState from '../components/common/EmptyState';

const Books: React.FC = () => {
  const { books, addNewBook, updateExistingBook } = useLibrary();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  
  const handleOpenModal = (book?: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(undefined);
  };
  
  const handleSubmit = (book: Book) => {
    if (editingBook) {
      updateExistingBook(book);
    } else {
      addNewBook(book);
    }
    handleCloseModal();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Books" 
        description="Manage your library's book collection"
        actions={
          <button 
            onClick={() => handleOpenModal()} 
            className="btn-primary flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Book
          </button>
        }
      />
      
      {books.length === 0 ? (
        <EmptyState
          title="No books in the library"
          description="Your book collection is empty. Start by adding some books to your library."
          icon={<BookIcon className="h-8 w-8" />}
          action={
            <button 
              onClick={() => handleOpenModal()} 
              className="btn-primary"
            >
              Add Your First Book
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBook ? 'Edit Book' : 'Add New Book'}
        size="lg"
      >
        <BookForm
          initialData={editingBook}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Books;