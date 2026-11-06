'use strict';
const sequelizePaginate = require('sequelize-paginate')

module.exports = (sequelize, DataTypes) => {
  const sub_categories = sequelize.define(
    'sub_categories',
    {
      category: DataTypes.STRING,
      name: DataTypes.STRING,
      price_limit: DataTypes.INTEGER,
    },
    {}
  );
  sub_categories.associate = function (models) {
    // associations can be defined here
  };

  sequelizePaginate.paginate(sub_categories);

  return sub_categories;
};