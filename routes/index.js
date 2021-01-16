const router = require('express').Router();
const { Op } = require('sequelize');
const { Product, Tax, RangeTax } = require('../db');

router.post('/product', async (req, res) => {
  const sameName = await Product.findOne({ where: { name: req.body.name.toLowerCase() } });
  if (sameName) {
    return res.status(400).json({ error: `Product with ${req.body.name} as name already exists.` });
  }
  try {
    req.body.name = req.body.name.toLowerCase();
    const product = await Product.create(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: `Unexpected error with name ${error.name}` });
  }
});

router.post('/tax', async (req, res) => {
  const sameName = await Tax.findOne({ where: { name: req.body.name.toLowerCase() } });
  if (sameName) {
    return res.status(400).json({ error: `Tax with ${req.body.name} as name already exists.` });
  }
  try {
    req.body.name = req.body.name.toLowerCase();
    const tax = await Tax.create(req.body);
    res.json(tax);
  } catch (error) {
    res.status(400).json({ error: `Unexpected error with name ${error.name}` });
  }
});

router.post('/range', async (req, res) => {
  if (req.body.start < req.body.end) {
    const intersectedRange = await RangeTax.findAll({
      where: {
        [Op.and]: [
          { tax_id: req.body.tax_id },
          {
            [Op.or]: [
              {
                [Op.and]: [
                  {
                    start: {
                      [Op.lte]: req.body.start,
                    },
                    end: {
                      [Op.gte]: req.body.start,
                    },
                  },
                ],
              },
              {
                [Op.and]: [
                  {
                    start: {
                      [Op.lte]: req.body.end,
                    },
                    end: {
                      [Op.gte]: req.body.end,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });
    if (intersectedRange.length === 0) {
      try {
        const rangeTax = await RangeTax.create(req.body);
        res.json(rangeTax);
      } catch (error) {
        res.status(400).json({ error: `Unexpected error with name ${error.name}` });
      }
    } else {
      res.status(400).json({ error: 'Intersection in range' });
    }
  } else {
    res.status(400).json({ error: 'The start value should lower than end value' });
  }
});

module.exports = router;
