'use strict';
const sequelizePaginate = require('sequelize-paginate')

module.exports = (sequelize, DataTypes) => {
  const warehouses = sequelize.define(
    'warehouses',
    {
      operator: DataTypes.STRING,
      category: DataTypes.STRING,
      sub_category: DataTypes.STRING,
      price_limit: DataTypes.INTEGER,
      origin: DataTypes.STRING,
      number: DataTypes.STRING,
      attachment: DataTypes.STRING,
    },
    {}
  );
  warehouses.associate = function (models) {
    // associations can be defined here
  };

  sequelizePaginate.paginate(warehouses);

  return warehouses;
};