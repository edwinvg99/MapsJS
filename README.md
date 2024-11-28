# Simulación de Ruta con Notificaciones

## Descripción

Este proyecto implementa una simulación de movimiento en una ruta definida en un mapa de Google Maps. La aplicación muestra un marcador que se desplaza por la ruta, mientras envía notificaciones en tiempo real cuando el marcador se aproxima a puntos específicos de interés (checkpoints). Las notificaciones se envían tanto en el navegador como por correo electrónico y WhatsApp.

## Funcionalidades

- **Simulación de Ruta**: Se calcula y muestra una ruta entre dos puntos en el mapa (p. ej., casa y universidad).
- **Marcador de Simulación**: Un marcador se mueve a lo largo de la ruta, simulando el movimiento del usuario.
- **Checkpoints**: Puntos de interés en la ruta que envían notificaciones cuando el marcador se aproxima (50 metros).
- **Notificaciones**:
    - **Navegador**: Notificación visual en la pantalla.
    - **Correo Electrónico**: Envío de correos utilizando EmailJS.
    - **WhatsApp**: Envío de mensajes usando la API de WhatsApp.

## Instalación y Uso

### Requisitos

- **Google Maps JavaScript API**: Asegúrate de tener una clave API válida.
- **EmailJS**: Necesario para enviar correos electrónicos. Obtén tu clave pública y configura los servicios.

### Pasos para ejecutar

1. **Inicializar EmailJS**: Inserta tu clave pública de EmailJS en el código.
        javascrip: emailjs.init("MyToken"); // Token de EmailJS
2. **Configuración de la API de Google Maps**:
    - Reemplaza la clave de la API de Google Maps en el `<script>` de tu HTML.
3. **Configuración de parámetros en el código**:
    - Modifica `phoneNumber` y `to_email` con los datos necesarios.

### Instrucciones de uso

- Abre la aplicación en tu navegador.
- Haz clic en el botón **"Iniciar simulación"** para comenzar a simular el recorrido.
- Haz clic en **"Detener simulación"** para detener el marcador en movimiento.
- Las notificaciones se mostrarán en pantalla y se enviarán al correo y WhatsApp cuando el marcador se acerque a un checkpoint.

## Código

### Funciones principales

- **`initMap()`**: Inicializa el mapa y agrega marcadores de puntos de interés.
- **`calculateAndSimulateRoute()`**: Calcula la ruta entre los puntos de origen y destino.
- **`simulateMovement()`**: Simula el movimiento del marcador a lo largo de la ruta.
- **`checkForCheckpoints()`**: Verifica si el marcador ha llegado a un checkpoint y envía notificaciones.
- **`showNotification()`**: Muestra una notificación en el navegador.
- **`sendWhatsAppNotification()`**: Envia un mensaje de WhatsApp.
- **`sendEmailNotification()`**: Envia un correo electrónico.

### Variables principales

- **`checkpoints`**: Lista de puntos de interés con coordenadas, mensaje y si deben enviar notificación.
- **`simulationInterval`**: Referencia al intervalo de simulación para poder detenerlo.

## Mejoras futuras

- Integración de un sistema de geolocalización en tiempo real.
- Adición de más tipos de notificaciones, como SMS.
- Interfaz de usuario más interactiva y amigable.

## Tecnologías utilizadas

- **HTML/CSS/JavaScript**
- **Google Maps JavaScript API**
- **EmailJS**
- **API de WhatsApp**

