const Sequelize = require('sequelize');
const ProductModel = require('./models/product');
const TaxModel = require('./models/tax');
const RangeTaxModel = require('./models/range_tax');

const sequelize = new Sequelize('pragma_db', 'root', 'secret', {
  host: 'localhost',
  port: 33060,
  dialect: 'mysql',
});

const Product = ProductModel(sequelize, Sequelize);
const Tax = TaxModel(sequelize, Sequelize);
const RangeTax = RangeTaxModel(sequelize, Sequelize);

sequelize.sync({ force: false }).then(() => {
  console.log('Database ok!');
});

module.exports = {
  Product,
  Tax,
  RangeTax,
};
