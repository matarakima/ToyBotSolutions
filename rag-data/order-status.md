# Estados de Pedidos - Sistema ToyBot Store

## Códigos de Estado de Pedidos

### Estado: "ORDER_PLACED" (Pedido Realizado)
**Descripción:** El pedido ha sido recibido y confirmado en nuestro sistema
**Duración típica:** 0-2 horas
**Acciones del cliente:**
- Revisar detalles del pedido
- Modificar información de envío (si aún es posible)
- Cancelar pedido (dentro de 2 horas)

**Mensaje para niños:** "¡Genial! Hemos recibido tu pedido. ¡Estamos preparando tus juguetes!"

### Estado: "PAYMENT_PROCESSING" (Procesando Pago)
**Descripción:** Verificando y procesando la información de pago
**Duración típica:** 1-4 horas
**Acciones posibles:**
- Actualizar método de pago si es rechazado
- Verificar información de facturación

**Mensaje para niños:** "Estamos confirmando el pago con tu papá o mamá. ¡Pronto estaremos listos!"

### Estado: "PAYMENT_CONFIRMED" (Pago Confirmado)
**Descripción:** El pago ha sido procesado exitosamente
**Duración típica:** Inmediato
**Notificaciones enviadas:**
- Email de confirmación al cliente
- SMS si está habilitado

**Mensaje para niños:** "¡Perfecto! El pago está listo. ¡Ahora vamos a buscar tus juguetes!"

### Estado: "INVENTORY_CHECK" (Verificando Inventario)
**Descripción:** Confirmando disponibilidad de todos los productos
**Duración típica:** 2-6 horas
**Posibles resultados:**
- Todos los productos disponibles → Continúa a preparación
- Productos agotados → Contacto con cliente para opciones

**Mensaje para niños:** "Estamos revisando que todos tus juguetes estén disponibles en nuestro almacén."

### Estado: "PREPARING_ORDER" (Preparando Pedido)
**Descripción:** Recolectando productos del inventario y empacando
**Duración típica:** 4-12 horas
**Proceso interno:**
- Picking de productos en almacén
- Control de calidad
- Empaque personalizado si aplica

**Mensaje para niños:** "¡Estamos empacando tus juguetes con mucho cuidado! Casi listos para enviar."

### Estado: "QUALITY_CHECK" (Control de Calidad)
**Descripción:** Verificación final de productos y empaque
**Duración típica:** 1-2 horas
**Verificaciones:**
- Productos correctos y completos
- Empaque seguro
- Etiquetas de envío correctas

**Mensaje para niños:** "Revisando que todo esté perfecto antes de enviar tus juguetes."

### Estado: "READY_TO_SHIP" (Listo para Envío)
**Descripción:** Pedido completo y listo para ser recogido por transportista
**Duración típica:** 2-8 horas
**Preparativos finales:**
- Generación de etiqueta de rastreo
- Programación de recogida
- Notificación de envío inminente

**Mensaje para niños:** "¡Tu paquete está listo! Pronto estará en camino hacia tu casa."

### Estado: "SHIPPED" (Enviado)
**Descripción:** El pedido ha sido entregado al transportista
**Información proporcionada:**
- Número de rastreo
- Transportista asignado
- Fecha estimada de entrega
- Link de seguimiento

**Mensaje para niños:** "¡Tu paquete ya está viajando hacia ti! Puedes seguir su viaje con el número de rastreo."

### Estado: "IN_TRANSIT" (En Tránsito)
**Descripción:** El paquete está en camino a su destino
**Actualizaciones incluyen:**
- Ubicación actual del paquete
- Centros de distribución por los que ha pasado
- Confirmación de que está en ruta local

**Mensaje para niños:** "¡Tu paquete está viajando! Ya pasó por [ciudad] y se acerca a tu casa."

### Estado: "OUT_FOR_DELIVERY" (En Reparto)
**Descripción:** El paquete está en el vehículo de entrega local
**Información del día:**
- Ventana de entrega estimada
- Conductor asignado (si disponible)
- Instrucciones especiales de entrega

**Mensaje para niños:** "¡Súper emocionante! Tu paquete está en el camión de entrega y llegará hoy."

### Estado: "DELIVERED" (Entregado)
**Descripción:** El pedido ha sido entregado exitosamente
**Confirmación incluye:**
- Hora exacta de entrega
- Ubicación de entrega (puerta, recepción, etc.)
- Foto de confirmación (si disponible)
- Persona que recibió (si aplica)

**Mensaje para niños:** "¡Tu paquete llegó! ¡Hora de jugar con tus nuevos juguetes!"

## Estados Especiales

### Estado: "PARTIALLY_SHIPPED" (Envío Parcial)
**Descripción:** Solo algunos productos del pedido han sido enviados
**Razones comunes:**
- Productos en diferentes almacenes
- Disponibilidad limitada de algunos items
- Productos en pre-orden con fechas diferentes

**Comunicación:** Email detallando qué se envió y qué viene después
**Mensaje para niños:** "Algunos de tus juguetes ya están en camino, ¡y los otros vienen pronto!"

### Estado: "BACKORDERED" (En Lista de Espera)
**Descripción:** Producto temporalmente agotado, pedido en espera
**Información proporcionada:**
- Fecha estimada de reabastecimiento
- Opción de producto sustituto
- Opción de cancelar ese item específico

**Mensaje para niños:** "Ese juguete está muy popular y se agotó, pero ya pedimos más. ¡Te avisamos cuando llegue!"

### Estado: "DELAYED" (Demorado)
**Descripción:** Retraso en el procesamiento o envío del pedido
**Razones posibles:**
- Problemas con transportista
- Condiciones climáticas adversas
- Problemas en el almacén
- Verificación adicional requerida

**Compensación automática:** Envío gratuito o descuento en próxima compra
**Mensaje para niños:** "Tu paquete se demoró un poquito, ¡pero ya está en camino! Te daremos algo especial por la espera."

### Estado: "EXCEPTION" (Excepción en Entrega)
**Descripción:** Problema durante la entrega que requiere atención
**Tipos de excepciones:**
- Dirección incorrecta o incompleta
- Nadie disponible para recibir
- Paquete dañado durante tránsito
- Problemas de acceso al domicilio

**Acciones requeridas:** Contacto con servicio al cliente para resolución
**Mensaje para niños:** "Hubo un pequeño problema con la entrega, pero no te preocupes, ¡lo vamos a solucionar rápido!"

## Casos Especiales de Seguimiento

### Pedidos con Productos Personalizados
**Tiempo adicional:** 3-5 días hábiles extras
**Estados adicionales:**
- "CUSTOMIZATION_IN_PROGRESS" (Personalizando)
- "CUSTOMIZATION_COMPLETE" (Personalización Lista)

### Pedidos Internacionales
**Estados adicionales:**
- "CUSTOMS_CLEARANCE" (En Aduana)
- "INTERNATIONAL_TRANSIT" (Tránsito Internacional)
- "ARRIVED_IN_COUNTRY" (Llegó al País)

### Pedidos de Pre-Orden
**Estados específicos:**
- "PRE_ORDER_CONFIRMED" (Pre-orden Confirmada)
- "RELEASE_DATE_APPROACHING" (Cerca de Fecha de Lanzamiento)
- "RELEASED_PROCESSING" (Producto Lanzado, Procesando)

## Notificaciones Automáticas

### SMS Notifications (Opcional)
- Pedido confirmado
- Enviado con número de rastreo
- En reparto hoy
- Entregado

### Email Updates
- Confirmación de pedido (detallada)
- Actualizaciones de estado importantes
- Problemas que requieren acción
- Confirmación de entrega

### App Push Notifications
- Estados críticos del pedido
- Oportunidades de rastreo en tiempo real
- Ofertas relacionadas con productos similares

### Para Niños (Con Aprobación Parental)
- Emails especiales con imágenes divertidas
- Videos cortos explicando dónde está su paquete
- Juegos temáticos mientras esperan la entrega
- Certificados digitales de "paciencia" por esperar
