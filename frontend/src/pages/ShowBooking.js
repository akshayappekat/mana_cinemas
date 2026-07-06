import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import UpiPayment from '../components/UpiPayment';
import API_BASE from '../config/api';

// ─────────────────────────────────────────────────────────────
// SHOW-TIME CONFIGS
// Each timing has its own layout type + static seat map
// null  = occupied/unavailable (renders as ×)
// ─────────────────────────────────────────────────────────────

// 04:00 PM – VIP only  (compact recliner hall)
const VIP_LAYOUT = [
  { row: 'G', seats: [null, null, null, null, null, null, 3, 4] },
  { row: 'F', seats: [1,    2,    3,    4,    5,    6,    7, 8] },
  { row: 'E', seats: [1,    2,    3,    4,    5,    6,    7, 8] },
  { row: 'D', seats: [1,    2,    3,    null, null, null, 7, 8] },
  { row: 'C', seats: [1,    2,    3,    null, 5,    6,    7, 8] },
  { row: 'B', seats: [1,    null, null, null, null] },
];

// 07:00 PM – DOLBY ATMOS (recliner + sofa + silver)
const DOLBY_LAYOUT = {
  RECLINER: {
    label: 'RECLINER',
    priceKey: 'platinum',
    defaultPrice: 295,
    rows: [
      { row: 'A', seats: [2,3,4,5,6,7,8,9,10,11,12] },
    ],
  },
  SOFA: {
    label: 'SOFA',
    priceKey: 'gold',
    defaultPrice: 235,
    rows: [
      { row: 'B', left: [1,2,3,4,5,6,7], right: [8,9,10,11] },
    ],
  },
  SILVER: {
    label: 'SILVER',
    priceKey: 'silver',
    defaultPrice: 177,
    rows: [
      { row: 'C', left: [1,2,3,4,5,6,7,8,9,10,11,12],  right: [13,14,15,16,17,18] },
      { row: 'D', left: [1,2,3,4,5,6,7,8,9,10,11,12],  right: [13,14,15,16,17,18] },
      { row: 'E', left: [1,2,3,4,5,6,7,8,null,null,11,12], right: [13,14,15,16,17,18] },
      { row: 'F', left: [1,2,3,4,5,6,7,8,9,10,11,12],  right: [13,14,15,16,17,18] },
      { row: 'G', left: [1,2,3,4,5,6,7,8,9,10,11,12],  right: [13,14,15,16,17,18] },
    ],
  },
};

// 10:30 PM – DOLBY ATMOS large hall (silver only, rows C–M)
const LARGE_LAYOUT = {
  SILVER: {
    label: 'SILVER',
    priceKey: 'silver',
    defaultPrice: 177,
    rows: [
      { row: 'C', left: [1,2,3,4,5,6,7,8,9,10,11,12], right: [13,14,15,16,17,18] },
      { row: 'D', left: [1,2,3,4,5,6,7,8,9,10,11,12], right: [13,14,15,16,17,18] },
      { row: 'E', left: [1,2,3,4,5,6,7,8,9,10,11,12], right: [13,14,15,16,17,18] },
      { row: 'F', left: [1,2,3,4,5,6,7,8,9,10,11,12], right: [13,14,15,16,17,18] },
      { row: 'G', left: [1,2,3,4,5,6,7,8,9,10,11,12], right: [13,14] },
      { row: 'H', left: [1,2,3,4,5,6,7,8,9,10,11,12], right: [13,14] },
      { row: 'J', left: [1,2,3,4,5,6,7,8,9,10,11,12], right: [13,14] },
      { row: 'K', left: [1,2,3,4,5,6,7,8,9,10,11,12], right: [13,14] },
      { row: 'L', left: [1,2,3,4,5,6,7,8,9,10,11,12], right: [13,14] },
      { row: 'M', left: [1,2,3,4,5,6,7,8,9,10,11,12], right: [13,14] },
    ],
  },
};

const SHOW_TIMES = [
  { id: 't1', label: '10:00 AM', sub: 'VIP',         layout: 'vip'   },
  { id: 't2', label: '01:00 PM', sub: 'DOLBY ATMOS', layout: 'dolby' },
  { id: 't3', label: '04:00 PM', sub: 'DOLBY ATMOS', layout: 'large' },
  { id: 't4', label: '07:00 PM', sub: 'DOLBY ATMOS', layout: 'dolby' },
  { id: 't5', label: '10:00 PM', sub: 'DOLBY ATMOS', layout: 'large' },
];

// ─────────────────────────────────────────────────────────────
// Reusable seat button
// ─────────────────────────────────────────────────────────────
const Seat = ({ col, seatId, status, onClick, size = 'sm' }) => {
  const base =
    size === 'lg'
      ? 'w-11 h-11 rounded-xl text-sm font-semibold'
      : 'w-9 h-9 rounded-lg text-xs font-medium';

  if (col === null) {
    return (
      <div className={`${base} border border-gray-200 bg-white flex items-center justify-center`}>
        <span className="text-gray-400 text-xs">×</span>
      </div>
    );
  }

  const colours =
    status === 'booked'
      ? 'bg-white border border-gray-200 text-gray-400 cursor-not-allowed'
      : status === 'selected'
      ? 'bg-violet-600 text-white shadow-md scale-105 border-2 border-violet-700 cursor-pointer'
      : 'bg-blue-50 border border-blue-200 text-gray-800 hover:bg-blue-100 hover:border-blue-400 cursor-pointer';

  return (
    <button
      onClick={onClick}
      disabled={status === 'booked'}
      className={`${base} transition-all duration-150 ${colours}`}
    >
      {col}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────
// 3-D curved screen SVG
// ─────────────────────────────────────────────────────────────
const CurvedScreen = () => (
  <div className="flex flex-col items-center mt-10 mb-1">
    <div className="relative w-80">
      <div
        className="absolute bottom-0 left-6 right-6 h-7 rounded-b-full"
        style={{ background: 'rgba(139,92,246,0.25)', filter: 'blur(8px)' }}
      />
      <svg viewBox="0 0 320 56" className="w-full" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="160" cy="52" rx="140" ry="7" fill="rgba(109,40,217,0.2)" />
        <path
          d="M 18 10 Q 160 0 302 10 L 296 44 Q 160 54 24 44 Z"
          fill="url(#sg)"
          stroke="rgba(139,92,246,0.5)"
          strokeWidth="1"
        />
        <path
          d="M 28 12 Q 160 3 292 12 L 290 20 Q 160 10 30 20 Z"
          fill="rgba(255,255,255,0.22)"
        />
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <p className="text-violet-600 font-bold text-xs tracking-widest mt-3">SCREEN THIS WAY</p>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Row label (outside component so it has stable reference)
// ─────────────────────────────────────────────────────────────
const RowLabel = ({ row }) => (
  <span className="text-sm text-gray-500 font-medium w-7 text-right mr-3 flex-shrink-0">{row}</span>
);

// ─────────────────────────────────────────────────────────────
// Seat legend
// ─────────────────────────────────────────────────────────────
const Legend = () => (
  <div className="flex items-end justify-center gap-8 pt-4 border-t border-gray-100 mt-6">
    <div className="flex flex-col items-center gap-1">
      <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200" />
      <span className="text-xs text-gray-500">Best Seats ⓘ</span>
    </div>
    <div className="flex flex-col items-center gap-1">
      <div className="w-7 h-7 rounded-xl bg-white border border-gray-300" />
      <span className="text-xs text-gray-500">Available</span>
    </div>
    <div className="flex flex-col items-center gap-1">
      <div className="w-7 h-7 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-xs">×</span>
      </div>
      <span className="text-xs text-gray-500">Occupied</span>
    </div>
    <div className="flex flex-col items-center gap-1">
      <div className="w-7 h-7 rounded-xl bg-violet-600" />
      <span className="text-xs text-gray-500">Selected</span>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const ShowBooking = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeTime, setActiveTime] = useState('t2'); // default 07:00 PM
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/shows/${showId}`);
        setShow(res.data.show);
      } catch {
        setError('Show not found');
      } finally {
        setLoading(false);
      }
    };
    fetchShow();
  }, [showId]);

  const bookedSeats = show?.bookedSeats || [];

  const getStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  const toggle = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const activeLayout = SHOW_TIMES.find(t => t.id === activeTime)?.layout || 'dolby';

  const getPriceForSeat = (seatId) => {
    if (!show) return 0;
    const row = seatId[0];
    if (activeLayout === 'vip') return show.ticketPrice?.platinum || 295;
    if (activeLayout === 'dolby') {
      if (row === 'A') return show.ticketPrice?.platinum || 295;
      if (row === 'B') return show.ticketPrice?.gold || 235;
      return show.ticketPrice?.silver || 177;
    }
    return show.ticketPrice?.silver || 177;
  };

  const totalAmount =
    selectedSeats.reduce((s, id) => s + getPriceForSeat(id), 0) +
    (selectedSeats.length > 0 ? 30 : 0);

  const handleTimeSwitch = (id) => {
    setActiveTime(id);
    setSelectedSeats([]); // clear selection on tab change
    setError('');
  };

  const handleBooking = async () => {
    if (!selectedSeats.length) { setError('Select at least one seat'); return; }
    setBookingLoading(true); setError('');
    try {
      const res = await axios.post(
        `${API_BASE}/api/bookings`,
        { showId, seats: selectedSeats, seatCategory: 'silver', paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/my-bookings', { state: { newBooking: res.data.booking } });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading…</div>
  );
  if (!show) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">{error}</div>
  );

  // ── helper to render a single seat cell (null = × spacer)
  const renderSeat = (col, row, key) => {
    const seatId = col !== null ? `${row}${col}` : null;
    return (
      <Seat
        key={key}
        col={col}
        seatId={seatId}
        status={seatId ? getStatus(seatId) : 'gap'}
        onClick={seatId ? () => toggle(seatId) : undefined}
        size={activeLayout === 'vip' ? 'lg' : 'sm'}
      />
    );
  };

  // ─────────────────────────────────────────────────────────────
  // LAYOUT RENDERERS
  // ─────────────────────────────────────────────────────────────

  // 04:00 PM – compact VIP recliner
  const renderVIP = () => (
    <div>
      <h3 className="text-center font-bold text-gray-900 text-lg tracking-wide mb-8">
        RECLINER : ₹{show.ticketPrice?.platinum || 295}
      </h3>
      <div className="flex flex-col items-center gap-2.5">
        {VIP_LAYOUT.map(({ row, seats }) => (
          <div key={row} className="flex items-center gap-2">
            <RowLabel row={row} />
            {seats.map((col, i) => renderSeat(col, row, `${row}-${i}`))}
          </div>
        ))}
      </div>
      <CurvedScreen />
      <Legend />
    </div>
  );

  // 07:00 PM – Recliner + Sofa + Silver (three labelled zones)
  const renderDolby = () => {
    const { RECLINER, SOFA, SILVER } = DOLBY_LAYOUT;
    return (
      <div>
        {/* RECLINER */}
        <h3 className="text-center font-bold text-gray-900 text-base tracking-wide mb-4">
          {RECLINER.label} : ₹{show.ticketPrice?.[RECLINER.priceKey] || RECLINER.defaultPrice}
        </h3>
        {RECLINER.rows.map(({ row, seats }) => (
          <div key={row} className="flex items-center justify-center gap-1.5 mb-6">
            <RowLabel row={row} />
            {seats.map((col, i) => renderSeat(col, row, `${row}-${i}`))}
          </div>
        ))}

        <div className="border-t border-dashed border-gray-200 my-6" />

        {/* SOFA */}
        <h3 className="text-center font-bold text-gray-900 text-base tracking-wide mb-4">
          {SOFA.label} : ₹{show.ticketPrice?.[SOFA.priceKey] || SOFA.defaultPrice}
        </h3>
        {SOFA.rows.map(({ row, left, right }) => (
          <div key={row} className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-1.5">
              <RowLabel row={row} />
              {left.map((col, i) => renderSeat(col, row, `${row}-L${i}`))}
            </div>
            <div className="flex items-center gap-1.5">
              {right.map((col, i) => renderSeat(col, row, `${row}-R${i}`))}
            </div>
          </div>
        ))}

        <div className="border-t border-dashed border-gray-200 my-6" />

        {/* SILVER */}
        <h3 className="text-center font-bold text-gray-900 text-base tracking-wide mb-4">
          {SILVER.label} : ₹{show.ticketPrice?.[SILVER.priceKey] || SILVER.defaultPrice}
        </h3>
        {SILVER.rows.map(({ row, left, right }) => (
          <div key={row} className="flex items-center justify-center gap-6 mb-1.5">
            <div className="flex items-center gap-1.5">
              <RowLabel row={row} />
              {left.map((col, i) => renderSeat(col, row, `${row}-L${i}`))}
            </div>
            <div className="flex items-center gap-1.5">
              {right.map((col, i) => renderSeat(col, row, `${row}-R${i}`))}
            </div>
          </div>
        ))}

        {/* Screen at bottom */}
        <div className="flex items-center justify-center gap-3 mt-10 mb-4">
          <div className="flex-1 h-px bg-gradient-to-l from-gray-300 to-transparent" />
          <span className="text-violet-600 font-bold text-xs tracking-widest">SCREEN THIS WAY</span>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
        </div>
        <Legend />
      </div>
    );
  };

  // 10:30 PM – large hall, silver only
  const renderLarge = () => {
    const { SILVER } = LARGE_LAYOUT;
    return (
      <div>
        {SILVER.rows.map(({ row, left, right }) => (
          <div key={row} className="flex items-center justify-center gap-6 mb-1.5">
            <div className="flex items-center gap-1.5">
              <RowLabel row={row} />
              {left.map((col, i) => renderSeat(col, row, `${row}-L${i}`))}
            </div>
            <div className="flex items-center gap-1.5">
              {right.map((col, i) => renderSeat(col, row, `${row}-R${i}`))}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-center gap-3 mt-10 mb-4">
          <div className="flex-1 h-px bg-gradient-to-l from-gray-300 to-transparent" />
          <span className="text-violet-600 font-bold text-xs tracking-widest">SCREEN THIS WAY</span>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
        </div>
        <Legend />
      </div>
    );
  };

  const layoutRenderer = {
    vip:   renderVIP,
    dolby: renderDolby,
    large: renderLarge,
  };

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky header ── */}
      <div className="bg-white shadow-sm sticky top-16 z-40 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{show.movie?.title}</h1>
            <p className="text-sm text-gray-500">
              {new Date(show.showDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              {' '}| {show.showTime} at {show.cinema?.name}, {show.cinema?.location?.city}
            </p>
          </div>
          {selectedSeats.length > 0 && step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-secondary transition"
            >
              Pay ₹{totalAmount}
            </button>
          )}
        </div>
      </div>

      {step === 1 ? (
        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* ── Show-time tabs ── */}
          <div className="flex items-center gap-3 mb-8">
            <div className="text-sm text-gray-600 mr-1">
              <div className="font-semibold">Mon</div>
              <div>{new Date(show.showDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
            </div>
            {SHOW_TIMES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTimeSwitch(t.id)}
                className={`px-5 py-2.5 rounded-xl border-2 text-sm text-left transition
                  ${activeTime === t.id
                    ? 'border-gray-900 bg-white shadow font-bold'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                  }`}
              >
                <div className="font-semibold">{t.label}</div>
                <div className="text-xs text-gray-500">{t.sub}</div>
              </button>
            ))}
          </div>

          {/* ── Seat layout card ── */}
          <div className="bg-white rounded-2xl shadow-sm px-8 py-10 overflow-x-auto">
            {layoutRenderer[activeLayout]?.()}
          </div>

          {/* ── Booking summary ── */}
          {selectedSeats.length > 0 && (
            <div className="mt-6 bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}: {selectedSeats.join(', ')}
                </p>
                <p className="text-2xl font-bold text-gray-900">₹{totalAmount}</p>
                <p className="text-xs text-gray-400">Incl. ₹30 convenience fee</p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-secondary transition"
              >
                Proceed
              </button>
            </div>
          )}
          {error && <p className="text-red-500 mt-4 text-center text-sm">{error}</p>}
        </div>

      ) : step === 2 ? (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-xl mb-6">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { id: 'card',       label: '💳 Credit / Debit Card' },
                { id: 'upi',        label: '📱 UPI' },
                { id: 'netbanking', label: '🏦 Net Banking' },
                { id: 'wallet',     label: '👛 Wallet' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-4 border-2 rounded-xl text-left font-medium transition
                    ${paymentMethod === m.id ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {paymentMethod === 'upi' ? (
              <button
                onClick={() => setStep(3)}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-secondary transition"
              >
                Proceed with UPI Payment
              </button>
            ) : (
              <>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm space-y-2">
                  <div className="flex justify-between"><span className="text-gray-500">Movie</span><span className="font-medium">{show.movie?.title}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Cinema</span><span className="font-medium">{show.cinema?.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Show</span><span className="font-medium">{show.showTime}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Seats</span><span className="font-medium">{selectedSeats.join(', ')}</span></div>
                  <div className="flex justify-between font-bold text-base border-t pt-2 mt-1">
                    <span>Total</span><span className="text-primary">₹{totalAmount}</span>
                  </div>
                </div>
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50">Back</button>
                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-secondary transition disabled:opacity-60"
                  >
                    {bookingLoading ? 'Processing…' : `Pay ₹${totalAmount}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      ) : (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <UpiPayment
            amount={totalAmount}
            bookingDetails={{
              movie: show.movie?.title,
              cinema: show.cinema?.name,
              showTime: show.showTime,
              seats: selectedSeats.join(', '),
              date: new Date(show.showDate).toLocaleDateString(),
            }}
            onPaymentComplete={(result) => { if (result.success) handleBooking(); }}
          />
        </div>
      )}
    </div>
  );
};

export default ShowBooking;
