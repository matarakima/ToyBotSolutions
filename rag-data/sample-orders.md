# Datos de Ejemplo - Órdenes de Clientes ToyBot Store

## Órdenes de Muestra para Testing

### Orden #TB-2025-001234
**Cliente:** Sofia Martinez (8 años)
**Fecha del pedido:** 15 Enero 2025, 2:34 PM
**Estado actual:** DELIVERED
**Total:** $127.97

**Productos ordenados:**
1. LEGO Classic Set Creativo Grande (TOY-LEGO-001) - $89.99
2. Crayola Set de Arte Completo (TOY-CRAY-016) - $24.99
3. Puzzle 1000 Piezas Mundo Submarino (TOY-PUZZ-011) - $14.99

**Información de envío:**
- Método: Envío estándar (GRATIS por pedido >$50)
- Dirección: 1245 Oak Street, Orlando, FL 32801
- Enviado: 16 Enero 2025, 10:45 AM
- Transportista: UPS
- Número de rastreo: 1Z9F84290394567123
- Entregado: 19 Enero 2025, 3:22 PM
- Recibido por: Maria Martinez (madre)

**Timeline del pedido:**
- 15 Ene, 2:34 PM: ORDER_PLACED
- 15 Ene, 2:45 PM: PAYMENT_CONFIRMED  
- 15 Ene, 4:20 PM: INVENTORY_CHECK
- 16 Ene, 8:30 AM: PREPARING_ORDER
- 16 Ene, 10:15 AM: QUALITY_CHECK
- 16 Ene, 10:45 AM: SHIPPED
- 19 Ene, 3:22 PM: DELIVERED

### Orden #TB-2025-001235
**Cliente:** Miguel Rodriguez (6 años)
**Fecha del pedido:** 18 Enero 2025, 11:15 AM
**Estado actual:** IN_TRANSIT
**Total:** $54.98

**Productos ordenados:**
1. Hot Wheels Mega Garage (TOY-HOT-007) - $79.99 *(Descuento aplicado: -$25.01)*
2. UNO Flip (TOY-UNO-012) - $9.99

**Información de envío:**
- Método: Envío rápido ($9.99)
- Dirección: 789 Pine Avenue, Houston, TX 77002
- Enviado: 19 Enero 2025, 2:15 PM
- Transportista: FedEx
- Número de rastreo: 7749183567284
- Estado actual: En camino a Houston, TX
- Entrega estimada: 21 Enero 2025

**Timeline del pedido:**
- 18 Ene, 11:15 AM: ORDER_PLACED
- 18 Ene, 11:25 AM: PAYMENT_CONFIRMED
- 18 Ene, 1:30 PM: INVENTORY_CHECK
- 19 Ene, 9:00 AM: PREPARING_ORDER
- 19 Ene, 1:45 PM: QUALITY_CHECK
- 19 Ene, 2:15 PM: SHIPPED
- Estado actual: IN_TRANSIT

### Orden #TB-2025-001236
**Cliente:** Emma Thompson (4 años)
**Fecha del pedido:** 20 Enero 2025, 4:45 PM
**Estado actual:** PREPARING_ORDER
**Total:** $74.97

**Productos ordenados:**
1. Barbie Doctora (TOY-BARB-004) - $19.99
2. Baby Alive Bebé que Come (TOY-BABY-006) - $49.99
3. Plastilina Play-Doh Set Heladería (TOY-PLAY-018) - $14.99

**Información de envío:**
- Método: Envío estándar (GRATIS)
- Dirección: 456 Maple Drive, Denver, CO 80202
- Estado: Empacando productos en almacén
- Envío estimado: 21 Enero 2025
- Entrega estimada: 24-26 Enero 2025

**Timeline del pedido:**
- 20 Ene, 4:45 PM: ORDER_PLACED
- 20 Ene, 4:52 PM: PAYMENT_CONFIRMED
- 20 Ene, 6:15 PM: INVENTORY_CHECK
- 21 Ene, 8:00 AM: PREPARING_ORDER (estado actual)

### Orden #TB-2025-001237
**Cliente:** Alex Chen (10 años)
**Fecha del pedido:** 21 Enero 2025, 9:30 AM
**Estado actual:** PARTIALLY_SHIPPED
**Total:** $219.96

**Productos ordenados:**
1. Drone para Niños con Cámara (TOY-DRON-008) - $89.99 *(ENVIADO)*
2. LeapPad Academy Tablet (TOY-LEAP-003) - $159.99 *(EN ESPERA)*
3. Set de Superhéroes Marvel (TOY-MARV-005) - $34.99 *(ENVIADO)*

**Información de envío:**
- **Envío 1 (Completado):**
  - Productos: Drone + Set Marvel
  - Enviado: 21 Enero 2025, 6:30 PM
  - Transportista: UPS
  - Rastreo: 1Z9F84290394567124
  - Entregado: 23 Enero 2025, 2:15 PM

- **Envío 2 (Pendiente):**
  - Producto: LeapPad Academy (temporalmente agotado)
  - Fecha estimada de restock: 28 Enero 2025
  - Envío estimado: 29 Enero 2025

**Dirección:** 321 Cedar Lane, Seattle, WA 98101

### Orden #TB-2025-001238
**Cliente:** Isabella Garcia (5 años)
**Fecha del pedido:** 22 Enero 2025, 7:20 PM
**Estado actual:** DELAYED
**Total:** $44.98

**Productos ordenados:**
1. Monopoly Junior (TOY-MONO-002) - $24.99
2. Scrabble Junior (TOY-SCRA-010) - $19.99

**Información de envío:**
- Método: Envío estándar (GRATIS)
- Dirección: 987 Birch Street, Phoenix, AZ 85001
- Retraso: Tormenta invernal afectó centro de distribución
- Nueva fecha estimada: 26 Enero 2025
- Compensación: Envío express gratuito aplicado

**Timeline del pedido:**
- 22 Ene, 7:20 PM: ORDER_PLACED
- 22 Ene, 7:28 PM: PAYMENT_CONFIRMED
- 22 Ene, 9:45 PM: INVENTORY_CHECK
- 23 Ene, 10:00 AM: PREPARING_ORDER
- 23 Ene, 3:30 PM: READY_TO_SHIP
- 24 Ene, 8:00 AM: DELAYED (por clima)

### Orden #TB-2025-001239
**Cliente:** Liam O'Connor (7 años)
**Fecha del pedido:** 23 Enero 2025, 1:10 PM
**Estado actual:** OUT_FOR_DELIVERY
**Total:** $169.97

**Productos ordenados:**
1. Carro RC Monster Truck (TOY-RC-009) - $45.99
2. Set de Fútbol Infantil (TOY-FOOT-021) - $24.99
3. Trampoline Mini para Niños (TOY-TRAM-019) - $69.99
4. Kit de Slime Making (TOY-SLIM-017) - $19.99
5. Oso de Peluche Gigante (TOY-OSO-013) - $39.99

**Información de envío:**
- Método: Envío rápido ($9.99)
- Dirección: 654 Willow Court, Boston, MA 02101
- Estado: En camión de reparto
- Ventana de entrega: Hoy 2:00-6:00 PM
- Conductor: Michael Johnson, Ruta #47

### Orden #TB-2025-001240
**Cliente:** Sophia Kim (9 años)
**Fecha del pedido:** 24 Enero 2025, 10:45 AM
**Estado actual:** EXCEPTION
**Total:** $89.98

**Productos ordenados:**
1. Pokémon Pikachu Interactivo (TOY-PIKA-014) - $29.99
2. Patineta para Principiantes (TOY-SKAT-020) - $39.99
3. Set de Animales de la Granja (TOY-FARM-015) - $16.99

**Información de envío:**
- Método: Envío estándar (GRATIS)
- Dirección original: 147 Elm Street, Portland, OR 97201
- Problema: Dirección incompleta (falta número de apartamento)
- Acción requerida: Cliente debe confirmar dirección completa
- Contacto: Email enviado + llamada programada

**Información de contacto del cliente:** sophia.kim@email.com, (503) 555-0147

## Pedidos Históricos para Análisis

### Estadísticas de Enero 2025
**Órdenes totales procesadas:** 1,847
**Valor promedio de orden:** $87.34
**Productos más vendidos:**
1. LEGO Classic Set Creativo - 234 unidades
2. Barbie Doctora - 189 unidades  
3. UNO Flip - 167 unidades
4. Crayola Set de Arte - 145 unidades
5. Hot Wheels Mega Garage - 134 unidades

**Estados de órdenes (distribución):**
- DELIVERED: 68.2% (1,260 órdenes)
- IN_TRANSIT: 12.4% (229 órdenes)
- PREPARING_ORDER: 8.9% (164 órdenes)
- SHIPPED: 5.7% (105 órdenes)
- DELAYED: 2.1% (39 órdenes)
- EXCEPTION: 1.8% (33 órdenes)
- PARTIALLY_SHIPPED: 0.9% (17 órdenes)

**Tiempos promedio de procesamiento:**
- ORDER_PLACED a SHIPPED: 18.5 horas
- SHIPPED a DELIVERED: 4.2 días (envío estándar)
- SHIPPED a DELIVERED: 2.1 días (envío rápido)
- Satisfacción del cliente: 97.3%

## Casos de Uso para Chatbot

### Consulta típica #1: "¿Dónde está mi pedido?"
**Cliente pregunta por orden #TB-2025-001235**
**Respuesta esperada:** 
"¡Hola Miguel! Tu pedido está viajando hacia ti. Tu Hot Wheels Mega Garage y juego UNO Flip salieron de nuestro almacén ayer y ahora están en camino a Houston. El transportista FedEx dice que llegará mañana entre las 10 AM y 6 PM. ¡Puedes seguir tu paquete con el número 7749183567284!"

### Consulta típica #2: "Mi pedido llega tarde"
**Cliente pregunta por orden #TB-2025-001238**
**Respuesta esperada:**
"Hola Isabella, entendemos tu preocupación. Tu pedido con Monopoly Junior y Scrabble Junior se retrasó por una tormenta que afectó nuestro centro de envíos. Como disculpa, hemos cambiado tu envío a express GRATIS, así que ahora llegará el sábado. ¡Gracias por tu paciencia!"

### Consulta típica #3: "Problema con mi dirección"
**Cliente pregunta por orden #TB-2025-001240**
**Respuesta esperada:**
"Hola Sophia! Hay un pequeño problema con tu dirección de envío. Nos falta el número de apartamento para entregar tu Pikachu y patineta. ¿Podrías decirnos el número de apartamento en 147 Elm Street? Una vez que lo tengamos, ¡tu paquete saldrá inmediatamente!"

### Consulta típica #4: "Quiero cancelar parte de mi pedido"
**Cliente pregunta por orden #TB-2025-001237**
**Respuesta esperada:**
"Hola Alex! Tu drone y figuras de Marvel ya fueron entregados, pero la tablet LeapPad aún no ha salido porque se agotó temporalmente. Puedes cancelar solo esa tablet y te reembolsaremos $159.99, o esperar hasta que llegue el 28 de enero. ¿Qué prefieres?"
