/**
 * Configuración de base de datos para pruebas
 * Maneja la creación, migración y limpieza de la base de datos de pruebas
 */

const knex = require('knex');
const path = require('path');
const fs = require('fs');

class TestDatabase {
  constructor() {
    this.dbPath = process.env.TEST_DB_PATH || './test-database.sqlite';
    this.knex = null;
    this.isInitialized = false;
  }

  /**
   * Inicializar la base de datos de pruebas
   */
  async initialize() {
    try {
      // Crear instancia de Knex para pruebas
      this.knex = knex({
        client: 'sqlite3',
        connection: {
          filename: this.dbPath
        },
        useNullAsDefault: true,
        pool: {
          min: 1,
          max: 1
        }
      });

      // Ejecutar migraciones
      await this.runMigrations();
      
      // Ejecutar seeders si existen
      await this.runSeeders();
      
      this.isInitialized = true;
      console.log('✅ Base de datos de pruebas inicializada correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar base de datos de pruebas:', error);
      throw error;
    }
  }

  /**
   * Ejecutar migraciones de la base de datos de pruebas
   */
  async runMigrations() {
    try {
      // Obtener migraciones del proyecto principal
      const migrationsPath = path.resolve('../backend/migrations');
      
      if (fs.existsSync(migrationsPath)) {
        const migrationFiles = fs.readdirSync(migrationsPath)
          .filter(file => file.endsWith('.js'))
          .sort();

        for (const file of migrationFiles) {
          const migration = require(path.join(migrationsPath, file));
          await migration.up(this.knex);
          console.log(`📦 Migración ejecutada: ${file}`);
        }
      }
    } catch (error) {
      console.error('❌ Error al ejecutar migraciones:', error);
      throw error;
    }
  }

  /**
   * Ejecutar seeders de la base de datos de pruebas
   */
  async runSeeders() {
    try {
      // Aquí se pueden agregar seeders específicos para pruebas
      // Por ejemplo, crear usuarios de prueba, datos de ejemplo, etc.
      
      // Crear usuario de prueba por defecto
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('testpass123', 10);
      
      await this.knex('users').insert({
        username: 'testuser',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      }).onConflict('username').ignore();
      
      console.log('🌱 Seeders ejecutados correctamente');
    } catch (error) {
      console.error('❌ Error al ejecutar seeders:', error);
      // No lanzar error aquí, ya que los seeders son opcionales
    }
  }

  /**
   * Obtener instancia de Knex
   */
  getKnex() {
    if (!this.isInitialized) {
      throw new Error('Base de datos no inicializada. Llama a initialize() primero.');
    }
    return this.knex;
  }

  /**
   * Limpiar base de datos de pruebas
   */
  async clean() {
    try {
      if (this.knex) {
        // Eliminar todas las tablas
        const tables = await this.knex.raw("SELECT name FROM sqlite_master WHERE type='table'");
        
        for (const table of tables) {
          if (table.name !== 'sqlite_sequence') {
            await this.knex(table.name).del();
          }
        }
        
        console.log('🧹 Base de datos de pruebas limpiada');
      }
    } catch (error) {
      console.error('❌ Error al limpiar base de datos:', error);
      throw error;
    }
  }

  /**
   * Cerrar conexión a la base de datos
   */
  async close() {
    try {
      if (this.knex) {
        await this.knex.destroy();
        this.knex = null;
        this.isInitialized = false;
        console.log('🔒 Conexión a base de datos cerrada');
      }
    } catch (error) {
      console.error('❌ Error al cerrar conexión:', error);
      throw error;
    }
  }

  /**
   * Eliminar archivo de base de datos
   */
  async drop() {
    try {
      await this.close();
      
      if (fs.existsSync(this.dbPath)) {
        fs.unlinkSync(this.dbPath);
        console.log('🗑️ Archivo de base de datos eliminado');
      }
    } catch (error) {
      console.error('❌ Error al eliminar archivo de base de datos:', error);
      throw error;
    }
  }

  /**
   * Crear backup de la base de datos
   */
  async backup(backupPath) {
    try {
      if (fs.existsSync(this.dbPath)) {
        fs.copyFileSync(this.dbPath, backupPath);
        console.log(`💾 Backup creado en: ${backupPath}`);
      }
    } catch (error) {
      console.error('❌ Error al crear backup:', error);
      throw error;
    }
  }

  /**
   * Restaurar backup de la base de datos
   */
  async restore(backupPath) {
    try {
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, this.dbPath);
        console.log(`🔄 Backup restaurado desde: ${backupPath}`);
      }
    } catch (error) {
      console.error('❌ Error al restaurar backup:', error);
      throw error;
    }
  }
}

// Crear instancia singleton
const testDatabase = new TestDatabase();

// Exportar instancia y clase
module.exports = {
  testDatabase,
  TestDatabase
}; 