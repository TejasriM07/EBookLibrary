import { FaStar } from 'react-icons/fa';
import { MdFavoriteBorder } from 'react-icons/md';
const BookCard = ({ book, onClick, buttonText }) => {
  const handleCardClick = (e) => {
    if (onClick) {
      onClick(book);
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-teal-700 to-teal-800 text-white shadow-lg rounded-xl p-2 sm:p-4 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-teal-600 relative overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="absolute inset-0 bg-gold-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      <div className="relative">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-32 sm:h-48 object-cover rounded-lg"
          onError={(e) => { e.target.src = 'https://placehold.co/200x300'; }}
        />
        {/* favorite icon removed - not functional */}
      </div>
      <h3 className="text-base sm:text-lg font-semibold mt-2 sm:mt-3 truncate">{book.title}</h3>
      <p className="text-xs sm:text-sm text-gray-200 mt-1">{book.author}</p>
      <div className="flex items-center mt-1 sm:mt-2">
        <FaStar className="text-gold-500 text-xs sm:text-sm mr-1" />
        <span className="text-gray-100 text-xs sm:text-sm">{book.averageRating ? `${book.averageRating}/5` : 'N/A'}</span>
      </div>
      <p className="text-xs sm:text-sm text-gray-300 mt-1">ISBN: {book.isbn}</p>
      {buttonText && (
        <button
          onClick={(e) => e.stopPropagation()}
          className="mt-2 w-full bg-gold-500 text-white py-1 sm:py-2 rounded-lg hover:bg-gold-600 transition-colors text-xs sm:text-sm"
        >
          {buttonText}
        </button>
        )}
    </div>
  );
};

export default BookCard;