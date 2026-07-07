import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE from '../../config/api';
import AdminSeatManager from './AdminSeatManager';

const AdminSeatManagerPage = () => {
  const { token } = useContext(AuthContext);
  const [shows, setShows] = useState([]);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchShows();
  }, [filterDate]);

  const fetchShows = async () => {
    setLoading(true);
    try {
      const url = filterDate
        ? `${API_BASE}/api/shows?date=${filterDate}`
        : `${API_BASE}/api/shows`;
      const res = await axios.get(url);
      setShows(res.data.shows);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = shows;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Seat Management</h2>
        <p className="text-gray-500 text-sm mt-1">Block or unblock seats for any show</p>
      </div>

      {/* Date filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600">Filter by date:</label>
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button onClick={() => setFilterDate('')} className="text-sm text-gray-400 hover:text-gray-600">
          Show All
        </button>
      </div>

      {/* Shows list */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading shows…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No shows found for this date</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(show => {
            const blocked = show.blockedSeats?.length || 0;
            const booked = show.bookedSeats?.length || 0;
            return (
              <div key={show._id} className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{show.movie?.title || '—'}</h3>
                  <p className="text-sm text-gray-500">{show.cinema?.name} · {show.showTime}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(show.showDate).toLocaleDateString('en-IN')} · {show.format}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs">
                    <span className="text-green-600 font-semibold">
                      ✅ {show.availableSeats} available
                    </span>
                    <span className="text-gray-500">🎟️ {booked} booked</span>
                    {blocked > 0 && (
                      <span className="text-orange-500 font-semibold">🔒 {blocked} blocked</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedShow(show)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition flex items-center gap-2"
                >
                  🔒 Manage Seats
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Seat Manager Modal */}
      {selectedShow && (
        <AdminSeatManager
          show={selectedShow}
          onClose={() => setSelectedShow(null)}
          onUpdate={(newBlockedSeats) => {
            setShows(prev => prev.map(s =>
              s._id === selectedShow._id
                ? { ...s, blockedSeats: newBlockedSeats }
                : s
            ));
            setSelectedShow(prev => ({ ...prev, blockedSeats: newBlockedSeats }));
          }}
        />
      )}
    </div>
  );
};

export default AdminSeatManagerPage;
