// Payment Configuration
// Replace these values with your actual payment details

export const PAYMENT_CONFIG = {
  // Your UPI ID for receiving payments
  // Format: yourname@bankname or mobilenumber@upi
  UPI_ID: '9392842871@ybl', // Your Google Pay UPI ID
  
  // Business/Merchant Name (shown in UPI apps)
  MERCHANT_NAME: 'Mana Cinemas',
  
  // Currency
  CURRENCY: 'INR',
  
  // Payment timeout (in minutes)
  PAYMENT_TIMEOUT: 6,
  
  // Use static QR code (if you have a pre-generated QR code image)
  USE_STATIC_QR: true,
  STATIC_QR_PATH: '/images/upi-qr.png', // Path to your QR code image
};

// Example UPI IDs:
// - 9876543210@paytm
// - businessname@okaxis
// - yourname@ybl (Google Pay)
// - 9876543210@upi
