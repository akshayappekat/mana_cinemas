import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SearchModal from './SearchModal';
import LocationModal from './LocationModal';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Hyderabad');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="text-2xl font-black text-gray-900 tracking-tight">
                mana<span className="text-primary">cinemas</span>
              </div>
            </Link>

            {/* Location — clickable */}
            <button
              onClick={() => setIsLocationOpen(true)}
              className="hidden md:flex items-center gap-1.5 text-sm text-gray-700 hover:text-indigo-600 transition group"
            >
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-semibold">{selectedCity}</span>
              <svg className="w-3 h-3 text-gray-400 group-hover:text-indigo-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                isActive('/')
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Movies
            </Link>

            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    isActive('/my-bookings')
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  My Bookings
                </Link>
                <Link
                  to="/profile"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    isActive('/profile')
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                      isActive('/admin')
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    ⚙️ Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="ml-2 bg-primary text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-secondary transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-2 bg-primary text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-secondary transition"
                >
                  Register
                </Link>
              </>
            )}

            {/* Search icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="ml-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User avatar (if logged in) */}
            {user && (
              <div className="ml-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
      />
    </nav>
  );
};

export default Navbar;
