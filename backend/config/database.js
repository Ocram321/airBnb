// backend/config/database.js
const config = require('./index');

module.exports = {
  development: {
    storage: config.dbFile,
    ...(process.env.USE_LOCAL_POSTGRESS === 'false' ? {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      dialectOptions: {},
      define: {
        schema: 'public',
      }
    } : {
      dialect: "sqlite",
    }),
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      schema: process.env.SCHEMA
    }
  }
};