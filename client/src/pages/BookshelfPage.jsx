import { useState, useEffect } from 'react';
import { searchBooksFromGoogle, fetchRandomBooksFromGoogle } from '../api/api';
import BookCard from '../components/BookCard';
import BookDetailsModal from '../components/BookDetailsModal';
import { MdLibraryBooks } from 'react-icons/md';
import { MdSearch } from 'react-icons/md';

const BookshelfPage = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const loadRandomBooks = async () => {
      try {
        setError('');
        const randomBooks = await fetchRandomBooksFromGoogle();
        setBooks(randomBooks);
      } catch (err) {
        setError(err.message || 'Failed to load random books');
      } finally {
        setLoading(false);
      }
    };
    loadRandomBooks();
  }, []);

  const handleSearch = async () => {
    if (!search) return;
    setLoading(true);
    setError('');
    try {
      const searchedBooks = await searchBooksFromGoogle(search);
      setBooks(searchedBooks);
    } catch (err) {
      setError(err.message || 'Failed to search books');
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  if (loading) return <div className="container mx-auto p-4 text-center">Loading books...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <MdLibraryBooks className="text-3xl text-teal-600 mr-3" />
        <h1 className="text-3xl font-bold text-teal-800">My Bookshelf</h1>
      </div>
      <div className="mb-6 flex items-center">
        <div className="relative w-full md:w-3/4">
          <input
            type="text"
            placeholder="Search books by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 pl-10 border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
          <MdSearch className="absolute left-3 top-3 text-teal-600" />
        </div>
        <button
          onClick={handleSearch}
          className="ml-4 bg-teal-700 text-gold-600 py-3 px-6 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <BookCard key={book.googleBooksId} book={book} onClick={handleBookClick} />
          ))
        ) : (
          <p className="text-center text-gray-500">No books found.</p>
        )}
      </div>
      <BookDetailsModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default BookshelfPage;