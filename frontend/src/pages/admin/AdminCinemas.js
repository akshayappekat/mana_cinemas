import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const API = 'http://localhost:5000/api/cinemas';
const EMPTY = {
  name: '', address: '', city: '', state: '', pincode: '',
  contactNumber: '', amenities: '', totalSeats: 80,
};

const AdminCinemas = () => {
  const { token } = useContext(AuthContext);
  const headers = { Authorization: `Bearer ${token}` };

  const [cinemas, setCinemas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchCinemas(); }, []);

  const fetchCinemas = async () => {
    const res = await axios.get(API);
    setCinemas(res.data.cinemas);
  };

  const openAdd = () => { setForm(EMPTY); setEditing(null); setError(''); setShowForm(true); };
  const openEdit = (c) => {
    setForm({
      name: c.name,
      address: c.location?.address || '',
      city: c.location?.city || '',
      state: c.location?.state || '',
      pincode: c.location?.pincode || '',
      contactNumber: c.contactNumber || '',
      amenities: c.amenities?.join(', ') || '',
      totalSeats: c.screens?.[0]?.totalSeats || 80,
    });
    setEditing(c._id); setError(''); setShowForm(true);
  };

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    const payload = {
      name: form.name,
      location: { address: form.address, city: form.city, state: form.state, pincode: form.pincode },
      contactNumber: form.contactNumber,
      amenities: form.amenities.split(',').map(s => s.trim()).filter(Boolean),
      screens: [
        { name: 'Screen 1', totalSeats: Number(form.totalSeats), rows: 8, columns: 10 },
        { name: 'Screen 2', totalSeats: Number(form.totalSeats), rows: 8, columns: 10 },
      ],
      isActive: true,
    };
    try {
      editing
        ? await axios.put(`${API}/${editing}`, payload, { headers })
        : await axios.post(API, payload, { headers });
      setShowForm(false); fetchCinemas();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving cinema');
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    await axios.delete(`${API}/${deleteId}`, { headers });
    setDeleteId(null); fetchCinemas();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cinemas</h2>
          <p className="text-gray-500 text-sm">{cinemas.length} cinemas registered</p>
        </div>
        <button onClick={openAdd}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-secondary transition flex items-center gap-2">
          <span className="text-lg">+</span> Add Cinema
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cinemas.map(c => (
          <div key={c._id} className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{c.name}</h3>
                <p className="text-sm text-gray-500">📍 {c.location?.address}, {c.location?.city}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {c.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {c.amenities?.map(a => (
                <span key={a} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{a}</span>
              ))}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              🎭 {c.screens?.length || 0} screens · 📞 {c.contactNumber || 'N/A'}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)}
                className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-100 transition">
                Edit
              </button>
              <button onClick={() => setDeleteId(c._id)}
                className="flex-1 bg-red-50 text-red-600 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-100 transition">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">{editing ? 'Edit Cinema' : 'Add Cinema'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cinema Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input name="address" value={form.address} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input name="city" value={form.city} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input name="state" value={form.state} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input name="contactNumber" value={form.contactNumber} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seats per Screen</label>
                  <input name="totalSeats" type="number" value={form.totalSeats} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma separated)</label>
                <input name="amenities" value={form.amenities} onChange={handleChange}
                  placeholder="Parking, Food Court, Dolby Atmos"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border-2 border-gray-200 py-2.5 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold hover:bg-secondary disabled:opacity-60">
                  {loading ? 'Saving…' : editing ? 'Update' : 'Add Cinema'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="text-4xl mb-3">🏛️</div>
            <h3 className="text-lg font-bold mb-2">Delete Cinema?</h3>
            <p className="text-gray-500 text-sm mb-6">All associated shows will be affected.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border-2 border-gray-200 py-2.5 rounded-xl font-semibold">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCinemas;
