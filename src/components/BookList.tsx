import { Book } from '../App';
import { BookCard } from './BookCard';
import { Plus } from 'lucide-react';

interface BookListProps {
  books: Book[];
  onViewBook: (id: string) => void;
  onCreateNew: () => void;
}

export function BookList({ books, onViewBook, onCreateNew }: BookListProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">총 {books.length}권의 도서가 등록되어 있습니다</p>
        </div>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          신규 도서 등록
        </button>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-gray-500 mb-2">등록된 도서가 없습니다</p>
          <p className="text-gray-400">새로운 도서를 등록해보세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => onViewBook(book.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
