import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE from '../../config/api';

const AdminBookings = () => {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    axios.get(`${API_BASE}/api/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => setBookings(r.data.bookings)).catch(console.error);
  }, [token]);

  const filtered = bookings.filter(b => {
    const matchSearch =
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.show?.movie?.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.bookingStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = bookings
    .filter(b => b.bookingStatus === 'confirmed')
    .reduce((s, b) => s + (b.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
          <p className="text-gray-500 text-sm">{bookings.length} total · Revenue: ₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by user, movie, booking ID..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white text-sm" />
        </div>
        <div className="flex gap-2">
          {['all', 'confirmed', 'cancelled', 'pending'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition
                ${statusFilter === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Booking ID', 'User', 'Movie', 'Cinema', 'Date & Time', 'Seats', 'Amount', 'Payment', 'Status'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-xs text-gray-600">{b.bookingId || b._id.slice(-8).toUpperCase()}</td>
                <td className="py-3 px-4">
                  <p className="font-medium">{b.user?.name || '—'}</p>
                  <p className="text-xs text-gray-400">{b.user?.email}</p>
                </td>
                <td className="py-3 px-4 font-semibold">{b.show?.movie?.title || '—'}</td>
                <td className="py-3 px-4 text-gray-600">{b.show?.cinema?.name || '—'}</td>
                <td className="py-3 px-4 text-xs">
                  <p>{b.show?.showDate ? new Date(b.show.showDate).toLocaleDateString('en-IN') : '—'}</p>
                  <p className="text-gray-400">{b.show?.showTime}</p>
                </td>
                <td className="py-3 px-4 text-xs font-mono">{b.seats?.join(', ')}</td>
                <td className="py-3 px-4 font-bold">₹{b.totalAmount}</td>
                <td className="py-3 px-4">
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full capitalize">{b.paymentMethod}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize
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
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No bookings found</div>}
      </div>
    </div>
  );
};

export default AdminBookings;
