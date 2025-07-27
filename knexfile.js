// Configuración de Knex para SQLite y Azure SQL
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'mssql',
    connection: {
      host: process.env.AZURE_SQL_HOST,
      user: process.env.AZURE_SQL_USER,
      password: process.env.AZURE_SQL_PASSWORD,
      database: process.env.AZURE_SQL_DB,
      options: {
        encrypt: true
      }
    }
  }
};
