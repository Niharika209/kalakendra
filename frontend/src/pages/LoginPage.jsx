import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import yellowAbstractBg from '../assets/vector-yellow-abstract-background.jpg'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main 
        className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
        style={{
          backgroundImage: `url(${yellowAbstractBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
        
        <div className="w-full max-w-lg p-10 bg-white/95 backdrop-blur-sm border border-amber-100/50 rounded-3xl shadow-2xl relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-900 to-amber-700 bg-clip-text text-transparent mb-3">Welcome Back</h1>
            <p className="text-amber-600 text-lg">Login to continue your creative journey</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2.5">Email Address</label>
              <input 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                className="w-full px-4 py-3.5 border border-amber-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" 
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2.5">Password</label>
              <input 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                className="w-full px-4 py-3.5 border border-amber-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" 
                placeholder="Enter your password"
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-8"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-amber-100">
            <p className="text-sm text-amber-600 text-center">
              Don't have an account? <Link to="/auth/signup" className="text-amber-900 font-semibold hover:text-amber-700 transition-colors duration-200 underline decoration-amber-300 hover:decoration-amber-500">Sign up</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

export default LoginPage
