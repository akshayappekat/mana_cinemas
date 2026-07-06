import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import API_BASE from '../config/api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('nowShowing');
  const [heroIndex, setHeroIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, [filter]);

  // Auto-advance hero carousel every 5 seconds
  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 5000);
    return () => clearInterval(timer);
  }, [movies]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/movies?status=${filter}`);
      setMovies(res.data.movies);
      setHeroIndex(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const heroMovies = movies.slice(0, 5);
  const heroMovie = heroMovies[heroIndex];

  const prevHero = () =>
    setHeroIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
  const nextHero = () =>
    setHeroIndex((prev) => (prev + 1) % heroMovies.length);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO CAROUSEL ── */}
      {!loading && heroMovie && filter === 'nowShowing' && (
        <div className="relative bg-white overflow-hidden" style={{ minHeight: 420 }}>
          {/* Blurred background */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{
              backgroundImage: `url(${heroMovie.posterUrl})`,
              filter: 'blur(40px) brightness(0.35)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 flex items-center gap-10 py-10"
               style={{ minHeight: 420 }}>
            {/* Left arrow */}
            <button
              onClick={prevHero}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 text-white text-xl transition flex-shrink-0"
            >
              ‹
            </button>

            {/* Text content */}
            <div className="flex-1 text-white space-y-4 min-w-0">
              <div className="flex flex-wrap gap-2 text-sm font-medium">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {heroMovie.rating || 'U/A'}
                </span>
                {heroMovie.genre?.slice(0, 3).map((g, i) => (
                  <span key={i} className="bg-white bg-opacity-10 px-3 py-1 rounded-full">
                    {g}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
                {heroMovie.title}
              </h1>

              <p className="text-gray-200 text-sm md:text-base max-w-lg leading-relaxed line-clamp-3">
                {heroMovie.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-300">
                {heroMovie.imdbRating > 0 && (
                  <span>⭐ {heroMovie.imdbRating}/10 IMDb</span>
                )}
                <span>🎬 {heroMovie.language?.join(' / ')}</span>
                {heroMovie.duration && <span>⏱ {heroMovie.duration} min</span>}
              </div>

              <button
                onClick={() => navigate(`/movies/${heroMovie._id}`)}
                className="inline-block bg-white text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition shadow-lg text-sm"
              >
                Book Now
              </button>
            </div>

            {/* Poster */}
            <div className="flex-shrink-0 hidden sm:block">
              <img
                src={heroMovie.posterUrl}
                alt={heroMovie.title}
                className="w-44 md:w-56 rounded-2xl shadow-2xl object-cover"
                style={{ aspectRatio: '2/3' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://via.placeholder.com/300x450/333/fff?text=' +
                    encodeURIComponent(heroMovie.title);
                }}
              />
            </div>

            {/* Right arrow */}
            <button
              onClick={nextHero}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 text-white text-xl transition flex-shrink-0"
            >
              ›
            </button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroMovies.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === heroIndex ? 'w-6 bg-white' : 'w-2 bg-white bg-opacity-40'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── MOVIES SECTION ── */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filter === 'nowShowing' ? '🎬 Now in Theatres' : '🗓 Coming Soon'}
          </h2>

          {/* Filter tabs */}
          <div className="flex bg-gray-200 rounded-full p-1 gap-1">
            <button
              onClick={() => setFilter('nowShowing')}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition ${
                filter === 'nowShowing'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Now Showing
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition ${
                filter === 'upcoming'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="rounded-xl bg-gray-200 animate-pulse" style={{ aspectRatio: '2/3' }} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">🎥</div>
            <div className="text-lg font-medium">No movies found</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
