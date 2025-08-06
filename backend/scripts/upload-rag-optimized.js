#!/usr/bin/env node

/**
 * Script para subir archivos RAG optimizados a Azure AI Search
 * Usa la nueva estructura con metadatos (category, age_range, keywords)
 */

const fs = require('fs');
const path = require('path');
const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');

// Configurar dotenv para que busque el .env en la carpeta backend
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Configuración de Azure Search
const AZURE_SEARCH_ENDPOINT = process.env.AZURE_SEARCH_ENDPOINT;
const AZURE_SEARCH_KEY = process.env.AZURE_SEARCH_KEY;
const AZURE_SEARCH_INDEX_NAME = process.env.AZURE_SEARCH_INDEX_NAME || 'toybot-knowledge-base';

// Validar configuración
if (!AZURE_SEARCH_ENDPOINT || !AZURE_SEARCH_KEY) {
    console.error('❌ Error: Faltan variables de entorno de Azure Search');
    process.exit(1);
}

const credential = new AzureKeyCredential(AZURE_SEARCH_KEY);
const searchClient = new SearchClient(AZURE_SEARCH_ENDPOINT, AZURE_SEARCH_INDEX_NAME, credential);

// Configuración de categorías para extraer metadatos
const CATEGORIES = {
    'products': 'productos',
    'product': 'productos', 
    'catalog': 'productos',
    'safety': 'seguridad',
    'policies': 'politicas',
    'policy': 'politicas',
    'orders': 'pedidos',
    'order': 'pedidos',
    'tracking': 'pedidos',
    'support': 'soporte',
    'faq': 'soporte',
    'help': 'soporte',
    'brand': 'empresa',
    'company': 'empresa',
    'promotion': 'promociones',
    'discount': 'promociones',
    'offer': 'promociones'
};

const AGE_RANGES = {
    'baby': '0-2',
    'bebe': '0-2',
    'toddler': '0-2',
    'preschool': '3-5',
    'preescolar': '3-5',
    'primary': '6-8',
    'primaria': '6-8',
    'school': '6-8',
    'tween': '9-12',
    'teen': '13+',
    'adolescent': '13+',
    'adult': '13+',
    'family': '3+'
};

/**
 * Extrae metadatos del nombre del archivo y contenido
 */
function extractMetadata(filename, content) {
    const filenameLower = filename.toLowerCase();
    const contentLower = content.toLowerCase();
    
    // Extraer categoría - orden específico importa
    let category = 'general';
    
    // Primero buscar en el nombre del archivo (más específico)
    if (filenameLower.includes('product') || filenameLower.includes('catalog')) {
        category = 'productos';
    } else if (filenameLower.includes('faq') || filenameLower.includes('help')) {
        category = 'soporte';
    } else if (filenameLower.includes('policy') || filenameLower.includes('policies')) {
        category = 'politicas';
    } else if (filenameLower.includes('order') || filenameLower.includes('tracking')) {
        category = 'pedidos';
    } else if (filenameLower.includes('safety') || filenameLower.includes('age')) {
        category = 'seguridad';
    } else if (filenameLower.includes('brand') || filenameLower.includes('supplier')) {
        category = 'empresa';
    } else if (filenameLower.includes('promotion') || filenameLower.includes('offer')) {
        category = 'promociones';
    } else if (filenameLower.includes('sample')) {
        category = 'ejemplos';
    }
    
    // Si no encuentra en filename, buscar en contenido
    if (category === 'general') {
        for (const [key, value] of Object.entries(CATEGORIES)) {
            if (contentLower.includes(key)) {
                category = value;
                break;
            }
        }
    }
    
    // Extraer rango de edad
    let ageRange = 'all';
    for (const [key, value] of Object.entries(AGE_RANGES)) {
        if (filenameLower.includes(key) || contentLower.includes(key)) {
            ageRange = value;
            break;
        }
    }
    
    // Extraer palabras clave
    const keywords = [];
    const keywordPatterns = [
        /juguete[s]?/gi,
        /niño[s]?/gi,
        /niña[s]?/gi,
        /seguridad/gi,
        /educativo[s]?/gi,
        /creatividad/gi,
        /aprendizaje/gi,
        /desarrollo/gi,
        /motor/gi,
        /cognitivo/gi,
        /lego/gi,
        /barbie/gi,
        /construcción/gi,
        /rompecabezas/gi,
        /pintura/gi,
        /música/gi,
        /deporte[s]?/gi,
        /bicicleta[s]?/gi,
        /peluche[s]?/gi
    ];
    
    keywordPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
            keywords.push(...matches.map(m => m.toLowerCase()));
        }
    });
    
    // Eliminar duplicados
    const uniqueKeywords = [...new Set(keywords)];
    
    return {
        category,
        ageRange,
        keywords: uniqueKeywords.slice(0, 10) // Máximo 10 keywords
    };
}

/**
 * Genera un título basado en el nombre del archivo
 */
function generateTitle(filename) {
    return filename
        .replace(/\.md$/, '')
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Procesa un archivo RAG y lo convierte en documento para Azure Search
 */
function processFile(filePath, content) {
    const filename = path.basename(filePath);
    const metadata = extractMetadata(filename, content);
    const title = generateTitle(filename);
    
    // Generar ID único basado en el archivo
    const id = filename.replace(/\.md$/, '').replace(/[^a-zA-Z0-9]/g, '_');
    
    return {
        id: id,
        content: content.trim(),
        title: title,
        category: metadata.category,
        age_range: metadata.ageRange,
        keywords: metadata.keywords,
        source_file: filename,
        last_updated: new Date().toISOString()
    };
}

/**
 * Lee todos los archivos RAG de la carpeta rag-data
 */
function readRAGFiles() {
    const ragDataPath = path.join(__dirname, '..', '..', 'rag-data');
    
    if (!fs.existsSync(ragDataPath)) {
        console.error(`❌ Error: La carpeta rag-data no existe en: ${ragDataPath}`);
        process.exit(1);
    }
    
    const files = fs.readdirSync(ragDataPath).filter(file => file.endsWith('.md'));
    
    if (files.length === 0) {
        console.error('❌ Error: No se encontraron archivos .md en la carpeta rag-data');
        process.exit(1);
    }
    
    console.log(`📁 Encontrados ${files.length} archivos RAG:`);
    files.forEach(file => console.log(`   • ${file}`));
    
    const documents = [];
    
    for (const file of files) {
        const filePath = path.join(ragDataPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const document = processFile(filePath, content);
        documents.push(document);
        
        console.log(`   ✅ ${file} → ${document.category} (${document.age_range}) [${document.keywords.length} keywords]`);
    }
    
    return documents;
}

/**
 * Sube documentos a Azure Search
 */
async function uploadDocuments(documents) {
    try {
        console.log(`\n📤 Subiendo ${documents.length} documentos a Azure Search...`);
        console.log(`🎯 Índice: ${AZURE_SEARCH_INDEX_NAME}`);
        
        const result = await searchClient.uploadDocuments(documents);
        
        console.log('\n✅ ¡DOCUMENTOS SUBIDOS EXITOSAMENTE!');
        console.log(`📊 Resultados:`);
        console.log(`   • Documentos procesados: ${result.results.length}`);
        
        result.results.forEach((docResult, index) => {
            const status = docResult.succeeded ? '✅' : '❌';
            const doc = documents[index];
            console.log(`   ${status} ${doc.id} (${doc.category})`);
            
            if (!docResult.succeeded) {
                console.log(`      Error: ${docResult.errorMessage}`);
            }
        });
        
        const successful = result.results.filter(r => r.succeeded).length;
        const failed = result.results.filter(r => !r.succeeded).length;
        
        console.log(`\n📈 Resumen:`);
        console.log(`   • Exitosos: ${successful}`);
        console.log(`   • Fallidos: ${failed}`);
        
        if (successful > 0) {
            console.log('\n🎉 El índice está listo para usar con ToyBot!');
            console.log('\n🧪 Próximos pasos:');
            console.log('   1. Ejecutar: npm run test-search');
            console.log('   2. Probar búsquedas específicas');
            console.log('   3. Integrar con el chatbot');
        }
        
    } catch (error) {
        console.error('❌ Error subiendo documentos:', error.message);
        
        if (error.statusCode === 404) {
            console.log('\n💡 El índice no existe:');
            console.log('   • Ejecuta primero: npm run create-index');
        } else if (error.statusCode === 403) {
            console.log('\n💡 Problema de permisos:');
            console.log('   • Verifica la API key de Azure Search');
        }
        
        throw error;
    }
}

/**
 * Función principal
 */
async function main() {
    try {
        console.log('🚀 SUBIDA DE ARCHIVOS RAG OPTIMIZADA\n');
        
        // Leer archivos RAG
        const documents = readRAGFiles();
        
        // Mostrar preview de documentos
        console.log('\n📋 Preview de documentos:');
        documents.forEach(doc => {
            console.log(`\n📄 ${doc.title}`);
            console.log(`   ID: ${doc.id}`);
            console.log(`   Categoría: ${doc.category}`);
            console.log(`   Edad: ${doc.age_range}`);
            console.log(`   Keywords: ${doc.keywords.join(', ')}`);
            console.log(`   Contenido: ${doc.content.substring(0, 100)}...`);
        });
        
        // Subir documentos
        await uploadDocuments(documents);
        
    } catch (error) {
        console.error('\n❌ Error general:', error.message);
        process.exit(1);
    }
}

// Ejecutar
if (require.main === module) {
    main();
}

module.exports = { processFile, extractMetadata, generateTitle, main };
