import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import WorkshopsListPage from './pages/WorkshopsListPage'
import CategoryDetailPage from './pages/CategoryDetailPage'
import SubcategoryDetailPage from './pages/SubcategoryDetailPage'
import ArtistProfilePage from './pages/ArtistProfilePage'
import ArtistsListPage from './pages/ArtistsListPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import WorkshopDetailPage from './pages/WorkshopDetailPage'
import ProfilePage from './pages/ProfilePage'
import ArtistProfileDashboard from './pages/ArtistProfileDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workshops" element={<WorkshopsListPage />} />
        <Route path="/workshops/:categoryId" element={<CategoryDetailPage />} />
        <Route path="/workshops/:categoryId/:subcategoryName" element={<SubcategoryDetailPage />} />
        <Route path="/artists" element={<ArtistsListPage />} />
        <Route path="/artists/:id" element={<ArtistProfilePage />} />
        <Route path="/workshop/:id" element={<WorkshopDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/artist-dashboard" element={<ArtistProfileDashboard />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  )
}

export default App
