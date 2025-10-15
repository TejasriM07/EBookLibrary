import React, { useRef, useState } from 'react';
import { FaStar } from 'react-icons/fa';
const BookCard = ({ book, onClick, buttonText }) => {
  const [isOpening, setIsOpening] = useState(false);
  const cardRef = useRef(null);

  const handleCardClick = (e) => {
    // If no click handler provided, do nothing
    if (!onClick) return;
    // Prevent double clicks while animation plays
    if (isOpening) return;

    // Play a small click/open sound (Web Audio API). Must be initiated by user gesture.
    try {
      if (typeof window !== 'undefined' && window.AudioContext) {
        const AC = window.AudioContext || window.webkitAudioContext;
        const ctx = new AC();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(420, ctx.currentTime);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.01);
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        // gentle frequency sweep downward
        o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.26);
        // fade out quickly
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
        setTimeout(() => {
          try { o.stop(); ctx.close(); } catch (e) { /* ignore */ }
        }, 500);
      }
    } catch (err) {
      // If WebAudio is blocked or errors, silently ignore.
    }

    // Start opening animation then call onClick after it finishes
    setIsOpening(true);
    const duration = 520; // match CSS animation duration (ms)
    setTimeout(() => {
      setIsOpening(false);
      onClick(book);
    }, duration);
  };

  return (
    <div
      ref={cardRef}
      role={onClick ? 'button' : undefined}
      tabIndex={0}
      className={`book-card ${isOpening ? 'opening' : ''} bg-gradient-to-br from-teal-700 to-teal-800 text-white shadow-lg rounded-xl p-2 sm:p-4 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-teal-600 relative overflow-hidden`}
      onClick={handleCardClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(e); } }}
    >
      <div className="card-shimmer absolute inset-0 bg-gold-500/20 opacity-0 hover:opacity-90 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
      <div className="relative">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-32 sm:h-48 object-cover rounded-lg transform transition-transform duration-400 book-card-img"
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