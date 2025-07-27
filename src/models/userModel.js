// Modelo de usuario usando Knex
const knex = require('../db');

async function createUser(username, passwordHash) {
  return knex('users').insert({ username, password: passwordHash });
}

async function findUserByUsername(username) {
  return knex('users').where({ username }).first();
}

module.exports = { createUser, findUserByUsername };
