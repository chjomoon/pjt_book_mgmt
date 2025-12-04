import { useState, useEffect } from 'react';
import { BookList } from './components/BookList';
import { BookDetail } from './components/BookDetail';
import { BookForm } from './components/BookForm';

export interface Book {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

type ViewMode = 'list' | 'detail' | 'create' | 'edit';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load books from localStorage
  useEffect(() => {
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
    setIsLoading(false);
  }, []);

  // Save books to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('books', JSON.stringify(books));
    }
  }, [books, isLoading]);

  const handleCreateBook = (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBooks([newBook, ...books]);
    setViewMode('list');
  };

  const handleUpdateBook = (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedBookId) return;
    
    setBooks(books.map(book => 
      book.id === selectedBookId 
        ? { ...book, ...bookData, updatedAt: new Date().toISOString() }
        : book
    ));
    setViewMode('detail');
  };

  const handleDeleteBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id));
    setViewMode('list');
  };

  const handleViewBook = (id: string) => {
    setSelectedBookId(id);
    setViewMode('detail');
  };

  const handleEditBook = (id: string) => {
    setSelectedBookId(id);
    setViewMode('edit');
  };

  const handleBackToList = () => {
    setSelectedBookId(null);
    setViewMode('list');
  };

  const selectedBook = selectedBookId ? books.find(b => b.id === selectedBookId) : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-gray-900">📚 도서 관리 시스템</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {viewMode === 'list' && (
          <BookList 
            books={books}
            onViewBook={handleViewBook}
            onCreateNew={() => setViewMode('create')}
          />
        )}

        {viewMode === 'detail' && selectedBook && (
          <BookDetail
            book={selectedBook}
            onBack={handleBackToList}
            onEdit={() => handleEditBook(selectedBook.id)}
            onDelete={handleDeleteBook}
          />
        )}

        {viewMode === 'create' && (
          <BookForm
            mode="create"
            onSubmit={handleCreateBook}
            onCancel={handleBackToList}
          />
        )}

        {viewMode === 'edit' && selectedBook && (
          <BookForm
            mode="edit"
            book={selectedBook}
            onSubmit={handleUpdateBook}
            onCancel={() => setViewMode('detail')}
          />
        )}
      </main>
    </div>
  );
}
