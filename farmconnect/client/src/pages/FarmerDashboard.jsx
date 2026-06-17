import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function FarmerDashboard() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', price: '', quantity: '', unit: 'kg', category: '', location: '' })
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user || user.role !== 'farmer') return navigate('/login')
    API.get('/products').then(res => setProducts(res.data.filter(p => p.farmer?._id === user.id)))
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/products', form)
      setProducts([...products, res.data])
      setForm({ name: '', price: '', quantity: '', unit: 'kg', category: '', location: '' })
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to add product')
    }
  }

  const handleDelete = async (id) => {
    await API.delete(`/products/${id}`)
    setProducts(products.filter(p => p._id !== id))
  }

  return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-green-700 text-white px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🧑‍🌾 Farmer Dashboard</h1>
        <div className="flex gap-3">
          <button onClick={() => navigate('/')} className="bg-white text-green-700 px-4 py-1 rounded font-semibold">🏠 Home</button>
          <button onClick={() => { localStorage.clear(); navigate('/') }} className="bg-red-500 px-4 py-1 rounded">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <p className="text-green-700 font-semibold mb-6">Welcome, {user?.name}!</p>

        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h3 className="text-xl font-bold text-green-700 mb-4">Add New Product</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
            <input className="border rounded-lg px-4 py-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Product name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Price (₹)" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            <input className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Quantity" type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
            <input className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
            <input className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
            <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="dozen">dozen</option>
              <option value="piece">piece</option>
            </select>
            <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">Add Product</button>
          </form>
        </div>

        <h3 className="text-xl font-bold text-green-700 mb-4">My Products</h3>
        {products.length === 0 && <p className="text-gray-500">No products added yet.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p._id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-green-800">{p.name}</h4>
                <p className="text-sm text-gray-500">₹{p.price}/{p.unit} — {p.quantity} available</p>
              </div>
              <button onClick={() => handleDelete(p._id)} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FarmerDashboard