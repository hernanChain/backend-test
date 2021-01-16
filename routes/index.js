const router = require('express').Router();
const { Product, Tax, RangeTax } = require('../db');

router.post('/product', async (req, res) => {
  const sameName = await Product.findOne({ where: { name: req.body.name.toLowerCase() } });
  if (sameName) {
    return res.status(400).json({ error: `Product with ${req.body.name} as name already exists.` });
  }
  req.body.name = req.body.name.toLowerCase();
  const product = await Product.create(req.body);
  res.json(product);
});

router.post('/tax', (req, res) => {
  res.send('The tax router has been called');
});

router.post('/range', (req, res) => {
  res.send('The range router has been called');
});

module.exports = router;
