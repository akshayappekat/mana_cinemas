import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FIXED_TIMES = [
  { label: '10:00 AM', sub: 'VIP' },
  { label: '01:00 PM', sub: 'DOLBY ATMOS' },
  { label: '04:00 PM', sub: 'DOLBY ATMOS' },
  { label: '07:00 PM', sub: 'DOLBY ATMOS' },
  { label: '10:00 PM', sub: 'DOLBY ATMOS' },
];

// Extract YouTube video ID from any YouTube URL format
const getYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/v\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
};

// ── Trailer Modal
const TrailerModal = ({ videoId, title, onClose }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-4xl"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-lg">{title} — Official Trailer</h3>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 text-3xl leading-none"
        >
          ×
        </button>
      </div>
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
           style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={`${title} Trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  </div>
);

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => { fetchMovieAndShows(); }, [id, selectedDate]);

  const fetchMovieAndShows = async () => {
    setLoading(true);
    try {
      const [movieRes, showsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/movies/${id}`),
        axios.get(`http://localhost:5000/api/shows?movieId=${id}&date=${selectedDate}`),
      ]);
      setMovie(movieRes.data.movie);
      setShows(showsRes.data.shows);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const groupShowsByCinema = () => {
    const grouped = {};
    shows.forEach((show) => {
      const cinemaId = show.cinema._id;
      if (!grouped[cinemaId]) grouped[cinemaId] = { cinema: show.cinema, shows: [] };
      grouped[cinemaId].shows.push(show);
    });
    return Object.values(grouped);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  );
  if (!movie) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">Movie not found</div>
  );

  const youtubeId = getYouTubeId(movie.trailerUrl);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Banner ── */}
      <div className="relative bg-gray-900 overflow-hidden" style={{ minHeight: 420 }}>
        {/* Blurred poster bg */}
        {movie.posterUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${movie.posterUrl})`,
              filter: 'blur(30px) brightness(0.25)',
              transform: 'scale(1.1)',
            }}
          />
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={movie.posterUrl || 'https://via.placeholder.com/260x390/333/fff?text=No+Poster'}
              alt={movie.title}
              className="w-48 md:w-64 rounded-2xl shadow-2xl object-cover"
              style={{ aspectRatio: '2/3' }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-white space-y-4 min-w-0">
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">{movie.rating}</span>
              {movie.genre?.map(g => (
                <span key={g} className="bg-white bg-opacity-10 px-3 py-1 rounded-full">{g}</span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight">{movie.title}</h1>

            <div className="flex flex-wrap gap-5 text-sm text-gray-300">
              {movie.imdbRating > 0 && (
                <span className="flex items-center gap-1">⭐ <strong className="text-white">{movie.imdbRating}</strong>/10 IMDb</span>
              )}
              <span>⏱ {movie.duration} mins</span>
              <span>🎬 {movie.language?.join(' / ')}</span>
              <span>📅 {new Date(movie.releaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>

            {movie.director && (
              <p className="text-sm text-gray-300">
                <span className="text-gray-400">Director:</span>{' '}
                <span className="text-white font-medium">{movie.director}</span>
              </p>
            )}

            <p className="text-gray-300 text-sm leading-relaxed max-w-xl line-clamp-3">
              {movie.description}
            </p>

            {/* Cast */}
            {movie.cast?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.cast.slice(0, 4).map((c, i) => (
                  <div key={i} className="bg-white bg-opacity-10 rounded-lg px-3 py-1.5 text-xs">
                    <p className="font-semibold text-white">{c.name}</p>
                    <p className="text-gray-400">{c.role}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Trailer button */}
            {youtubeId ? (
              <button
                onClick={() => setShowTrailer(true)}
                className="inline-flex items-center gap-3 bg-white text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition shadow-lg mt-2"
              >
                <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">▶</span>
                Watch Trailer
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 bg-white bg-opacity-10 text-gray-400 text-sm px-5 py-2.5 rounded-full border border-white border-opacity-20 mt-2">
                <span>▶</span> No trailer available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Trailer / Poster Card Section ── */}
      <div className="relative bg-gray-900 overflow-hidden py-16">
        {/* Full blurred poster background */}
        {movie.posterUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${movie.posterUrl})`,
              filter: 'blur(40px) brightness(0.3) saturate(1.4)',
              transform: 'scale(1.15)',
            }}
          />
        )}

        {/* Centered poster card with play button */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`relative group ${youtubeId ? 'cursor-pointer' : ''}`}
            style={{ width: 280 }}
            onClick={() => youtubeId && setShowTrailer(true)}
          >
            {/* Poster card */}
            <img
              src={movie.posterUrl || 'https://via.placeholder.com/280x420/333/fff?text=No+Poster'}
              alt={movie.title}
              className="w-full rounded-3xl shadow-2xl object-cover"
              style={{ aspectRatio: '2/3' }}
            />

            {/* Play button overlay — only if trailer exists */}
            {youtubeId && (
              <div className="absolute inset-0 flex items-center justify-center rounded-3xl
                              bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-25 border-2 border-white border-opacity-60
                                flex items-center justify-center backdrop-blur-sm
                                group-hover:scale-110 group-hover:bg-opacity-35 transition-all duration-300 shadow-xl">
                  <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Movie title at bottom of card */}
            <div className="absolute bottom-0 left-0 right-0 rounded-b-3xl overflow-hidden">
              <div
                className="px-5 pt-10 pb-5"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                }}
              >
                <p className="text-white font-black text-2xl leading-tight tracking-wide drop-shadow-lg uppercase">
                  {movie.title}
                </p>
              </div>
            </div>
          </div>

          {/* Watch Trailer label below card */}
          {youtubeId ? (
            <button
              onClick={() => setShowTrailer(true)}
              className="mt-6 flex items-center gap-2 text-white text-sm font-semibold
                         bg-white bg-opacity-15 hover:bg-opacity-25 backdrop-blur-sm
                         px-6 py-2.5 rounded-full border border-white border-opacity-30 transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Trailer
            </button>
          ) : (
            <p className="mt-5 text-gray-500 text-sm">No trailer available</p>
          )}
        </div>
      </div>

      {/* ── Book Tickets ── */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Tickets</h2>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-600">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {shows.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <div className="text-4xl mb-2">🎭</div>
              <p>No shows available for this date</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupShowsByCinema().map((group) => (
                <div key={group.cinema._id} className="border-b border-gray-100 pb-6 last:border-0">
                  <h3 className="font-bold text-lg text-gray-900 mb-0.5">{group.cinema.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    📍 {group.cinema.location.address}, {group.cinema.location.city}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {FIXED_TIMES.map((time, idx) => {
                      const show = group.shows[idx % group.shows.length];
                      const noSeats = show?.availableSeats === 0;
                      return (
                        <button
                          key={idx}
                          onClick={() => !noSeats && navigate(`/booking/${show._id}`)}
                          disabled={noSeats}
                          className={`border-2 rounded-xl px-5 py-3 text-left transition min-w-[110px]
                            ${noSeats
                              ? 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                              : 'border-primary text-primary hover:bg-primary hover:text-white'
                            }`}
                        >
                          <div className="font-bold text-base leading-tight">{time.label}</div>
                          <div className="text-xs mt-0.5 opacity-80">{time.sub}</div>
                          <div className="text-xs mt-0.5 opacity-70">
                            {noSeats ? 'Houseful' : `${show?.availableSeats ?? 80} seats`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Trailer Modal ── */}
      {showTrailer && youtubeId && (
        <TrailerModal
          videoId={youtubeId}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
};

export default MovieDetails;
