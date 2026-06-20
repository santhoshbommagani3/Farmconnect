import { Routes, Route } from 'react-router-dom'
import Home from './pages/home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import FarmerDashboard from './pages/FarmerDashboard.jsx'
import BuyerDashboard from './pages/BuyerDashboard.jsx'
import PricePrediction from './pages/PricePrediction.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/farmer" element={<FarmerDashboard />} />
      <Route path="/buyer" element={<BuyerDashboard />} />
      <Route path="/predict" element={<PricePrediction />} />
    </Routes>
  )
}

export default App