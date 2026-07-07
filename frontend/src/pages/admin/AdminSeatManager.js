import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE from '../../config/api';

// All seat IDs for a standard layout
const ALL_ROWS = ['A','B','C','D','E','F','G','H','J','K','L','M'];
const COLS = [1,2,3,4,5,6,7,8,9,10,11,12];

const generateAllSeats = () => {
  const seats = [];
  ALL_ROWS.forEach(row => {
    COLS.forEach(col => seats.push(`${row}${col}`));
  });
  return seats;
};

const AdminSeatManager = ({ show, onClose, onUpdate }) => {
  const { token } = useContext(AuthContext);
  const headers = { Authorization: `Bearer ${token}` };

  const [blockedSeats, setBlockedSeats] = useState(show.blockedSeats || []);
  const [bookedSeats] = useState(show.bookedSeats || []);
  const [pendingSeats, setPendingSeats] = useState([]); // seats staged for block/unblock
  const [mode, setMode] = useState('block'); // 'block' | 'unblock'
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const allSeats = generateAllSeats();

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'booked';
    if (blockedSeats.includes(seatId)) return 'blocked';
    if (pendingSeats.includes(seatId)) return 'pending';
    return 'available';
  };

  const togglePending = (seatId) => {
    const status = getSeatStatus(seatId);
    if (status === 'booked') return; // can't touch booked seats

    if (mode === 'block' && (status === 'available')) {
      setPendingSeats(prev =>
        prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
      );
    } else if (mode === 'unblock' && status === 'blocked') {
      setPendingSeats(prev =>
        prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
      );
    }
  };

  const handleSave = async () => {
    if (pendingSeats.length === 0) return;
    setSaving(true); setMessage('');
    try {
      const res = await axios.patch(
        `${API_BASE}/api/shows/${show._id}/block-seats`,
        { seats: pendingSeats, action: mode },
        { headers }
      );
      setBlockedSeats(res.data.blockedSeats);
      setPendingSeats([]);
      setMessage(`✅ ${pendingSeats.length} seat(s) ${mode}ed successfully`);
      onUpdate(res.data.blockedSeats);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Error saving'}`);
    } finally {
      setSaving(false);
    }
  };

  const getSeatStyle = (seatId) => {
    const status = getSeatStatus(seatId);
    switch (status) {
      case 'booked':    return 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200';
      case 'blocked':   return 'bg-orange-100 text-orange-500 border-orange-300 cursor-pointer';
      case 'pending':   return mode === 'block'
                          ? 'bg-red-400 text-white border-red-500 cursor-pointer scale-105 shadow'
                          : 'bg-green-400 text-white border-green-500 cursor-pointer scale-105 shadow';
      default:          return 'bg-blue-50 text-gray-700 border-blue-200 hover:bg-blue-100 cursor-pointer';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-6">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manage Seats</h2>
            <p className="text-sm text-gray-500">
              {show.movie?.title} · {show.cinema?.name} · {show.showTime} ·{' '}
              {new Date(show.showDate).toLocaleDateString('en-IN')}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">×</button>
        </div>

        {/* Mode toggle */}
        <div className="px-6 py-4 border-b flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700">Mode:</span>
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => { setMode('block'); setPendingSeats([]); }}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
                mode === 'block' ? 'bg-red-500 text-white shadow' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔒 Block Seats
            </button>
            <button
              onClick={() => { setMode('unblock'); setPendingSeats([]); }}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
                mode === 'unblock' ? 'bg-green-500 text-white shadow' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔓 Unblock Seats
            </button>
          </div>

          <p className="text-xs text-gray-400 ml-2">
            {mode === 'block'
              ? 'Click available seats (blue) to mark for blocking'
              : 'Click blocked seats (orange 🔒) to mark for unblocking'}
          </p>
        </div>

        {/* Seat Grid */}
        <div className="px-6 py-6 overflow-x-auto">
          {ALL_ROWS.map(row => (
            <div key={row} className="flex items-center gap-1.5 mb-1.5">
              <span className="w-6 text-xs text-gray-400 font-medium text-right flex-shrink-0">{row}</span>
              {COLS.map(col => {
                const seatId = `${row}${col}`;
                return (
                  <button
                    key={seatId}
                    onClick={() => togglePending(seatId)}
                    disabled={getSeatStatus(seatId) === 'booked'}
                    className={`w-9 h-9 rounded-lg text-xs font-medium border transition-all ${getSeatStyle(seatId)}`}
                    title={
                      getSeatStatus(seatId) === 'booked' ? 'Booked by user — cannot modify' :
                      getSeatStatus(seatId) === 'blocked' ? 'Currently blocked — click to stage unblock' :
                      getSeatStatus(seatId) === 'pending' ? `Staged for ${mode}` :
                      `Available — click to stage block`
                    }
                  >
                    {getSeatStatus(seatId) === 'blocked' ? '🔒' :
                     getSeatStatus(seatId) === 'pending' ? (mode === 'block' ? '🚫' : '✓') :
                     col}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="px-6 pb-4 flex flex-wrap gap-5 text-xs text-gray-600 border-t pt-4">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-blue-50 border border-blue-200" />
            Available
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-orange-100 border border-orange-300 flex items-center justify-center text-xs">🔒</div>
            Blocked
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-gray-200 border border-gray-300" />
            Booked (user)
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-red-400 border border-red-500 flex items-center justify-center text-white text-xs">🚫</div>
            Staged to block
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-green-400 border border-green-500 flex items-center justify-center text-white text-xs">✓</div>
            Staged to unblock
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t flex items-center justify-between bg-gray-50 rounded-b-2xl">
          <div>
            {pendingSeats.length > 0 && (
              <p className="text-sm font-semibold text-gray-700">
                {pendingSeats.length} seat{pendingSeats.length > 1 ? 's' : ''} staged to{' '}
                <span className={mode === 'block' ? 'text-red-500' : 'text-green-600'}>{mode}</span>:{' '}
                {pendingSeats.join(', ')}
              </p>
            )}
            {message && (
              <p className={`text-sm font-medium mt-1 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            {pendingSeats.length > 0 && (
              <button onClick={() => setPendingSeats([])}
                className="border-2 border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100">
                Clear
              </button>
            )}
            <button onClick={onClose}
              className="border-2 border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100">
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={saving || pendingSeats.length === 0}
              className={`px-6 py-2 rounded-xl text-sm font-bold text-white transition disabled:opacity-50 ${
                mode === 'block' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {saving ? 'Saving…' : mode === 'block'
                ? `🔒 Block ${pendingSeats.length} Seat${pendingSeats.length !== 1 ? 's' : ''}`
                : `🔓 Unblock ${pendingSeats.length} Seat${pendingSeats.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSeatManager;
