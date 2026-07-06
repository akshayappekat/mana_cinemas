import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_BASE from '../config/api';

const MyBookings = () => {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/bookings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data.bookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.patch(
        `${API_BASE}/api/bookings/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
      alert('Booking cancelled successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading bookings...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mb-4">No bookings found</p>
          <a href="/" className="text-primary hover:underline">
            Book your first movie ticket now!
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  {booking.show?.movie?.posterUrl && (
                    <img
                      src={booking.show.movie.posterUrl}
                      alt={booking.show.movie.title}
                      className="w-20 h-28 object-cover rounded"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-bold">{booking.show?.movie?.title}</h2>
                    <p className="text-gray-600">{booking.show?.cinema?.name}</p>
                    <p className="text-gray-600">
                      {booking.show?.cinema?.location?.address}, {booking.show?.cinema?.location?.city}
                    </p>
                    <p className="text-gray-600 mt-2">
                      {new Date(booking.show?.showDate).toDateString()} | {booking.show?.showTime}
                    </p>
                    <p className="text-gray-600">
                      {booking.show?.format} | {booking.show?.language}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      booking.bookingStatus
                    )}`}
                  >
                    {booking.bookingStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-semibold">{booking.bookingId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seats</p>
                  <p className="font-semibold">{booking.seats.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold capitalize">{booking.seatCategory}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-semibold text-primary text-lg">₹{booking.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-semibold capitalize">{booking.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className="font-semibold capitalize">{booking.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booked On</p>
                  <p className="font-semibold">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {booking.bookingStatus === 'confirmed' && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
