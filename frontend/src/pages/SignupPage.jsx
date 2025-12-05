import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import vectorYellowBg from '../assets/vector-yellow-abstract-background.jpg'

function SignupPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('learner')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await register({
        name: `${firstName} ${lastName}`,
        email,
        password,
        role
      })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main 
        className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
        style={{
          backgroundImage: `url(${vectorYellowBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
        
        <div className="w-full max-w-lg p-10 bg-white/95 backdrop-blur-sm border border-amber-100/50 rounded-3xl shadow-2xl relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold bg-linear-to-r from-amber-900 to-amber-700 bg-clip-text text-transparent mb-3">Create Account</h1>
            <p className="text-amber-600 text-lg">Join Kalakendra and start your creative journey</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-3">Select Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('learner')}
                  className={`py-4 px-6 rounded-xl border-2 font-semibold transition-all duration-200 relative overflow-hidden ${
                    role === 'learner'
                      ? 'border-amber-600 bg-linear-to-br from-amber-50 to-amber-100 text-amber-900 shadow-lg'
                      : 'border-amber-200 text-amber-700 hover:border-amber-400 hover:bg-amber-50/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Learner</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('artist')}
                  className={`py-4 px-6 rounded-xl border-2 font-semibold transition-all duration-200 relative overflow-hidden ${
                    role === 'artist'
                      ? 'border-amber-600 bg-linear-to-br from-amber-50 to-amber-100 text-amber-900 shadow-lg'
                      : 'border-amber-200 text-amber-700 hover:border-amber-400 hover:bg-amber-50/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <span>Artist</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2.5">First Name</label>
                <input 
                  required
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  className="w-full px-4 py-3.5 border border-amber-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" 
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2.5">Last Name</label>
                <input 
                  required
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  className="w-full px-4 py-3.5 border border-amber-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" 
                  placeholder="Doe"
                />
              </div>
            </div>

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
                minLength={6}
                className="w-full px-4 py-3.5 border border-amber-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" 
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2.5">Confirm Password</label>
              <input 
                required 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                type="password" 
                minLength={6}
                className="w-full px-4 py-3.5 border border-amber-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" 
                placeholder="Re-enter your password"
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-linear-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-8"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-amber-100">
            <p className="text-sm text-amber-600 text-center">
              Already have an account? <Link to="/auth/login" className="text-amber-900 font-semibold hover:text-amber-700 transition-colors duration-200 underline decoration-amber-300 hover:decoration-amber-500">Login</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignupPage
