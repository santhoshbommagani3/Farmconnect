import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { predictPrice } from '../api/predict'

function BuyerDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ state: '', commodity: '', variety: '', grade: 'FAQ' })
  const [prediction, setPrediction] = useState(null)
  const [predLoading, setPredLoading] = useState(false)
  const [predError, setPredError] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user || user.role !== 'buyer') return navigate('/login')
    API.get('/products').then(res => setProducts(res.data))
    API.get('/orders/myorders').then(res => setOrders(res.data))
  }, [])

  const handleOrder = async (product) => {
    try {
      await API.post('/orders', { product: product._id, quantity: 1, totalPrice: product.price })
      alert('Order placed successfully!')
      API.get('/orders/myorders').then(res => setOrders(res.data))
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed')
    }
  }

  const handleCancelOrder = async (orderId) => {
    try {
      await API.delete(`/orders/${orderId}`)
      setOrders(orders.filter(o => o._id !== orderId))
      alert('Order cancelled!')
    } catch (err) {
      alert(err.response?.data?.message || 'Cancel failed')
    }
  }

  const handlePredict = async (e) => {
    e.preventDefault()
    setPredLoading(true)
    setPredError('')
    setPrediction(null)
    try {
      const data = await predictPrice(form.state, form.commodity, form.variety, form.grade)
      setPrediction(data)
    } catch (err) {
      setPredError('Prediction failed. Make sure ML service is running.')
    }
    setPredLoading(false)
  }

  return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-green-700 text-white px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🛒 Buyer Dashboard</h1>
        <div className="flex gap-3">
          <button onClick={() => navigate('/')} className="bg-white text-green-700 px-4 py-1 rounded font-semibold">🏠 Home</button>
          <button onClick={() => { localStorage.clear(); navigate('/') }} className="bg-red-500 px-4 py-1 rounded">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <p className="text-green-700 font-semibold mb-6">Welcome, {user?.name}!</p>

        {/* Price Prediction Section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-10">
          <h3 className="text-xl font-bold text-green-700 mb-4">🤖 Crop Price Prediction</h3>
          <form onSubmit={handlePredict} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={form.state}
                onChange={e => setForm({ ...form, state: e.target.value })}
                placeholder="e.g. Maharashtra"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commodity</label>
              <input
                type="text"
                value={form.commodity}
                onChange={e => setForm({ ...form, commodity: e.target.value })}
                placeholder="e.g. Tomato"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variety</label>
              <input
                type="text"
                value={form.variety}
                onChange={e => setForm({ ...form, variety: e.target.value })}
                placeholder="e.g. Other"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select
                value={form.grade}
                onChange={e => setForm({ ...form, grade: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="FAQ">FAQ</option>
                <option value="Local">Local</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2 md:col-span-4">
              <button
                type="submit"
                disabled={predLoading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                {predLoading ? 'Predicting...' : 'Predict Price'}
              </button>
            </div>
          </form>

          {prediction && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-center w-fit">
              <p className="text-gray-500 text-sm">Predicted Market Price</p>
              <p className="text-3xl font-bold text-green-700">₹{prediction.predicted_price}</p>
              <p className="text-gray-400 text-xs mt-1">{prediction.unit}</p>
            </div>
          )}

          {predError && (
            <p className="mt-3 text-red-500 text-sm">{predError}</p>
          )}
        </div>

        <h3 className="text-xl font-bold text-green-700 mb-4">Available Products</h3>
        {products.length === 0 && <p className="text-gray-500">No products available yet.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {products.map(p => (
            <div key={p._id} className="bg-white rounded-xl shadow p-5">
              <h4 className="text-lg font-bold text-green-800">{p.name}</h4>
              <p className="text-green-600 font-semibold">₹{p.price}/{p.unit}</p>
              <p className="text-gray-500 text-sm">📍 {p.location}</p>
              <p className="text-gray-500 text-sm">🧑‍🌾 {p.farmer?.name}</p>
              <button onClick={() => handleOrder(p)} className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">Order Now</button>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-bold text-green-700 mb-4">My Orders</h3>
        {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
        <div className="flex flex-col gap-3">
          {orders.map(o => (
            <div key={o._id} className="bg-white rounded-xl shadow px-5 py-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-green-800">{o.product?.name}</h4>
                <p className="text-sm text-gray-500">₹{o.totalPrice}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : o.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {o.status}
                </span>
                <button
                  onClick={() => handleCancelOrder(o._id)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-red-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BuyerDashboard