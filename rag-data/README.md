# README - Datos RAG para ToyBot Store

## Descripción del Dataset

Este conjunto de datos contiene información ficticia pero realista para alimentar el sistema RAG (Retrieval-Augmented Generation) del chatbot ToyBot Store. Los datos están diseñados para simular un ecommerce real de juguetes que puede atender a niños y padres.

## Estructura de Archivos

### 📦 `products-catalog.md`
**Propósito:** Catálogo completo de productos disponibles
**Contenido:**
- 21 productos detallados organizados por categorías
- Información completa: códigos, precios, edades, descripción, stock
- Categorías: Educativos, Muñecas, Vehículos, Juegos, Peluches, Arte, Deportes
- Marcas representadas: LEGO, Mattel, Hasbro, LeapFrog, Pokémon, etc.

**Casos de uso para chatbot:**
- "¿Qué juguetes tienen para niños de 5 años?"
- "¿Cuánto cuesta el set de LEGO?"
- "¿Tienen juguetes de Pokémon?"
- "¿Qué hay en stock de figuras de acción?"

### ❓ `faqs.md`
**Propósito:** Preguntas frecuentes completas sobre la tienda
**Contenido:**
- Información sobre pedidos, pagos, envíos
- Políticas de devoluciones y reembolsos
- Seguridad y edades recomendadas
- Servicios de tienda física y membresías
- Ocasiones especiales y eventos

**Casos de uso para chatbot:**
- "¿Cómo puedo hacer un pedido?"
- "¿Cuánto tarda en llegar mi compra?"
- "¿Puedo devolver un juguete?"
- "¿Dónde tienen tiendas físicas?"

### 📋 `company-policies.md`
**Propósito:** Políticas oficiales de la empresa
**Contenido:**
- Política de privacidad (especial atención a niños)
- Política de seguridad del producto
- Política de precios y promociones
- Servicio al cliente y responsabilidad social
- Términos de uso del sitio web

**Casos de uso para chatbot:**
- "¿Es seguro comprar aquí?"
- "¿Cómo protegen la información de mi hijo?"
- "¿Igualan precios de otras tiendas?"
- "¿Qué pasa si hay un recall de producto?"

### 🏷️ `brands-suppliers.md`
**Propósito:** Información detallada sobre marcas y proveedores
**Contenido:**
- Marcas premium: LEGO, Mattel, Hasbro
- Marcas especializadas: LeapFrog, Crayola, Pokémon
- Marcas emergentes: TechToys, SlimeLab, TeddyLove
- Información de calidad, garantías y certificaciones
- Programas de lealtad por marca

**Casos de uso para chatbot:**
- "¿Qué marcas venden?"
- "¿Los productos LEGO son originales?"
- "¿Tienen garantía los juguetes Mattel?"
- "¿Qué es el programa VIP de LEGO?"

### 📊 `order-status.md`
**Propósito:** Información detallada sobre estados de pedidos
**Contenido:**
- 12 estados diferentes de pedidos con explicaciones
- Tiempos típicos para cada estado
- Mensajes especiales adaptados para niños
- Estados especiales: envíos parciales, demoras, excepciones
- Notificaciones automáticas

**Casos de uso para chatbot:**
- "¿Dónde está mi pedido?"
- "¿Qué significa 'IN_TRANSIT'?"
- "¿Por qué mi pedido está demorado?"
- "¿Cuándo llegará mi juguete?"

### 🛡️ `age-safety-guide.md`
**Propósito:** Guía completa de seguridad y edades apropiadas
**Contenido:**
- Clasificación por grupos de edad (0-12+ años)
- Desarrollo infantil por etapa
- Estándares de seguridad por material
- Certificaciones obligatorias y opcionales
- Protocolo de recalls y educación para padres

**Casos de uso para chatbot:**
- "¿Es seguro este juguete para mi hija de 3 años?"
- "¿Qué juguetes son apropiados para bebés?"
- "¿Este juguete tiene certificación de seguridad?"
- "¿Cómo sé si un juguete es apropiado para la edad?"

### 🎉 `promotions-offers.md`
**Propósito:** Promociones actuales y programas de lealtad
**Contenido:**
- Promociones actuales con fechas específicas
- Ofertas por categoría y edad
- Programas de membresía (Plus, VIP, Family)
- Ofertas estacionales y programas especiales
- Términos y condiciones

**Casos de uso para chatbot:**
- "¿Qué ofertas tienen ahora?"
- "¿Hay descuentos en juguetes educativos?"
- "¿Qué es ToyBot Plus?"
- "¿Tienen ofertas de regreso a clases?"

### 📋 `sample-orders.md`
**Propósito:** Datos de órdenes de ejemplo para testing
**Contenido:**
- 8 órdenes ficticias con diferentes estados
- Información completa: cliente, productos, fechas, tracking
- Casos problemáticos: demoras, direcciones incorrectas, envíos parciales
- Estadísticas de ejemplo para análisis
- Casos de uso específicos para chatbot

**Casos de uso para chatbot:**
- Testing de consultas de estado de pedidos
- Ejemplos de problemas comunes y soluciones
- Datos para entrenar respuestas sobre tracking
- Simulación de consultas reales de clientes

## Características del Dataset

### 🎯 **Enfoque en Niños**
- Lenguaje adaptado para diferentes edades
- Consideraciones especiales de seguridad
- Productos organizados por desarrollo infantil
- Mensajes divertidos y amigables para niños

### 🛡️ **Seguridad Prioritaria**
- Información detallada de certificaciones
- Guías de edad específicas
- Protocolos de recalls
- Políticas de privacidad infantil

### 📱 **Experiencia Omnicanal**
- Información de tiendas físicas
- Servicios online y offline
- Apps móviles y redes sociales
- Programas de lealtad integrados

### 🤖 **Optimizado para Chatbot**
- Respuestas preparadas para consultas comunes
- Información estructurada para búsqueda semántica
- Casos de ejemplo con respuestas esperadas
- Lenguaje natural y conversacional

## Uso del Dataset

### Para Desarrollo:
1. **Índice en Azure Search:** Cada archivo puede ser un documento separado
2. **Chunking:** Dividir archivos grandes por secciones para mejor retrieval
3. **Metadata:** Añadir tags por categoría, edad, tipo de consulta
4. **Testing:** Usar sample-orders.md para probar consultas específicas

### Para Training:
1. **Q&A Generation:** Crear pares pregunta-respuesta basados en el contenido
2. **Intent Classification:** Categorizar tipos de consultas (producto, pedido, política, etc.)
3. **Entity Recognition:** Identificar productos, edades, marcas, códigos de pedido
4. **Response Templates:** Plantillas para diferentes tipos de respuestas

### Para Testing:
1. **Smoke Tests:** Usar las consultas de ejemplo incluidas
2. **Edge Cases:** Probar con los casos problemáticos de sample-orders
3. **Age Appropriateness:** Verificar respuestas apropiadas por edad
4. **Safety Validation:** Confirmar información de seguridad correcta

## Consideraciones Técnicas

### Vector Search Optimization:
- **Chunks de 500-1000 palabras** para mejor retrieval
- **Overlap de 100 palabras** entre chunks
- **Metadata rica** para filtrado (categoría, edad, marca)
- **Keywords importantes** en títulos y primeras líneas

### Contexto para LLM:
- **Información de cliente** (edad del niño, historial de compras)
- **Contexto de conversación** (consulta anterior, intención)
- **Personalización** (nivel de lenguaje apropiado)
- **Safety guardrails** (no información inapropiada para niños)

## Extensiones Futuras

### Datos Adicionales Recomendados:
- **Reviews de productos** con comentarios de padres y niños
- **Guías de regalos** por ocasión y edad
- **Información estacional** (juguetes de temporada)
- **Tutoriales y videos** de productos complejos
- **Información de inventario** en tiempo real
- **Precios dinámicos** y comparación de competidores

### Integraciones:
- **Sistema de inventario** para stock real
- **Sistema de órdenes** para status actualizados
- **CRM** para historial de cliente
- **Sistema de recomendaciones** basado en IA

---

**Nota:** Todos los datos en este dataset son ficticios y creados específicamente para el desarrollo del chatbot ToyBot. No representan una empresa real ni productos reales en el mercado.
