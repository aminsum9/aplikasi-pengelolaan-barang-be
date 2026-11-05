'use strict';
const sequelizePaginate = require('sequelize-paginate')

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    'users',
    {
      role: DataTypes.STRING,
      username: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      token: DataTypes.STRING,
    },
    {}
  );
  users.associate = function (models) {
    // associations can be defined here
  };

  sequelizePaginate.paginate(users);

  return users;
};