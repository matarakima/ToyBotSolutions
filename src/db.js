// Inicialización de Knex
const knexConfig = require('../knexfile');
const env = process.env.NODE_ENV === 'test' ? 'test' : (knexConfig[process.env.NODE_ENV] ? process.env.NODE_ENV : 'development');
const knex = require('knex')(knexConfig[env]);

module.exports = knex;
