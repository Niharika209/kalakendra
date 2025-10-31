import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // For now, signup just stores the same user object locally
    const user = { name: name || email.split('@')[0] || 'User', email }
    try {
      localStorage.setItem('user', JSON.stringify(user))
    } catch (e) {
      // ignore
    }
    window.dispatchEvent(new CustomEvent('userChanged'))
    navigate('/')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md p-8 bg-white border border-amber-100 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-amber-900 mb-4">Sign Up</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-amber-200 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">Email</label>
              <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full px-3 py-2 border border-amber-200 rounded" />
            </div>
            <button className="w-full bg-amber-600 text-white py-2 rounded">Create account</button>
          </form>
          <p className="text-sm text-amber-700 mt-4">Already have an account? <Link to="/auth/login" className="text-amber-900 font-semibold">Login</Link></p>
        </div>
      </main>
    </>
  )
}

export default SignupPage
