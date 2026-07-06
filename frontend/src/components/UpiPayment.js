import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { PAYMENT_CONFIG } from '../config/payment';
import { useNavigate } from 'react-router-dom';

const UpiPayment = ({ amount, onPaymentComplete, bookingDetails }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [upiId] = useState(PAYMENT_CONFIG.UPI_ID);
  const [showManualUpi, setShowManualUpi] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [timer, setTimer] = useState(PAYMENT_CONFIG.PAYMENT_TIMEOUT * 60);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailedPopup, setShowFailedPopup] = useState(false);
  const [copied, setCopied] = useState('');
  const navigate = useNavigate();

  const generateQRCode = useCallback(async () => {
    const txnRef = 'MC' + Date.now();
    setTransactionId(txnRef);

    // Dynamic UPI QR with amount pre-filled
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(PAYMENT_CONFIG.MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Mana Cinemas Booking')}`;

    try {
      const url = await QRCode.toDataURL(upiString, {
        width: 280,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
        errorCorrectionLevel: 'H',
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error('QR generation error:', err);
    }
  }, [upiId, amount]);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  // Countdown timer - 6 minutes → auto fail on expiry
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto show failed popup when timer runs out
          setShowFailedPopup(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleVerifyPayment = () => {
    setVerifying(true);
    // Simulate payment verification (2 seconds)
    setTimeout(() => {
      setVerifying(false);
      setShowSuccessPopup(true);
    }, 2000);
  };

  const handleConfirmBooking = () => {
    setShowSuccessPopup(false);
    onPaymentComplete({
      success: true,
      transactionId,
      method: 'upi',
      amount,
    });
  };

  const handleGoBackToMovies = () => {
    setShowFailedPopup(false);
    navigate('/');
  };

  return (
    <div className="relative">

      {/* ❌ Transaction Failed Popup */}
      {showFailedPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            {/* Failed Animation */}
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-14 h-14 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-red-600 mb-2">Transaction Failed!</h2>
            <p className="text-gray-600 mb-2">Payment time of <span className="font-bold">6 minutes</span> has expired.</p>
            <p className="text-gray-500 text-sm mb-6">Your seats have been released. Please try booking again.</p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-left text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-xs font-semibold">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-red-600">₹{amount} (Not charged)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-red-600">Failed — Timeout</span>
              </div>
            </div>

            <button
              onClick={handleGoBackToMovies}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-secondary transition"
            >
              🎬 Back to Movies
            </button>
            <p className="text-xs text-gray-400 mt-3">No amount has been deducted from your account.</p>
          </div>
        </div>
      )}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            {/* Success Animation */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-14 h-14 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your payment of <span className="font-bold text-primary text-lg">₹{amount}</span> has been received.</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Movie:</span>
                <span className="font-semibold">{bookingDetails?.movie}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seats:</span>
                <span className="font-semibold">{bookingDetails?.seats}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Show Time:</span>
                <span className="font-semibold">{bookingDetails?.showTime}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono font-semibold text-xs">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paid via:</span>
                <span className="font-semibold">UPI ({upiId})</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6 bg-green-50 py-2 px-4 rounded-lg">
              <span className="text-green-600 text-sm font-medium">🎉 Booking Confirmed!</span>
            </div>

            <button
              onClick={handleConfirmBooking}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-secondary transition"
            >
              View My Ticket
            </button>
          </div>
        </div>
      )}

      {/* Main Payment Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">

        {/* Header with Timer */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold">UPI Payment</h3>
          <div className={`flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full
            ${timer === 0 ? 'bg-red-200 text-red-800' :
              timer < 60 ? 'bg-red-100 text-red-700 animate-pulse' :
              timer < 120 ? 'bg-orange-100 text-orange-700' :
              'bg-green-100 text-green-700'}`}>
            ⏱️ {timer === 0 ? 'EXPIRED' : formatTime(timer)}
          </div>
        </div>

        {/* Timer expired warning - handled by popup */}

        {/* Amount */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-4 mb-4 text-center">
          <p className="text-gray-600 text-sm mb-1">Total Amount to Pay</p>
          <p className="text-4xl font-bold text-primary">₹{amount}</p>
          <p className="text-xs text-gray-500 mt-1">Includes convenience fee</p>
        </div>

        {/* Booking Details */}
        <div className="bg-blue-50 rounded-xl p-3 mb-4 text-sm">
          <p className="font-bold text-blue-800 mb-2">📋 Booking Details</p>
          <div className="space-y-1 text-gray-700">
            <p>🎬 <span className="font-semibold">{bookingDetails?.movie}</span></p>
            <p>🏢 <span className="font-semibold">{bookingDetails?.cinema}</span></p>
            <p>🎫 Seats: <span className="font-semibold">{bookingDetails?.seats}</span></p>
            <p>🕐 Show: <span className="font-semibold">{bookingDetails?.showTime}</span></p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="mb-4">
          <p className="text-center text-gray-700 mb-3 font-semibold text-sm">
            📱 Scan QR Code to Pay
          </p>
          <div className="flex justify-center">
            <div className="border-4 border-primary rounded-xl p-2 bg-white shadow-md">
              {qrCodeUrl ? (
                <div className="relative">
                  <img
                    src={qrCodeUrl}
                    alt="UPI QR Code"
                    className="w-56 h-56"
                  />
                  {/* PhonePe logo overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white rounded-full p-1 shadow">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">पे</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-56 h-56 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500">Generating QR...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* UPI Apps */}
          <div className="flex justify-center gap-3 mt-3">
            {[
              { name: 'GPay', emoji: '🔵', bg: 'bg-blue-50' },
              { name: 'PhonePe', emoji: '🟣', bg: 'bg-purple-50' },
              { name: 'Paytm', emoji: '🔷', bg: 'bg-blue-50' },
              { name: 'BHIM', emoji: '🟠', bg: 'bg-orange-50' },
            ].map((app) => (
              <div key={app.name} className={`${app.bg} rounded-lg px-3 py-1 text-xs font-semibold border border-gray-100`}>
                {app.emoji} {app.name}
              </div>
            ))}
          </div>
        </div>

        {/* Transaction ID */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Transaction Reference</p>
              <p className="font-mono text-sm font-bold">{transactionId}</p>
            </div>
            <button
              onClick={() => copyToClipboard(transactionId, 'txn')}
              className={`text-xs px-3 py-1 rounded-lg transition ${copied === 'txn' ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {copied === 'txn' ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Manual UPI ID */}
        <div className="mb-4">
          <button
            onClick={() => setShowManualUpi(!showManualUpi)}
            className="w-full text-primary text-sm font-medium hover:underline"
          >
            {showManualUpi ? '▲ Hide' : '▼ Can\'t scan? Pay using UPI ID'}
          </button>
          {showManualUpi && (
            <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-2 font-semibold">Pay to UPI ID:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={upiId}
                  readOnly
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
                />
                <button
                  onClick={() => copyToClipboard(upiId, 'upi')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${copied === 'upi' ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-secondary'}`}
                >
                  {copied === 'upi' ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Open any UPI app → Send Money → Enter UPI ID → Enter ₹{amount}
              </p>
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-xs font-bold text-yellow-800 mb-1">⚠️ Important:</p>
          <ul className="text-xs text-yellow-800 space-y-0.5 list-disc list-inside">
            <li>Complete payment within {PAYMENT_CONFIG.PAYMENT_TIMEOUT} minutes</li>
            <li>Do not close or refresh this page</li>
            <li>Enter exact amount: <strong>₹{amount}</strong></li>
            <li>Save transaction ID for support</li>
          </ul>
        </div>

        {/* Confirm Payment Button */}
        <button
          onClick={handleVerifyPayment}
          disabled={verifying || timer === 0}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {verifying ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              Verifying Payment...
            </span>
          ) : (
            '✅ I Have Completed Payment'
          )}
        </button>

        <p className="text-xs text-center text-gray-400 mt-3">
          🔒 Secured by UPI • Powered by NPCI
        </p>
      </div>
    </div>
  );
};

export default UpiPayment;
