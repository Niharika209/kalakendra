import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function SignupPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('learner') // 'learner' or 'artist'
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Store user object locally with all fields
    const user = {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      role,
      password // In production, never store plain passwords!
    }
    try {
      localStorage.setItem('user', JSON.stringify(user))
    } catch (e) {
      setError('Could not create account. Please try again.')
      return
    }
    window.dispatchEvent(new CustomEvent('userChanged'))
    navigate('/')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-yellow-50 px-4 py-12">
        <div className="w-full max-w-md p-8 bg-white border border-amber-100 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Create Account</h1>
          <p className="text-amber-700 mb-6">Join Kalakendra and start your creative journey</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('learner')}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all duration-200 ${
                    role === 'learner'
                      ? 'border-amber-600 bg-amber-50 text-amber-900'
                      : 'border-amber-200 text-amber-700 hover:border-amber-400'
                  }`}
                >
                  🎓 Learner
                </button>
                <button
                  type="button"
                  onClick={() => setRole('artist')}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all duration-200 ${
                    role === 'artist'
                      ? 'border-amber-600 bg-amber-50 text-amber-900'
                      : 'border-amber-200 text-amber-700 hover:border-amber-400'
                  }`}
                >
                  🎨 Artist
                </button>
              </div>
              
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">First Name</label>
                <input 
                  required
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200" 
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">Last Name</label>
                <input 
                  required
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200" 
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">Email</label>
              <input 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200" 
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">Password</label>
              <input 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                minLength={6}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200" 
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">Confirm Password</label>
              <input 
                required 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                type="password" 
                minLength={6}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200" 
                placeholder="Re-enter your password"
              />
            </div>

            <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
              Create Account
            </button>
          </form>
          <p className="text-sm text-amber-700 mt-6 text-center">
            Already have an account? <Link to="/auth/login" className="text-amber-900 font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </main>
    </>
  )
}

export default SignupPage
