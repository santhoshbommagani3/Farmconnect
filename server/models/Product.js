import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  category: { type: String },
  image: { type: String },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String },
}, { timestamps: true })

export default mongoose.model('Product', productSchema)