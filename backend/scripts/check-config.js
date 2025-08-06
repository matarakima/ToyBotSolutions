#!/usr/bin/env node

/**
 * Script para verificar la configuración de variables de entorno
 * Útil para debug y verificar que todo esté configurado correctamente
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('🔧 VERIFICACIÓN DE CONFIGURACIÓN\n');

// Variables requeridas para Azure Search
const requiredVars = [
    'AZURE_SEARCH_ENDPOINT',
    'AZURE_SEARCH_KEY',
    'AZURE_SEARCH_INDEX_NAME'
];

// Variables opcionales pero útiles
const optionalVars = [
    'OPENAI_API_KEY',
    'AZURE_OPENAI_ENDPOINT',
    'AZURE_OPENAI_API_KEY',
    'JWT_SECRET',
    'PORT'
];

console.log('📋 Variables requeridas para Azure Search:');
let allRequired = true;

requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        console.log(`✅ ${varName}: ${value.substring(0, 20)}${'*'.repeat(Math.max(0, value.length - 20))}`);
    } else {
        console.log(`❌ ${varName}: NO CONFIGURADA`);
        allRequired = false;
    }
});

console.log('\n📋 Variables opcionales:');
optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        console.log(`✅ ${varName}: ${value.substring(0, 20)}${'*'.repeat(Math.max(0, value.length - 20))}`);
    } else {
        console.log(`⚠️  ${varName}: No configurada`);
    }
});

console.log('\n📁 Verificación de archivos:');

// Verificar archivo .env
const envPath = path.join(__dirname, '../.env');
const fs = require('fs');

if (fs.existsSync(envPath)) {
    console.log(`✅ Archivo .env encontrado: ${envPath}`);
} else {
    console.log(`❌ Archivo .env NO encontrado: ${envPath}`);
    console.log('   Copia el archivo .env.example como .env y configura las variables');
}

// Verificar carpeta rag-data
const ragDataPath = path.join(__dirname, '../../rag-data');
if (fs.existsSync(ragDataPath)) {
    const files = fs.readdirSync(ragDataPath).filter(f => f.endsWith('.md') && f !== 'README.md');
    console.log(`✅ Carpeta rag-data encontrada con ${files.length} archivos .md`);
    files.forEach(file => {
        console.log(`   📄 ${file}`);
    });
} else {
    console.log(`❌ Carpeta rag-data NO encontrada: ${ragDataPath}`);
}

console.log('\n🎯 RESUMEN:');
if (allRequired) {
    console.log('✅ Todas las variables requeridas están configuradas');
    console.log('🚀 Puedes ejecutar los scripts de Azure Search');
} else {
    console.log('❌ Faltan variables requeridas');
    console.log('📝 Configura las variables faltantes en el archivo .env');
}

console.log('\n💡 Comandos disponibles:');
console.log('   npm run upload-rag          # Subir datos a Azure Search');
console.log('   npm run test-search          # Probar búsquedas');
console.log('   npm run test-search-interactive  # Búsqueda interactiva');

// Verificar que las dependencias estén instaladas
console.log('\n📦 Verificación de dependencias:');
try {
    require('@azure/search-documents');
    console.log('✅ @azure/search-documents está instalado');
} catch (error) {
    console.log('❌ @azure/search-documents NO está instalado');
    console.log('   Ejecuta: npm install @azure/search-documents');
}

try {
    require('dotenv');
    console.log('✅ dotenv está instalado');
} catch (error) {
    console.log('❌ dotenv NO está instalado');
    console.log('   Ejecuta: npm install dotenv');
}
