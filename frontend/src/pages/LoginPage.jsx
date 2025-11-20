import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Get stored user from localStorage
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        
        // Validate email and password
        if (user.email === email && user.password === password) {
          // Successful login
          window.dispatchEvent(new CustomEvent('userChanged'))
          navigate('/')
        } else {
          setError('Invalid email or password')
        }
      } else {
        setError('No account found. Please sign up first.')
      }
    } catch (e) {
      setError('Login failed. Please try again.')
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 px-4">
        <div className="w-full max-w-md p-8 bg-white border border-amber-100 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Welcome Back</h1>
          <p className="text-amber-700 mb-6">Login to continue your creative journey</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200" 
                placeholder="Enter your password"
              />
            </div>
            <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
              Login
            </button>
          </form>
          <p className="text-sm text-amber-700 mt-6 text-center">
            Don't have an account? <Link to="/auth/signup" className="text-amber-900 font-semibold hover:text-amber-700 transition-colors duration-200">Sign up</Link>
          </p>
        </div>
      </main>
    </>
  )
}

export default LoginPage
