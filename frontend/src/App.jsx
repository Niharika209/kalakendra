import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ArtistProfilePage from './pages/ArtistProfilePage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/artist/:id" element={<ArtistProfilePage />} />
      </Routes>
    </Router>
  )
}

export default App
