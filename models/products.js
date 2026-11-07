'use strict';
const sequelizePaginate = require('sequelize-paginate')

module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define(
    'products',
    {
      warehouse_number: DataTypes.STRING,
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      unit: DataTypes.STRING,
      total: DataTypes.INTEGER,
      expired_date: DataTypes.DATE,
    },
    {}
  );
  products.associate = function (models) {
    // associations can be defined here
    products.belongsTo(models.warehouses, {
      foreignKey: 'warehouse_number',
      targetKey: 'number',
      as: 'warehouse',
    });
  };

  sequelizePaginate.paginate(products);

  return products;
};