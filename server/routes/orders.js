import express from 'express'
import Order from '../models/Order.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// Place order
router.post('/', protect, async (req, res) => {
  try {
    const { product, quantity, totalPrice } = req.body
    const order = await Order.create({ buyer: req.user.id, product, quantity, totalPrice })
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get my orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).populate('product')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Cancel order
router.delete('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (order.buyer.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' })
    await order.deleteOne()
    res.json({ message: 'Order cancelled successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router