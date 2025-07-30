#!/bin/bash

# Script para ejecutar todas las pruebas de la estructura de testing
# Este script maneja la ejecución de pruebas unitarias, de integración y E2E

set -e  # Salir en caso de error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con colores
print_message() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [OPCIONES]"
    echo ""
    echo "Opciones:"
    echo "  -h, --help              Mostrar esta ayuda"
    echo "  -u, --unit              Ejecutar solo pruebas unitarias"
    echo "  -i, --integration       Ejecutar solo pruebas de integración"
    echo "  -e, --e2e               Ejecutar solo pruebas E2E"
    echo "  -c, --coverage          Ejecutar con reporte de cobertura"
    echo "  -w, --watch             Ejecutar en modo watch"
    echo "  -v, --verbose           Ejecutar con output verboso"
    echo "  -ci, --ci               Ejecutar en modo CI/CD"
    echo "  --clean                 Limpiar archivos generados"
    echo "  --setup                 Configurar entorno de pruebas"
    echo ""
    echo "Ejemplos:"
    echo "  $0                      Ejecutar todas las pruebas"
    echo "  $0 -u                   Ejecutar solo pruebas unitarias"
    echo "  $0 -c -v                Ejecutar con cobertura y output verboso"
    echo "  $0 --ci                 Ejecutar en modo CI/CD"
}

# Variables por defecto
RUN_UNIT=false
RUN_INTEGRATION=false
RUN_E2E=false
WITH_COVERAGE=false
WATCH_MODE=false
VERBOSE=false
CI_MODE=false
CLEAN_MODE=false
SETUP_MODE=false

# Parsear argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -u|--unit)
            RUN_UNIT=true
            shift
            ;;
        -i|--integration)
            RUN_INTEGRATION=true
            shift
            ;;
        -e|--e2e)
            RUN_E2E=true
            shift
            ;;
        -c|--coverage)
            WITH_COVERAGE=true
            shift
            ;;
        -w|--watch)
            WATCH_MODE=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -ci|--ci)
            CI_MODE=true
            shift
            ;;
        --clean)
            CLEAN_MODE=true
            shift
            ;;
        --setup)
            SETUP_MODE=true
            shift
            ;;
        *)
            print_error "Opción desconocida: $1"
            show_help
            exit 1
            ;;
    esac
done

# Si no se especificó ningún tipo de prueba, ejecutar todas
if [[ "$RUN_UNIT" == false && "$RUN_INTEGRATION" == false && "$RUN_E2E" == false ]]; then
    RUN_UNIT=true
    RUN_INTEGRATION=true
    RUN_E2E=true
fi

# Función para verificar dependencias
check_dependencies() {
    print_message "Verificando dependencias..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js no está instalado"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm no está instalado"
        exit 1
    fi
    
    print_success "Dependencias verificadas"
}

# Función para limpiar archivos generados
clean_generated_files() {
    print_message "Limpiando archivos generados..."
    
    # Limpiar reportes de cobertura
    if [ -d "reports" ]; then
        rm -rf reports
        print_message "Reportes eliminados"
    fi
    
    # Limpiar base de datos de pruebas
    if [ -f "test-database.sqlite" ]; then
        rm test-database.sqlite
        print_message "Base de datos de pruebas eliminada"
    fi
    
    # Limpiar logs
    if [ -f "test.log" ]; then
        rm test.log
        print_message "Logs eliminados"
    fi
    
    print_success "Limpieza completada"
}

# Función para configurar entorno
setup_environment() {
    print_message "Configurando entorno de pruebas..."
    
    # Verificar si estamos en el directorio correcto
    if [ ! -f "package.json" ]; then
        print_error "No se encontró package.json. Asegúrate de estar en el directorio testing/"
        exit 1
    fi
    
    # Instalar dependencias si no están instaladas
    if [ ! -d "node_modules" ]; then
        print_message "Instalando dependencias..."
        npm install
    fi
    
    # Crear archivo .env si no existe
    if [ ! -f ".env" ]; then
        print_message "Creando archivo .env..."
        cat > .env << EOF
# Configuración del servidor
TEST_SERVER_PORT=3001
TEST_SERVER_HOST=localhost

# Configuración de base de datos
TEST_DB_PATH=./test-database.sqlite

# Configuración de JWT
TEST_JWT_SECRET=test-secret-key

# Configuración de OpenAI (para mocks)
OPENAI_API_KEY=test-key

# Configuración de frontend
FRONTEND_URL=http://localhost:5173
EOF
        print_message "Archivo .env creado"
    fi
    
    print_success "Entorno configurado"
}

# Función para ejecutar pruebas unitarias
run_unit_tests() {
    print_message "Ejecutando pruebas unitarias..."
    
    local cmd="npm run test:unit"
    
    if [ "$VERBOSE" == true ]; then
        cmd="$cmd -- --verbose"
    fi
    
    if [ "$WITH_COVERAGE" == true ]; then
        cmd="npm run test:coverage -- --testPathPattern=unit"
    fi
    
    if [ "$CI_MODE" == true ]; then
        cmd="npm run test:ci -- --testPathPattern=unit"
    fi
    
    eval $cmd
    
    if [ $? -eq 0 ]; then
        print_success "Pruebas unitarias completadas"
    else
        print_error "Pruebas unitarias fallaron"
        exit 1
    fi
}

# Función para ejecutar pruebas de integración
run_integration_tests() {
    print_message "Ejecutando pruebas de integración..."
    
    local cmd="npm run test:integration"
    
    if [ "$VERBOSE" == true ]; then
        cmd="$cmd -- --verbose"
    fi
    
    if [ "$WITH_COVERAGE" == true ]; then
        cmd="npm run test:coverage -- --testPathPattern=integration"
    fi
    
    if [ "$CI_MODE" == true ]; then
        cmd="npm run test:ci -- --testPathPattern=integration"
    fi
    
    eval $cmd
    
    if [ $? -eq 0 ]; then
        print_success "Pruebas de integración completadas"
    else
        print_error "Pruebas de integración fallaron"
        exit 1
    fi
}

# Función para ejecutar pruebas E2E
run_e2e_tests() {
    print_message "Ejecutando pruebas E2E..."
    
    # Verificar si Playwright está instalado
    if ! command -v npx playwright &> /dev/null; then
        print_warning "Playwright no está instalado. Instalando..."
        npx playwright install
    fi
    
    local cmd="npm run test:e2e"
    
    if [ "$VERBOSE" == true ]; then
        cmd="$cmd -- --verbose"
    fi
    
    if [ "$CI_MODE" == true ]; then
        cmd="$cmd -- --reporter=dot"
    fi
    
    eval $cmd
    
    if [ $? -eq 0 ]; then
        print_success "Pruebas E2E completadas"
    else
        print_error "Pruebas E2E fallaron"
        exit 1
    fi
}

# Función para ejecutar todas las pruebas
run_all_tests() {
    print_message "Ejecutando todas las pruebas..."
    
    local cmd="npm test"
    
    if [ "$WATCH_MODE" == true ]; then
        cmd="npm run test:watch"
    elif [ "$WITH_COVERAGE" == true ]; then
        cmd="npm run test:coverage"
    elif [ "$CI_MODE" == true ]; then
        cmd="npm run test:ci"
    fi
    
    if [ "$VERBOSE" == true ]; then
        cmd="$cmd -- --verbose"
    fi
    
    eval $cmd
    
    if [ $? -eq 0 ]; then
        print_success "Todas las pruebas completadas"
    else
        print_error "Algunas pruebas fallaron"
        exit 1
    fi
}

# Función para mostrar reportes
show_reports() {
    if [ "$WITH_COVERAGE" == true ] && [ -d "reports/coverage" ]; then
        print_message "Reportes de cobertura disponibles en:"
        echo "  - HTML: reports/coverage/index.html"
        echo "  - JSON: reports/coverage/coverage.json"
        echo "  - LCOV: reports/coverage/lcov.info"
        
        # Intentar abrir reporte HTML
        if command -v xdg-open &> /dev/null; then
            xdg-open reports/coverage/index.html 2>/dev/null || true
        elif command -v open &> /dev/null; then
            open reports/coverage/index.html 2>/dev/null || true
        elif command -v start &> /dev/null; then
            start reports/coverage/index.html 2>/dev/null || true
        fi
    fi
}

# Función principal
main() {
    print_message "Iniciando ejecución de pruebas..."
    
    # Verificar dependencias
    check_dependencies
    
    # Configurar entorno si es necesario
    if [ "$SETUP_MODE" == true ]; then
        setup_environment
        exit 0
    fi
    
    # Limpiar si es necesario
    if [ "$CLEAN_MODE" == true ]; then
        clean_generated_files
        exit 0
    fi
    
    # Configurar entorno automáticamente
    setup_environment
    
    # Ejecutar pruebas según las opciones
    if [ "$RUN_UNIT" == true ] && [ "$RUN_INTEGRATION" == true ] && [ "$RUN_E2E" == true ]; then
        run_all_tests
    else
        if [ "$RUN_UNIT" == true ]; then
            run_unit_tests
        fi
        
        if [ "$RUN_INTEGRATION" == true ]; then
            run_integration_tests
        fi
        
        if [ "$RUN_E2E" == true ]; then
            run_e2e_tests
        fi
    fi
    
    # Mostrar reportes
    show_reports
    
    print_success "Ejecución de pruebas completada"
}

# Ejecutar función principal
main "$@" 