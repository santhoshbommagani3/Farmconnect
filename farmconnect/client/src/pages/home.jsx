import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

function Home() {
  const [products, setProducts] = useState([])
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    API.get('/products').then(res => setProducts(res.data))
  }, [])

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar */}
      <nav className="bg-green-700 text-white px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🌾 FarmConnect</h1>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-green-200">Hi, {user.name}</span>
              <Link to={user.role === 'farmer' ? '/farmer' : '/buyer'} className="bg-white text-green-700 px-4 py-1 rounded font-semibold">Dashboard</Link>
              <button onClick={() => { localStorage.clear(); window.location.reload() }} className="bg-red-500 px-4 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-white text-green-700 px-4 py-1 rounded font-semibold">Login</Link>
              <Link to="/register" className="bg-yellow-400 text-black px-4 py-1 rounded font-semibold">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-green-700 text-white text-center py-16 px-4">
        <h2 className="text-4xl font-bold mb-3">Fresh from the Farm 🥦</h2>
        <p className="text-green-200 text-lg">Buy directly from farmers. No middlemen. Better prices.</p>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h3 className="text-2xl font-bold text-green-800 mb-6">Fresh Products</h3>
        {products.length === 0 ? (
          <p className="text-gray-500">No products yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p._id} className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
                <h4 className="text-xl font-semibold text-green-800">{p.name}</h4>
                <p className="text-green-600 font-bold mt-1">₹{p.price} / {p.unit}</p>
                <p className="text-gray-500 text-sm mt-1">Available: {p.quantity} {p.unit}</p>
                <p className="text-gray-500 text-sm">📍 {p.location}</p>
                <p className="text-gray-500 text-sm">🧑‍🌾 {p.farmer?.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home