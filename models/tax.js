const Product = require('./product');
module.exports = (sequelize, type) => {
  return sequelize.define('tax', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: type.STRING,
    product_id: {
      type: type.INTEGER,
      references: {
        model: 'products',
        key: 'id',
      },
    },
  });
};
