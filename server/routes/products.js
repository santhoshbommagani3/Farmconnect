import express from 'express'
import Product from '../models/Product.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('farmer', 'name location')
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add product (farmer only)
router.post('/', protect, async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, farmer: req.user.id })
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete product
router.delete('/:id', protect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router