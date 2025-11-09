require('dotenv').config();

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './database/dev.sqlite',
    logging: false,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: {
    dialect: 'sqlite',
    storage: './database/prod.sqlite',
    logging: false,
  },
};

require('dotenv').config();

const storage = process.env.DB_STORAGE || './database/dev.sqlite';

module.exports = {
  development: { dialect: 'sqlite', storage, logging: false },
  test: { dialect: 'sqlite', storage: ':memory:', logging: false },
  production: { dialect: 'sqlite', storage: process.env.DB_STORAGE || './database/prod.sqlite', logging: false }
};
