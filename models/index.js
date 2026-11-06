const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

const basename = path.basename(__filename);

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing!');
}

console.log('PG PATH:', require.resolve('pg'));
console.log('PG VERSION:', require('pg/package.json').version);
console.log('DATABASE URL EXISTS:', !!process.env.DATABASE_URL);

// const sequelizeDB = require('../config/config.json');

// const sequelize = new Sequelize(
//     sequelizeDB.development.database,
//     sequelizeDB.development.username,
//     sequelizeDB.development.password,
//     {
//         host: sequelizeDB.development.host,
//         dialect: sequelizeDB.development.dialect
//     }
// );

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );

        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;