import { useState, useEffect } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';
import { MdBook } from 'react-icons/md';
import useAuth from '../hooks/useAuth';

const BookDetailsModal = ({ book, isOpen, onClose }) => {
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const [localReviews, setLocalReviews] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);
  const { getUserId } = useAuth();
  const userId = getUserId();

  const handleBorrow = (platform) => {
    let url = '';
    const searchTerm = `${book.title} ${book.author}`.replace(/ /g, '+');
    if (platform === 'Google Books') {
      url = book.googleBooksId ? `https://books.google.com/books?id=${book.googleBooksId}` : `https://books.google.com/books?hl=en&q=${searchTerm}`;
    } else if (platform === 'Amazon') {
      url = `https://www.amazon.com/s?k=${searchTerm}`;
    } else if (platform === 'Goodreads') {
      url = `https://www.goodreads.com/search?q=${searchTerm}`;
    }
    window.open(url, '_blank');
  };

  useEffect(() => {
    // Load reviews for this book from localStorage
    try {
      const all = JSON.parse(localStorage.getItem('reviews') || '[]');
      const matches = all.filter(r => r.bookId === (book.googleBooksId || book.googleBooksId));
      setLocalReviews(matches);
    } catch (err) {
      setLocalReviews([]);
    }
  }, [book]);

  const handleAddReview = () => {
    if (!userId) {
      alert('Please log in to add a review.');
      return;
    }
    if (review.rating > 0 && review.comment.trim()) {
      const newReview = {
        bookId: book.googleBooksId || book.googleBooksId,
        userId,
        rating: review.rating,
        comment: review.comment.trim(),
        date: new Date().toISOString(),
      };
      // Save to localStorage
      const all = JSON.parse(localStorage.getItem('reviews') || '[]');
      all.push(newReview);
      localStorage.setItem('reviews', JSON.stringify(all));
      // Update local state so UI updates immediately
      setLocalReviews(prev => [...prev, newReview]);
      setReview({ rating: 0, comment: '' });
      setHoverRating(0);
      alert('Review added!');
    }
  };

  const addToList = (status) => {
    if (!userId) {
      alert('Please log in to add books to your list.');
      return;
    }
    const bookData = { ...book, userId, status, dateAdded: new Date() };
    let savedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    const existingBookIndex = savedBooks.findIndex(b => b.googleBooksId === book.googleBooksId && b.userId === userId);
    if (existingBookIndex > -1) {
      savedBooks[existingBookIndex] = bookData;
    } else {
      savedBooks.push(bookData);
    }
    localStorage.setItem('books', JSON.stringify(savedBooks));
    alert(`Book added to ${status} list!`);
    onClose(); // Close modal after adding
  };

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-teal-800 text-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-teal-700 pb-4">
          <div className="flex items-center">
            <MdBook className="text-3xl text-gold-500 mr-3" />
            <h2 className="text-2xl font-bold">{book.title}</h2>
          </div>
          <FaTimes className="text-xl cursor-pointer hover:text-gold-500" onClick={onClose} />
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-56 h-80 object-cover rounded-lg shadow-md"
          />
          <div className="flex-1">
            <p className="text-lg"><strong>Author:</strong> {book.author}</p>
            <p className="text-lg"><strong>Genre:</strong> {book.genre || 'N/A'}</p>
            <p className="text-lg"><strong>Year:</strong> {book.publicationYear || 'N/A'}</p>
            <p className="text-lg"><strong>Rating:</strong> {book.averageRating || 'N/A'} <FaStar className="inline text-gold-500" /></p>
            <p className="mt-3 text-gray-300">{book.description}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gold-500">Borrow/Rent Options</h3>
          <div className="flex flex-wrap gap-4 mt-3">
            <button
              onClick={() => handleBorrow('Google Books')}
              className="bg-gold-200 text-teal-700 py-2 px-5 rounded-lg hover:bg-gold-600 transition-colors"
            >
              Borrow from Google
            </button>
            <button
              onClick={() => handleBorrow('Amazon')}
              className="bg-gold-200 text-teal-700 py-2 px-5 rounded-lg hover:bg-gold-600 transition-colors"
            >
              Rent from Amazon
            </button>
            <button
              onClick={() => handleBorrow('Goodreads')}
              className="bg-gold-200 text-teal-700 py-2 px-5 rounded-lg hover:bg-gold-600 transition-colors"
            >
              Check Goodreads
            </button>
          </div>
          {book.purchaseOptions?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-300">Purchase Options:</h4>
              <ul className="list-disc pl-5 mt-2">
                {book.purchaseOptions.map((option, index) => (
                  <li key={index} className="text-salmon-400">
                    <a
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {option.platform} (${option.price || 'N/A'})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mt-6 border-t border-teal-700 pt-4">
          <h3 className="text-xl font-semibold text-gold-500">Add to List</h3>
          <div className="flex gap-4 mt-3">
            <button
              onClick={() => addToList('tbr')}
              className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
            >
              To Be Read
            </button>
            <button
              onClick={() => addToList('reading')}
              className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Reading
            </button>
            <button
              onClick={() => addToList('read')}
              className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Read
            </button>
          </div>
          <h3 className="text-xl font-semibold text-gold-500 mt-6">Reviews</h3>
            {((book.reviews && book.reviews.length) || localReviews.length) > 0 ? (
              <>
                {book.reviews?.map((r, index) => (
                  <div key={`b-${index}`} className="border-b border-teal-700 py-3">
                    <p className="text-gray-300"><strong>Rating:</strong> {r.rating} <FaStar className="inline text-salmon-500" /></p>
                    <p className="text-gray-400">{r.comment}</p>
                    <p className="text-sm text-gray-500">Posted on {new Date(r.date).toLocaleDateString()}</p>
                  </div>
                ))}
                {localReviews.map((r, index) => (
                  <div key={`l-${index}`} className="border-b border-teal-700 py-3">
                    <p className="text-gray-300"><strong>Rating:</strong> {r.rating} <FaStar className="inline text-salmon-500" /></p>
                    <p className="text-gray-400">{r.comment}</p>
                    <p className="text-sm text-gray-500">Posted on {new Date(r.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-gray-400">No reviews yet.</p>
            )}
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-gold-700">Add a Review</h4>
              <div className="flex items-center mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer ${ (hoverRating || review.rating) >= star ? 'text-gold-400' : 'text-gray-400' }`} 
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setReview({ ...review, rating: star })}
                    size={20}
                  />
                ))}
              </div>
            <textarea
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              placeholder="Write your review..."
              className="w-full p-3 border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-salmon-500 mb-3"
              rows="4"
            />
            <button
              onClick={handleAddReview}
              className="bg-gold-500 text-teal-700 py-2 px-6 rounded-lg hover:bg-gold-600 transition-colors"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;