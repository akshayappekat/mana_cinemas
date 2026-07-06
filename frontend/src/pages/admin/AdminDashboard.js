import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE from '../../config/api';

const API = `${API_BASE}/api`;

// ── reusable stat card
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({ movies: 0, cinemas: 0, shows: 0, bookings: 0 });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get(`${API}/movies`),
      axios.get(`${API}/cinemas`),
      axios.get(`${API}/shows`),
      axios.get(`${API}/bookings`, { headers }),
    ]).then(([m, c, s, b]) => {
      setStats({
        movies: m.data.count,
        cinemas: c.data.count,
        shows: s.data.count,
        bookings: b.data.count,
      });
      setRecentBookings(b.data.bookings.slice(0, 8));
    }).catch(console.error);
  }, [token]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Overview of your cinema platform</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🎬" label="Total Movies"   value={stats.movies}   color="bg-blue-50" />
        <StatCard icon="🏛️" label="Cinemas"        value={stats.cinemas}  color="bg-purple-50" />
        <StatCard icon="📅" label="Active Shows"   value={stats.shows}    color="bg-green-50" />
        <StatCard icon="🎟️" label="Bookings"       value={stats.bookings} color="bg-orange-50" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {['Booking ID', 'User', 'Movie', 'Cinema', 'Seats', 'Amount', 'Status'].map(h => (
                  <th key={h} className="text-left py-3 px-2 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2 font-mono text-xs">{b.bookingId || b._id.slice(-8)}</td>
                  <td className="py-3 px-2">{b.user?.name || '—'}</td>
                  <td className="py-3 px-2 font-medium">{b.show?.movie?.title || '—'}</td>
                  <td className="py-3 px-2">{b.show?.cinema?.name || '—'}</td>
                  <td className="py-3 px-2">{b.seats?.join(', ')}</td>
                  <td className="py-3 px-2 font-semibold">₹{b.totalAmount}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${b.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-700'
                      : b.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'}`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
