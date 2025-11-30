import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

// Cart is persisted in localStorage under key 'cart'. Start with stored cart or empty array.

function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })
  const [step, setStep] = useState("cart")
  const [loading, setLoading] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [itemToRemove, setItemToRemove] = useState(null)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + tax

  const incrementQuantity = (id) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
  }

  const decrementQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)),
    )
  }

  const handleRemoveClick = (id) => {
    setItemToRemove(id)
    setShowRemoveConfirm(true)
  }

  const confirmRemove = () => {
    if (itemToRemove !== null) {
      setCartItems((prev) => prev.filter((item) => item.id !== itemToRemove))
      setShowRemoveConfirm(false)
      setItemToRemove(null)
    }
  }

  const cancelRemove = () => {
    setShowRemoveConfirm(false)
    setItemToRemove(null)
  }

  const handlePayment = async () => {
    
    if (!user) {
      alert('Please login to continue with payment')
      navigate('/login')
      return
    }

    setLoading(true)

    try {
      // Create Razorpay order via backend
      const response = await axios.post('/api/payment/create-order', {
        amount: total,
        currency: 'INR',
      })

      console.log('ORDER DATA:', response.data);
      
      const { id: order_id, amount, currency } = response.data

      console.log('Razorpay Key:', import.meta.env.VITE_RAZORPAY_KEY_ID);
      console.log('Order ID:', order_id);
      console.log('Amount:', amount, 'Currency:', currency);

      // Set up Razorpay options - Minimal config for maximum compatibility
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "KalaKendra",
        description: `Workshop Enrollment - ${cartItems.length} workshop(s)`,
        order_id: order_id,
        handler: async (response) => {
          console.log('Payment successful:', response);

          try {
            const existingWorkshops = JSON.parse(localStorage.getItem(`workshops_${user.email}`) || '[]');
            const newEnrolledWorkshops = cartItems.map(item => ({
              ...item,
              completed: false,
              enrolledDate: new Date().toISOString(),
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id
            }));
            const allWorkshops = [...existingWorkshops, ...newEnrolledWorkshops];
            localStorage.setItem(`workshops_${user.email}`, JSON.stringify(allWorkshops));

            localStorage.removeItem('cart');
            setCartItems([]);
          } catch (e) {
            console.error('Error saving enrolled workshops:', e);
          }

          setStep("confirmation");
          setLoading(false);
        },
        prefill: {
          name: user.name || 'Test User',
          email: user.email || 'test@example.com',
          contact: '9999999999'
        },
        theme: {
          color: "#d97706"
        },
        modal: {
          escape: true,
          ondismiss: () => {
            setLoading(false);
            console.log('Checkout closed');
          }
        }
      }

      console.log('Razorpay options:', options);

      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error)
        alert(`Payment failed: ${response.error.description || 'Please try again'}`)
        setLoading(false)
      })
      paymentObject.open()
    } catch (error) {
      console.error('Payment initiation failed:', error)
      alert('Failed to initiate payment. Please try again.')
      setLoading(false)
    }
  }

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    } catch (e) {
      // ignore storage errors
    }
  }, [cartItems])

  if (step === "confirmation") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-linear-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center px-4 py-12">
          <div className="p-12 text-center max-w-md border border-amber-200 bg-white rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Payment Successful!</h2>
            <p className="text-amber-800 mb-6">You have been enrolled in {cartItems.length} workshop(s).</p>
            <p className="text-sm text-amber-700 mb-6">Check your email for workshop details and access links.</p>
            <button
              onClick={() => navigate('/profile', { state: { tab: 'enrolled' } })}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-md font-medium transition-colors"
            >
              View My Workshops
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {showRemoveConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="p-6 max-w-md w-full border border-amber-200 bg-white rounded-lg shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Remove Workshop?</h3>
                  <p className="text-sm text-amber-700">
                    Are you sure you want to remove this workshop from your cart? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={cancelRemove}
                  className="flex-1 border border-amber-300 text-amber-900 hover:bg-amber-50 px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button onClick={confirmRemove} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-12">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === "cart" && (
                <div className="p-8 border border-amber-100 bg-white rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold text-amber-900 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-8">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 border border-amber-100 rounded-lg transition-all duration-300 hover:shadow-md"
                      >
                        <div className="w-20 h-20 rounded-lg bg-linear-to-br from-yellow-200 to-orange-300 shrink-0 overflow-hidden flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              loading="lazy"
                              onError={(e) => { e.target.onerror = null; e.target.src = '/src/assets/profile.jpg' }}
                              className="w-full h-full object-center object-cover"
                            />
                          ) : (
                            <span className="text-2xl">🎨</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-amber-900">{item.title}</h3>
                          <p className="text-sm text-amber-700 mb-3">By {item.artist}</p>

                          <div className="flex items-center gap-3">
                            <span className="text-sm text-amber-700">Tickets:</span>
                            <div className="flex items-center gap-2 border border-amber-300 rounded-lg">
                              <button
                                onClick={() => decrementQuantity(item.id)}
                                disabled={item.quantity <= 1}
                                className="p-2 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-l-lg"
                              >
                                <svg className="w-4 h-4 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="px-3 font-semibold text-amber-900 min-w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => incrementQuantity(item.id)}
                                className="p-2 hover:bg-amber-50 transition-all duration-200 rounded-r-lg"
                              >
                                <svg className="w-4 h-4 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col justify-between">
                          <p className="font-bold text-amber-600">₹{item.price * item.quantity}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-amber-700">
                              ₹{item.price} × {item.quantity}
                            </p>
                          )}
                          <button
                            onClick={() => handleRemoveClick(item.id)}
                            className="mt-2 text-red-600 hover:text-red-700 transition-colors duration-200 flex items-center gap-1 text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={cartItems.length === 0 || loading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-md font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="p-6 border border-amber-100 bg-white rounded-lg shadow-md sticky top-20">
                <h3 className="text-lg font-bold text-amber-900 mb-6">Order Total</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-amber-700">Subtotal</span>
                    <span className="font-semibold text-amber-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Tax (18%)</span>
                    <span className="font-semibold text-amber-900">₹{tax}</span>
                  </div>
                  <div className="border-t border-amber-200 pt-3 flex justify-between">
                    <span className="font-bold text-amber-900">Total</span>
                    <span className="text-2xl font-bold text-amber-600">₹{total}</span>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-2 mb-6">
                  <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-sm text-green-700">Secure payment powered by industry-leading encryption</p>
                </div>

                <div className="space-y-2 text-xs text-amber-700">
                  <p>✓ Secure checkout</p>
                  <p>✓ Instant access after payment</p>
                  <p>✓ Money-back guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default CheckoutPage
