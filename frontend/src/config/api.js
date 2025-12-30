// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || ''

// To Remove trailing slash if present
export const API_BASE_URL = API_URL.replace(/\/$/, '')
