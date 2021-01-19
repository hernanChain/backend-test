const router = require('express').Router();
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const { Product, Tax, RangeTax } = require('../db');
const fs = require('fs');

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

router.get('/calculate/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.json({ error: `The product with code ${req.params.id} doesn´t exists` });
  }
  const productValue = product.value;
  const { count, rows } = await Tax.findAndCountAll({
    where: {
      product_id: req.params.id,
    },
  });
  if (count > 0) {
    let taxes_id = [];
    rows.forEach((tax) => {
      taxes_id.push({ tax_id: tax.dataValues.id });
    });
    const taxesApplied = await RangeTax.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: taxes_id,
          },
          {
            start: {
              [Op.lte]: productValue,
            },
          },
          {
            end: {
              [Op.gte]: productValue,
            },
          },
        ],
      },
    });
    let taxAcumulator = productValue;
    taxesApplied.forEach((taxApplied) => {
      taxAcumulator += (productValue * taxApplied.dataValues.value) / 100;
    });
    res.json({ productValue: taxAcumulator });

    // Create a document
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(`Product_${req.params.id}.pdf`));
    doc
      .fontSize(15)
      .text(
        `The Product Value with ${req.params.id} code is : ${taxAcumulator} (Taxes Included)`,
        50,
        50,
      );
    doc.end();
  } else {
    res.json({ message: 'The product have not taxes' });
  }
});

module.exports = router;
