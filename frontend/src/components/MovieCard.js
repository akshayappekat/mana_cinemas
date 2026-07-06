import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movies/${movie._id}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        {/* Poster */}
        <div className="relative bg-gray-100 overflow-hidden" style={{ aspectRatio: '2/3' }}>
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://via.placeholder.com/300x450/e5e7eb/6b7280?text=' +
                  encodeURIComponent(movie.title);
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No Poster
            </div>
          )}

          {/* Rating badge */}
          {movie.rating && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs font-semibold px-2 py-1 rounded">
              {movie.rating}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-bold text-sm text-gray-900 mb-1.5 line-clamp-1 group-hover:text-primary transition">
            {movie.title}
          </h3>

          <div className="flex flex-wrap gap-1 mb-2">
            {movie.genre?.slice(0, 2).map((g, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
              >
                {g}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className="line-clamp-1">{movie.language?.join(', ')}</span>
            {movie.imdbRating > 0 && (
              <span className="font-semibold ml-2 flex-shrink-0">
                ⭐ {movie.imdbRating}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
