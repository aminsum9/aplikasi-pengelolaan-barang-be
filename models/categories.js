'use strict';
const sequelizePaginate = require('sequelize-paginate')

module.exports = (sequelize, DataTypes) => {
  const categories = sequelize.define(
    'categories',
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
    },
    {}
  );
  categories.associate = function (models) {
    // associations can be defined here
  };

  sequelizePaginate.paginate(categories);

  return categories;
};