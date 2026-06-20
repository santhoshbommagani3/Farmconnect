import axios from 'axios'

export const predictPrice = async (state, commodity, variety, grade) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/predict-price`,
    { state, commodity, variety, grade }
  )
  return response.data
}