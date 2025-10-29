import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ArtistProfilePage from './pages/ArtistProfilePage'
import CheckoutPage from './pages/CheckoutPage'
import WorkshopsListPage from './pages/WorkshopsListPage'
import CategoryDetailPage from './pages/CategoryDetailPage'
import SubcategoryDetailPage from './pages/SubcategoryDetailPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workshops" element={<WorkshopsListPage />} />
        <Route path="/workshops/:categoryId" element={<CategoryDetailPage />} />
        <Route path="/workshops/:categoryId/:subcategoryName" element={<SubcategoryDetailPage />} />
        <Route path="/artist/:id" element={<ArtistProfilePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </Router>
  )
}

export default App
