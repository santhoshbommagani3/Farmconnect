import { useState } from 'react'
import { predictPrice } from '../api/predict'

const PricePrediction = () => {
  const [form, setForm] = useState({
    state: '',
    commodity: '',
    variety: '',
    grade: 'FAQ'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await predictPrice(form.state, form.commodity, form.variety, form.grade)
      setResult(data)
    } catch (err) {
      setError('Prediction failed. Make sure ML service is running.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Crop Price Prediction</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="e.g. Maharashtra"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commodity</label>
            <input
              type="text"
              name="commodity"
              value={form.commodity}
              onChange={handleChange}
              placeholder="e.g. Tomato"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Variety</label>
            <input
              type="text"
              name="variety"
              value={form.variety}
              onChange={handleChange}
              placeholder="e.g. Other"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <select
              name="grade"
              value={form.grade}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="FAQ">FAQ</option>
              <option value="Local">Local</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            {loading ? 'Predicting...' : 'Predict Price'}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-sm">Predicted Price</p>
            <p className="text-4xl font-bold text-green-700 mt-1">₹{result.predicted_price}</p>
            <p className="text-gray-400 text-xs mt-1">{result.unit}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default PricePrediction