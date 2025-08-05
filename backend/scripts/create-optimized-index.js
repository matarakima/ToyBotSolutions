#!/usr/bin/env node
/**
 * Script para crear un índice optimizado de Azure AI Search para ToyBot
 * Versión simplificada sin vector search para evitar errores de configuración
 */
const { SearchIndexClient, AzureKeyCredential } = require('@azure/search-documents');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AZURE_SEARCH_ENDPOINT = process.env.AZURE_SEARCH_ENDPOINT;
const AZURE_SEARCH_KEY = process.env.AZURE_SEARCH_KEY;
const INDEX_NAME = 'toybot-knowledge-base';

if (!AZURE_SEARCH_ENDPOINT || !AZURE_SEARCH_KEY) {
    console.error('❌ Error: Faltan variables de entorno de Azure Search');
    process.exit(1);
}

const credential = new AzureKeyCredential(AZURE_SEARCH_KEY);
const indexClient = new SearchIndexClient(AZURE_SEARCH_ENDPOINT, credential);

/**
 * Definición del índice optimizado para ToyBot
 */
const indexDefinition = {
    name: INDEX_NAME,
    fields: [
        {
            name: "id",
            type: "Edm.String",
            key: true,
            searchable: false,
            filterable: false,
            sortable: false,
            facetable: false
        },
        {
            name: "content",
            type: "Edm.String",
            searchable: true,
            filterable: false,
            sortable: false,
            facetable: false,
            analyzer: "es.microsoft"
        },
        {
            name: "title",
            type: "Edm.String",
            searchable: true,
            filterable: true,
            sortable: true,
            facetable: false,
            analyzer: "es.microsoft"
        },
        {
            name: "category",
            type: "Edm.String",
            searchable: true,
            filterable: true,
            sortable: false,
            facetable: true
        },
        {
            name: "age_range",
            type: "Edm.String",
            searchable: true,
            filterable: true,
            sortable: false,
            facetable: true
        },
        {
            name: "keywords",
            type: "Collection(Edm.String)",
            searchable: true,
            filterable: true,
            sortable: false,
            facetable: true
        },
        {
            name: "source_file",
            type: "Edm.String",
            searchable: false,
            filterable: true,
            sortable: false,
            facetable: false
        },
        {
            name: "last_updated",
            type: "Edm.DateTimeOffset",
            searchable: false,
            filterable: true,
            sortable: true,
            facetable: false
        }
    ],
    corsOptions: {
        allowedOrigins: ["*"],
        maxAgeInSeconds: 300
    }
};

/**
 * Crear el índice
 */
async function createIndex() {
    try {
        console.log('🚀 CREANDO ÍNDICE OPTIMIZADO PARA TOYBOT\n');
        console.log(`📋 Nombre del índice: ${INDEX_NAME}`);
        console.log(`🌐 Endpoint: ${AZURE_SEARCH_ENDPOINT}\n`);

        // Verificar si el índice ya existe
        console.log('🔍 Verificando si el índice ya existe...');
        try {
            await indexClient.getIndex(INDEX_NAME);
            console.log('⚠️  El índice ya existe. ¿Quieres eliminarlo y crear uno nuevo?');
            console.log('💡 Para eliminarlo manualmente, ve al Azure Portal o usa:');
            console.log(`   curl -X DELETE "${AZURE_SEARCH_ENDPOINT}/indexes/${INDEX_NAME}?api-version=2023-11-01" -H "api-key: ${AZURE_SEARCH_KEY}"`);
            return;
        } catch (error) {
            if (error.statusCode === 404) {
                console.log('✅ El índice no existe, procediendo a crear uno nuevo');
            } else {
                throw error;
            }
        }

        // Crear el índice
        console.log('🔨 Creando nuevo índice optimizado...');
        const result = await indexClient.createIndex(indexDefinition);
        
        console.log('\n✅ ¡ÍNDICE CREADO EXITOSAMENTE!\n');
        console.log('📊 Detalles del índice:');
        console.log(`   • Nombre: ${result.name}`);
        console.log(`   • Campos: ${result.fields.length}`);
        console.log('   • Funcionalidades:');
        console.log('     - Búsqueda en español (analyzer: es.microsoft)');
        console.log('     - Filtros por categoría y edad');
        console.log('     - Facets para navegación');
        console.log('     - Búsqueda por palabras clave');

        console.log('\n🎯 Próximos pasos:');
        console.log('   1. Cambiar AZURE_SEARCH_INDEX_NAME en .env a "toybot-knowledge-base"');
        console.log('   2. Ejecutar: npm run upload-rag');
        console.log('   3. Probar: npm run test-search');

    } catch (error) {
        console.error('❌ Error creando el índice:', error.message);
        
        if (error.statusCode === 403) {
            console.log('\n💡 Problema de permisos:');
            console.log('   • Verifica que la API key tenga permisos de administrador');
            console.log('   • Usa la Primary Admin Key de Azure Search');
        } else if (error.statusCode === 409) {
            console.log('\n💡 El índice ya existe:');
            console.log('   • Elimínalo primero desde Azure Portal');
            console.log('   • O usa un nombre diferente');
        } else {
            console.log('\n💡 Error de configuración:');
            console.log('   • Revisa la definición del índice');
            console.log('   • Algunos campos pueden tener configuraciones incompatibles');
        }
    }
}

// Ejecutar
if (require.main === module) {
    createIndex().then(() => {
        console.log('\n🎉 Script completado');
        process.exit(0);
    }).catch(error => {
        console.error('\n❌ Error general:', error.message);
        process.exit(1);
    });
}

module.exports = { createIndex, indexDefinition };