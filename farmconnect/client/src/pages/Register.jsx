import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer', phone: '', location: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await API.post('/auth/register', form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      data.user.role === 'farmer' ? navigate('/farmer') : navigate('/buyer')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">🌾 Register</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <input className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
            <option value="buyer">Buyer</option>
            <option value="farmer">Farmer</option>
          </select>
          <button type="submit" className="bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">Register</button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-500">Already have an account? <Link to="/login" className="text-green-600 font-semibold">Login</Link></p>
      </div>
    </div>
  )
}

export default Register