import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE from '../../config/api';

const API = `${API_BASE}/api/movies`;
const EMPTY = {
  title: '', description: '', genre: '', language: '', duration: '',
  releaseDate: '', rating: 'UA', posterUrl: '', trailerUrl: '',
  director: '', imdbRating: '', isNowShowing: true, isUpcoming: false,
};

const AdminMovies = () => {
  const { token } = useContext(AuthContext);
  const headers = { Authorization: `Bearer ${token}` };

  const [movies, setMovies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchMovies(); }, []);

  const fetchMovies = async () => {
    const res = await axios.get(API);
    setMovies(res.data.movies);
  };

  const openAdd = () => { setForm(EMPTY); setEditing(null); setError(''); setShowForm(true); };
  const openEdit = (m) => {
    setForm({
      ...m,
      genre: m.genre.join(', '),
      language: m.language.join(', '),
      releaseDate: m.releaseDate?.split('T')[0] || '',
    });
    setEditing(m._id);
    setError('');
    setShowForm(true);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    const payload = {
      ...form,
      genre: form.genre.split(',').map(s => s.trim()).filter(Boolean),
      language: form.language.split(',').map(s => s.trim()).filter(Boolean),
      duration: Number(form.duration),
      imdbRating: Number(form.imdbRating) || 0,
    };
    try {
      if (editing) {
        await axios.put(`${API}/${editing}`, payload, { headers });
      } else {
        await axios.post(API, payload, { headers });
      }
      setShowForm(false);
      fetchMovies();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving movie');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    await axios.delete(`${API}/${deleteId}`, { headers });
    setDeleteId(null);
    fetchMovies();
  };

  const filtered = movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Movies</h2>
          <p className="text-gray-500 text-sm">{movies.length} movies total</p>
        </div>
        <button onClick={openAdd}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-secondary transition flex items-center gap-2">
          <span className="text-lg">+</span> Add Movie
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Poster', 'Title', 'Genre', 'Language', 'Rating', 'IMDb', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m._id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">
                  <img src={m.posterUrl || 'https://via.placeholder.com/40x56/e5e7eb/6b7280?text=?'}
                    alt={m.title} className="w-10 h-14 object-cover rounded-lg" />
                </td>
                <td className="py-3 px-4">
                  <p className="font-semibold text-gray-900">{m.title}</p>
                  <p className="text-xs text-gray-400">{m.director}</p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {m.genre.slice(0, 2).map(g => (
                      <span key={g} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{g}</span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">{m.language.slice(0, 2).join(', ')}</td>
                <td className="py-3 px-4">
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium">{m.rating}</span>
                </td>
                <td className="py-3 px-4 font-semibold">⭐ {m.imdbRating || '—'}</td>
                <td className="py-3 px-4">
                  {m.isNowShowing && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold mr-1">Now Showing</span>}
                  {m.isUpcoming && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold">Upcoming</span>}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(m)}
                      className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-100 transition">
                      Edit
                    </button>
                    <button onClick={() => setDeleteId(m._id)}
                      className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100 transition">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No movies found</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">{editing ? 'Edit Movie' : 'Add New Movie'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre (comma separated) *</label>
                  <input name="genre" value={form.genre} onChange={handleChange} required placeholder="Action, Drama"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language (comma separated)</label>
                  <input name="language" value={form.language} onChange={handleChange} placeholder="Telugu, Hindi"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins) *</label>
                  <input name="duration" type="number" value={form.duration} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Release Date *</label>
                  <input name="releaseDate" type="date" value={form.releaseDate} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select name="rating" value={form.rating} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary bg-white">
                    {['U', 'UA', 'A', 'S'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IMDb Rating</label>
                  <input name="imdbRating" type="number" min="0" max="10" step="0.1" value={form.imdbRating} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Director</label>
                  <input name="director" value={form.director} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
                  <input name="posterUrl" value={form.posterUrl} onChange={handleChange}
                    placeholder="https://..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trailer URL</label>
                  <input name="trailerUrl" value={form.trailerUrl} onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=xxxxx  or  https://youtu.be/xxxxx"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                  {form.trailerUrl && (
                    <p className="text-xs text-green-600 mt-1">
                      ✅ Trailer URL saved — users will see a Watch Trailer button on the movie page.
                    </p>
                  )}
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isNowShowing" checked={form.isNowShowing} onChange={handleChange}
                      className="w-4 h-4 accent-primary" />
                    <span className="text-sm font-medium">Now Showing</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isUpcoming" checked={form.isUpcoming} onChange={handleChange}
                      className="w-4 h-4 accent-primary" />
                    <span className="text-sm font-medium">Upcoming</span>
                  </label>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border-2 border-gray-200 py-2.5 rounded-xl font-semibold hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold hover:bg-secondary transition disabled:opacity-60">
                  {loading ? 'Saving…' : editing ? 'Update Movie' : 'Add Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-bold mb-2">Delete Movie?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 border-2 border-gray-200 py-2.5 rounded-xl font-semibold">Cancel</button>
              <button onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;
