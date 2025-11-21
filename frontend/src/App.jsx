import './App.css'
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
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
import CreateWorkshopPage from './pages/CreateWorkshopPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/workshops" element={<WorkshopsListPage />} />
      <Route path="/workshops/:categoryId" element={<CategoryDetailPage />} />
      <Route path="/workshops/:categoryId/:subcategoryName" element={<SubcategoryDetailPage />} />
      <Route path="/artists" element={<ArtistsListPage />} />
      <Route path="/artists/:id" element={<ArtistProfilePage />} />
      <Route path="/workshop/:id" element={<WorkshopDetailPage />} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/artist-dashboard" element={<PrivateRoute requiredRole="artist"><ArtistProfileDashboard /></PrivateRoute>} />
      <Route path="/create-workshop" element={<PrivateRoute requiredRole="artist"><CreateWorkshopPage /></PrivateRoute>} />
      <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
    </Routes>
  )
}

export default App