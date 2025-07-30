/**
 * Script para limpiar la base de datos de pruebas
 * Elimina archivos de base de datos y reportes generados
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Limpiando archivos de pruebas...');

// Función para eliminar archivo si existe
function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`✅ Eliminado: ${filePath}`);
  } else {
    console.log(`ℹ️  No existe: ${filePath}`);
  }
}

// Función para eliminar directorio si existe
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ Eliminado: ${dirPath}`);
  } else {
    console.log(`ℹ️  No existe: ${dirPath}`);
  }
}

try {
  // Eliminar archivos de base de datos de pruebas
  const dbFiles = [
    './test-database.sqlite',
    './test-database.sqlite-journal',
    './test-database.sqlite-wal',
    './test-database.sqlite-shm'
  ];

  dbFiles.forEach(file => {
    removeFile(file);
  });

  // Eliminar directorio de reportes
  removeDirectory('./reports');

  // Eliminar logs de pruebas
  const logFiles = [
    './test.log',
    './jest.log',
    './coverage.log'
  ];

  logFiles.forEach(file => {
    removeFile(file);
  });

  // Eliminar archivos temporales
  const tempFiles = [
    './.nyc_output',
    './coverage',
    './.jest-cache'
  ];

  tempFiles.forEach(file => {
    removeDirectory(file);
  });

  console.log('✅ Limpieza completada exitosamente');
} catch (error) {
  console.error('❌ Error durante la limpieza:', error.message);
  process.exit(1);
} 