import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import AdminMovies   from './AdminMovies';
import AdminCinemas  from './AdminCinemas';
import AdminShows    from './AdminShows';
import AdminBookings from './AdminBookings';
import AdminSeatManager from './AdminSeatManagerPage';

const NAV = [
  { id: 'dashboard', label: 'Dashboard',  icon: '📊' },
  { id: 'movies',    label: 'Movies',     icon: '🎬' },
  { id: 'cinemas',   label: 'Cinemas',    icon: '🏛️' },
  { id: 'shows',     label: 'Shows',      icon: '📅' },
  { id: 'seats',     label: 'Seat Mgmt',  icon: '🔒' },
  { id: 'bookings',  label: 'Bookings',   icon: '🎟️' },
];

const PAGES = {
  dashboard: AdminDashboard,
  movies:    AdminMovies,
  cinemas:   AdminCinemas,
  shows:     AdminShows,
  seats:     AdminSeatManager,
  bookings:  AdminBookings,
};

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [active, setActive] = useState('dashboard');

  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  const Page = PAGES[active];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Sidebar ── */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col fixed top-16 bottom-0 z-30">
        {/* Brand */}
        <div className="p-5 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admin Panel</p>
          <p className="text-sm font-semibold text-gray-900 mt-0.5">Mana Cinemas</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
                ${active === n.id
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <span className="text-base">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 ml-56 p-8">
        <Page />
      </main>
    </div>
  );
};

export default AdminPanel;
