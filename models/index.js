const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('dotenv').config();

const basename = path.basename(__filename);

const sequelizeDB = require('../config/config.json');

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
  process.parsed.DATABASE_URL,
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