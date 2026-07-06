import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../config/api';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Movies');
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const categories = ['All', 'Dining', 'Events', 'Movies', 'Stores', 'Activities', 'Play'];

  useEffect(() => {
    if (isOpen) {
      fetchTrendingMovies();
      // Focus search input when modal opens
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchMovies();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchTrendingMovies = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/movies?status=nowShowing`);
      setTrendingMovies(res.data.movies.slice(0, 10));
    } catch (err) {
      console.error(err);
    }
  };

  const searchMovies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/movies`);
      const filtered = res.data.movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
    onClose();
    setSearchQuery('');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      setSearchQuery('');
    }
  };

  if (!isOpen) return null;

  const displayMovies = searchQuery.trim() ? searchResults : trendingMovies;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-4 px-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mb-8 animate-slideDown">
        {/* Search Bar */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg text-gray-900 placeholder-gray-400 bg-gray-50 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="px-6 py-4 border-b border-gray-100 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {searchQuery.trim() ? 'Search Results' : 'Trending in Hyderabad'}
          </h3>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Searching...</div>
          ) : displayMovies.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {searchQuery.trim() ? 'No movies found' : 'No trending movies available'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayMovies.map((movie) => (
                <button
                  key={movie._id}
                  onClick={() => handleMovieClick(movie._id)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition text-left group"
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://via.placeholder.com/64x64/e5e7eb/6b7280?text=' +
                        encodeURIComponent(movie.title.substring(0, 1));
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-primary transition">
                      {movie.title}
                    </h4>
                    <p className="text-sm text-gray-500">Movie</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            onClose();
            setSearchQuery('');
          }}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default SearchModal;
