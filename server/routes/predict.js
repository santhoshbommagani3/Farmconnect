import express from 'express';
const router = express.Router();

router.post('/predict-price', async (req, res) => {
  try {
    const { state, commodity, variety, grade } = req.body;

    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state, commodity, variety, grade })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ success: false, error: 'ML service unavailable' });
  }
});

export default router;