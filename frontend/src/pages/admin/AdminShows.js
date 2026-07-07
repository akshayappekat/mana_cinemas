import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE from '../../config/api';
import AdminSeatManager from './AdminSeatManager';

const API_SHOWS   = `${API_BASE}/api/shows`;
const API_MOVIES  = `${API_BASE}/api/movies`;
const API_CINEMAS = `${API_BASE}/api/cinemas`;

const EMPTY = {
  movie: '', cinema: '', showDate: '', showTime: '10:00 AM',
  language: 'Telugu', format: '2D',
  silverPrice: 120, goldPrice: 200, platinumPrice: 350,
  totalSeats: 80,
};

const FORMATS   = ['2D', '3D', 'IMAX', '4DX'];
const LANGUAGES = ['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada', 'English'];
const TIMES     = ['10:00 AM', '01:00 PM', '04:00 PM', '07:00 PM', '10:00 PM'];

const AdminShows = () => {
  const { token } = useContext(AuthContext);
  const headers = { Authorization: `Bearer ${token}` };

  const [shows, setShows]   = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]  = useState(null);
  const [form, setForm]    = useState(EMPTY);
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [seatManagerShow, setSeatManagerShow] = useState(null);

  useEffect(() => {
    fetchShows(); fetchMovies(); fetchCinemas();
  }, []);

  const fetchShows   = async () => { const r = await axios.get(API_SHOWS);   setShows(r.data.shows); };
  const fetchMovies  = async () => { const r = await axios.get(API_MOVIES);  setMovies(r.data.movies); };
  const fetchCinemas = async () => { const r = await axios.get(API_CINEMAS); setCinemas(r.data.cinemas); };

  const openAdd = () => {
    setForm({ ...EMPTY, movie: movies[0]?._id || '', cinema: cinemas[0]?._id || '' });
    setEditing(null); setError(''); setShowForm(true);
  };

  const openEdit = (s) => {
    setForm({
      movie: s.movie?._id || s.movie,
      cinema: s.cinema?._id || s.cinema,
      showDate: s.showDate?.split('T')[0] || '',
      showTime: s.showTime,
      language: s.language,
      format: s.format,
      silverPrice: s.ticketPrice?.silver || 120,
      goldPrice: s.ticketPrice?.gold || 200,
      platinumPrice: s.ticketPrice?.platinum || 350,
      totalSeats: s.totalSeats || 80,
    });
    setEditing(s._id); setError(''); setShowForm(true);
  };

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    const payload = {
      movie: form.movie, cinema: form.cinema,
      showDate: form.showDate, showTime: form.showTime,
      language: form.language, format: form.format,
      screenName: 'Screen 1',
      ticketPrice: {
        silver: Number(form.silverPrice),
        gold: Number(form.goldPrice),
        platinum: Number(form.platinumPrice),
      },
      totalSeats: Number(form.totalSeats),
      availableSeats: Number(form.totalSeats),
      isActive: true,
    };
    try {
      editing
        ? await axios.put(`${API_SHOWS}/${editing}`, payload, { headers })
        : await axios.post(API_SHOWS, payload, { headers });
      setShowForm(false); fetchShows();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving show');
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    await axios.delete(`${API_SHOWS}/${deleteId}`, { headers });
    setDeleteId(null); fetchShows();
  };

  // ── Bulk selection helpers
  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(s => s._id));
    }
  };

  const handleBulkDelete = async () => {
    await Promise.all(
      selectedIds.map(id => axios.delete(`${API_SHOWS}/${id}`, { headers }))
    );
    setSelectedIds([]);
    setBulkDeleteConfirm(false);
    fetchShows();
  };

  const filtered = shows.filter(s => {
    if (!filterDate) return true;
    return s.showDate?.startsWith(filterDate);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shows</h2>
          <p className="text-gray-500 text-sm">{shows.length} shows total</p>
        </div>
        <button onClick={openAdd}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-secondary transition flex items-center gap-2">
          <span className="text-lg">+</span> Add Show
        </button>
      </div>

      {/* Filter + Bulk Actions Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-gray-600">Filter by date:</label>
        <input type="date" value={filterDate} onChange={e => { setFilterDate(e.target.value); setSelectedIds([]); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        {filterDate && (
          <button onClick={() => { setFilterDate(''); setSelectedIds([]); }}
            className="text-sm text-gray-400 hover:text-gray-600">Clear</button>
        )}

        {/* Bulk delete button — appears when rows are selected */}
        {selectedIds.length > 0 && (
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">
              {selectedIds.length} selected
            </span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg"
            >
              Deselect All
            </button>
            <button
              onClick={() => setBulkDeleteConfirm(true)}
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-600 transition flex items-center gap-2"
            >
              🗑️ Delete {selectedIds.length} Show{selectedIds.length > 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {/* Select all checkbox */}
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selectedIds.length === filtered.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </th>
              {['Movie', 'Cinema', 'Date', 'Time', 'Format', 'Prices', 'Seats', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const isSelected = selectedIds.includes(s._id);
              return (
                <tr key={s._id} className={`border-b transition ${isSelected ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                  {/* Row checkbox */}
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(s._id)}
                      className="w-4 h-4 accent-primary rounded cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-4 font-semibold">{s.movie?.title || '—'}</td>
                  <td className="py-3 px-4 text-gray-600">{s.cinema?.name || '—'}</td>
                  <td className="py-3 px-4">{s.showDate ? new Date(s.showDate).toLocaleDateString('en-IN') : '—'}</td>
                  <td className="py-3 px-4 font-medium">{s.showTime}</td>
                  <td className="py-3 px-4">
                    <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">{s.format}</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-600">
                    S:₹{s.ticketPrice?.silver} · G:₹{s.ticketPrice?.gold} · P:₹{s.ticketPrice?.platinum}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold ${s.availableSeats === 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {s.availableSeats}/{s.totalSeats}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)}
                        className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-100">Edit</button>
                      <button onClick={() => setSeatManagerShow(s)}
                        className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-orange-100">🔒 Seats</button>
                      <button onClick={() => setDeleteId(s._id)}
                        className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100">Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No shows found</div>}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">{editing ? 'Edit Show' : 'Add Show'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Movie *</label>
                <select name="movie" value={form.movie} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary bg-white">
                  <option value="">Select movie</option>
                  {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cinema *</label>
                <select name="cinema" value={form.cinema} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary bg-white">
                  <option value="">Select cinema</option>
                  {cinemas.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input name="showDate" type="date" value={form.showDate} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <select name="showTime" value={form.showTime} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary bg-white">
                    {TIMES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select name="language" value={form.language} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary bg-white">
                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <select name="format" value={form.format} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary bg-white">
                    {FORMATS.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[['silverPrice','Silver ₹'],['goldPrice','Gold ₹'],['platinumPrice','Platinum ₹']].map(([k,l]) => (
                  <div key={k}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                    <input name={k} type="number" value={form[k]} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
                <input name="totalSeats" type="number" value={form.totalSeats} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border-2 border-gray-200 py-2.5 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold hover:bg-secondary disabled:opacity-60">
                  {loading ? 'Saving…' : editing ? 'Update Show' : 'Add Show'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-lg font-bold mb-2">Delete Show?</h3>
            <p className="text-gray-500 text-sm mb-6">Existing bookings may be affected.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border-2 border-gray-200 py-2.5 rounded-xl font-semibold">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation */}
      {bulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="text-5xl mb-3">🗑️</div>
            <h3 className="text-lg font-bold mb-2">Delete {selectedIds.length} Shows?</h3>
            <p className="text-gray-500 text-sm mb-6">
              This will permanently delete <span className="font-bold text-red-500">{selectedIds.length} shows</span>. Existing bookings may be affected.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setBulkDeleteConfirm(false)}
                className="flex-1 border-2 border-gray-200 py-2.5 rounded-xl font-semibold hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleBulkDelete}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold hover:bg-red-600">
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Seat Manager Modal */}
      {seatManagerShow && (
        <AdminSeatManager
          show={seatManagerShow}
          onClose={() => setSeatManagerShow(null)}
          onUpdate={(newBlockedSeats) => {
            setShows(prev => prev.map(s =>
              s._id === seatManagerShow._id
                ? { ...s, blockedSeats: newBlockedSeats }
                : s
            ));
          }}
        />
      )}
    </div>
  );
};

export default AdminShows;
