const Tax = require('./tax');
module.exports = (sequelize, type) => {
  return sequelize.define('range_tax', {
    id: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    start: type.INTEGER,
    end: type.INTEGER,
    value: type.INTEGER,
    tax_id: {
      type: type.INTEGER,
      references: {
        model: 'taxes',
        key: 'id',
      },
    },
  });
};
