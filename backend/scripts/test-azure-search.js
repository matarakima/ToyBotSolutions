#!/usr/bin/env node

/**
 * Script para probar búsquedas en Azure AI Search
 * Útil para verificar que los datos RAG están funcionando correctamente
 */

const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');
const path = require('path');

// Configurar dotenv para que busque el .env en la carpeta backend
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AZURE_SEARCH_ENDPOINT = process.env.AZURE_SEARCH_ENDPOINT;
const AZURE_SEARCH_KEY = process.env.AZURE_SEARCH_KEY;
const AZURE_SEARCH_INDEX_NAME = process.env.AZURE_SEARCH_INDEX_NAME || 'toybot-knowledge-base';

if (!AZURE_SEARCH_ENDPOINT || !AZURE_SEARCH_KEY) {
    console.error('❌ Error: Faltan variables de entorno de Azure Search');
    process.exit(1);
}

const credential = new AzureKeyCredential(AZURE_SEARCH_KEY);
const searchClient = new SearchClient(AZURE_SEARCH_ENDPOINT, AZURE_SEARCH_INDEX_NAME, credential);

// Consultas de prueba predefinidas - simplificadas para cualquier índice
const testQueries = [
    {
        name: "Búsqueda general",
        query: "*",
        filters: null
    },
    {
        name: "Búsqueda amplia de información",
        query: "información datos",
        filters: null
    },
    {
        name: "Información de productos y juguetes",
        query: "productos juguetes lego",
        filters: null
    },
    {
        name: "Información de pedidos y órdenes",
        query: "pedido orden tracking",
        filters: null
    },
    {
        name: "Políticas y ayuda al cliente",
        query: "política ayuda devolución soporte",
        filters: null
    },
    {
        name: "Seguridad y certificaciones",
        query: "seguridad certificación edad",
        filters: null
    },
    {
        name: "Marcas y proveedores",
        query: "marcas lego mattel hasbro",
        filters: null
    },
    {
        name: "Promociones y ofertas",
        query: "promociones ofertas descuentos",
        filters: null
    }
];

/**
 * Ejecuta una búsqueda y muestra los resultados
 */
async function executeSearch(testCase) {
    try {
        console.log(`\n🔍 Prueba: ${testCase.name}`);
        console.log(`📝 Query: "${testCase.query}"`);
        if (testCase.filters) {
            console.log(`🎯 Filtros: ${testCase.filters}`);
        }
        
        const searchOptions = {
            includeTotalCount: true,
            top: 3
            // Removido select, highlightFields para compatibilidad
        };
        
        // Solo agregar filtros si no tienen campos específicos como 'category'
        if (testCase.filters && !testCase.filters.includes('category')) {
            searchOptions.filter = testCase.filters;
        }
        
        const results = await searchClient.search(testCase.query, searchOptions);
        
        console.log(`📊 Resultados encontrados: ${results.count}`);
        
        let resultCount = 0;
        for await (const result of results.results) {
            resultCount++;
            console.log(`\n  ${resultCount}. Score: ${result.score?.toFixed(3)}`);
            
            // Mostrar los primeros campos del documento
            const doc = result.document;
            const fields = Object.keys(doc);
            
            fields.slice(0, 3).forEach(field => {
                const value = doc[field];
                if (typeof value === 'string' && value.length > 100) {
                    console.log(`     ${field}: ${value.substring(0, 100)}...`);
                } else if (Array.isArray(value)) {
                    console.log(`     ${field}: [${value.length} elementos]`);
                } else {
                    console.log(`     ${field}: ${value}`);
                }
            });
        }
        
        if (resultCount === 0) {
            console.log('   ❌ No se encontraron resultados');
        }
        
    } catch (error) {
        console.error(`❌ Error en búsqueda "${testCase.name}":`, error.message);
    }
}

/**
 * Muestra estadísticas generales del índice
 */
async function showIndexStats() {
    try {
        console.log('📊 ESTADÍSTICAS DEL ÍNDICE\n');
        
        // Total de documentos
        const totalResults = await searchClient.search('*', {
            includeTotalCount: true,
            top: 0
        });
        console.log(`📄 Total de documentos: ${totalResults.count}`);
        
        // Intentar obtener facets solo si existen los campos
        try {
            const categoryResults = await searchClient.search('*', {
                facets: ['category'],
                top: 0
            });
            
            if (categoryResults.facets && categoryResults.facets.category) {
                console.log('\n📋 Documentos por categoría:');
                categoryResults.facets.category.forEach(facet => {
                    console.log(`   ${facet.value}: ${facet.count} documentos`);
                });
            }
        } catch (error) {
            console.log('\n⚠️  Campo "category" no disponible en este índice');
        }
        
        try {
            const subcategoryResults = await searchClient.search('*', {
                facets: ['subcategory'],
                top: 0
            });
            
            if (subcategoryResults.facets && subcategoryResults.facets.subcategory) {
                console.log('\n📂 Documentos por subcategoría:');
                subcategoryResults.facets.subcategory.forEach(facet => {
                    console.log(`   ${facet.value}: ${facet.count} documentos`);
                });
            }
        } catch (error) {
            console.log('⚠️  Campo "subcategory" no disponible en este índice');
        }
        
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error.message);
    }
}

/**
 * Función principal
 */
async function main() {
    console.log('🧪 PRUEBAS DE BÚSQUEDA EN AZURE AI SEARCH');
    console.log(`🎯 Índice: ${AZURE_SEARCH_INDEX_NAME}`);
    console.log(`🌐 Endpoint: ${AZURE_SEARCH_ENDPOINT}`);
    
    await showIndexStats();
    
    console.log('\n' + '='.repeat(60));
    console.log('🔍 EJECUTANDO CONSULTAS DE PRUEBA');
    console.log('='.repeat(60));
    
    for (const testCase of testQueries) {
        await executeSearch(testCase);
        
        // Pausa pequeña entre consultas
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ PRUEBAS COMPLETADAS');
    console.log('='.repeat(60));
    console.log('\n💡 Consejos para mejorar los resultados:');
    console.log('   • Usa términos específicos en las consultas');
    console.log('   • Combina filtros por categoría para resultados más precisos');
    console.log('   • Los highlights muestran dónde se encontraron las coincidencias');
    console.log('   • Un score más alto indica mayor relevancia');
}

/**
 * Búsqueda interactiva
 */
async function interactiveSearch() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    console.log('\n🤖 MODO BÚSQUEDA INTERACTIVA');
    console.log('Escribe tu consulta (o "exit" para salir):\n');
    
    const askQuestion = () => {
        rl.question('🔍 Tu consulta: ', async (query) => {
            if (query.toLowerCase() === 'exit') {
                rl.close();
                return;
            }
            
            if (query.trim()) {
                try {
                    const results = await searchClient.search(query, {
                        includeTotalCount: true,
                        top: 5
                        // Removido select y highlightFields para compatibilidad
                    });
                    
                    console.log(`\n📊 Encontrados: ${results.count} resultados\n`);
                    
                    let count = 0;
                    for await (const result of results.results) {
                        count++;
                        console.log(`${count}. Score: ${result.score?.toFixed(3)}`);
                        
                        // Mostrar los primeros campos disponibles
                        const doc = result.document;
                        const fields = Object.keys(doc);
                        
                        fields.slice(0, 2).forEach(field => {
                            const value = doc[field];
                            if (typeof value === 'string' && value.length > 50) {
                                console.log(`   ${field}: ${value.substring(0, 50)}...`);
                            } else {
                                console.log(`   ${field}: ${value}`);
                            }
                        });
                        console.log('');
                    }
                    
                } catch (error) {
                    console.error('❌ Error en la búsqueda:', error.message);
                }
            }
            
            console.log('');
            askQuestion();
        });
    };
    
    askQuestion();
}

// Manejo de argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.includes('--interactive') || args.includes('-i')) {
    // Modo interactivo
    main().then(() => interactiveSearch());
} else {
    // Modo de pruebas predefinidas
    main();
}

module.exports = { executeSearch, showIndexStats, main };
