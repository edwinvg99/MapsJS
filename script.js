// Iniciando EmailJS con mi clave publica
(function() {
    emailjs.init("MyToken"); // token emailJS
})();

let map, marker; //mapa y marcador de ruta
let routePath, currentPointIndex = 0; //puntos de la ruta calculada y indice del punto actual
let simulationInterval; //referencia para detener la simulacion
let alertedCheckpoints = new Set(); //checkpoint que envian alertas
let simulationStartTime; // Variable para guardar el tiempo de inicio de la simulación


let checkpoints = [
    // lista de puntos en el mapa, poner latitud, longitud y mensaje de alarta para enviar
    { lat: 6.2768982, lng: -75.5727286, message: "Alerta: Pasando cerca de la gasolinera!", notify: true },
    { lat: 6.2724413, lng: -75.5653149, message: "Alerta: Pasando cerca del Parque Explora, Jardín Botánico y Parque Norte!", notify: true },

    
];

function initMap() {
    const casa = { lat: 6.2762145, lng: -75.5583278 };        //Cordenadas de punto de salida
    const universidad = { lat: 6.2800023, lng: -75.5840981 }; //Cordenadas de punto de llegada

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: casa //donde de centra el mapa al cargar la pagina
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Agregar marcadores para los checkpoints
    checkpoints.forEach(checkpoint => {
        new google.maps.Marker({
            position: { lat: checkpoint.lat, lng: checkpoint.lng },
            map: map,
            title: checkpoint.message,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                fillColor: '#E4080A',
                fillOpacity: 0.8,
                strokeWeight: 0.5,
                strokeColor: 'black'
            }
        });
    });

    // Configuracion del evento del botón para iniciar la simulación
    document.getElementById("startButton").addEventListener("click", () => {
        calculateAndSimulateRoute(directionsService, directionsRenderer, casa, universidad);
    });

    // Configuracion del evento del botón para detener la simulación
    document.getElementById("stopButton").addEventListener("click", () => {
        stopSimulation(); 
    });

}

function calculateAndSimulateRoute(directionsService, directionsRenderer, origen, destino) {
    directionsService.route(
        {
            origin: origen,      //punto de salida (casa)
            destination: destino,//punto de llegada (universidad)
            travelMode: 'DRIVING', //modo de recorrido de la ruta
        },
        (response, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(response); //dibuja la ruta
                routePath = response.routes[0].overview_path;
                simulateMovement(); // simula el movimiento
            } else {
                window.alert('Error al calcular la ruta: ' + status);
            }
        }
    );
}

function simulateMovement() {
    simulationStartTime = new Date(); // Guardar el tiempo de inicio de la simulación
    marker = new google.maps.Marker({ 
        position: routePath[currentPointIndex], //posicion en el indice
        map: map,
        title: "Simulación en progreso"
    });

    simulationInterval = setInterval(() => {
        if (currentPointIndex < routePath.length) { // verifica si el punto actual es menor al largo de la ruta
            marker.setPosition(routePath[currentPointIndex]);// mover marcador
            checkForCheckpoints(marker.getPosition());// verificar si llego a un checkpoint
            currentPointIndex++;
        } else {
            clearInterval(simulationInterval);
            showNotification("Simulación completada");
        }
    }, 600);// tiempo en ms de cuanto demora la ruta
}   

// Función para detener la simulación
function stopSimulation() {
    clearInterval(simulationInterval); // Detiene el intervalo
    showNotification("Simulación detenida"); // Muestra una notificación
}

//Funcion para mandar notificacion, mensajes y correo cuando este cerca del checkPoint
//calcular el tiempo y mover el puntero de la ruta
function checkForCheckpoints(position) {
    checkpoints.forEach((checkpoint) => {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
            position, 
            new google.maps.LatLng(checkpoint.lat, checkpoint.lng)
        );

        if (distance < 50 && !alertedCheckpoints.has(checkpoint.message)) { // calcula si esta cerca al punto (50 metros)
            alertedCheckpoints.add(checkpoint.message); //envia las alertas

            const currentTime = new Date();
            const timeElapsed = Math.floor((currentTime - simulationStartTime) / 1000); // Segundos transcurridos

            const formattedMessage = `${checkpoint.message} - Hora: ${currentTime.toLocaleTimeString()}, Tiempo transcurrido: ${timeElapsed} segundos desde la salida`;

            showNotification(formattedMessage); // Envia mensaje para mostrar notificación con hora y tiempo
            sendWhatsAppNotification(formattedMessage); // Envía mensaje a funcion de  WhatsApp con hora y tiempi
            sendEmailNotification(formattedMessage); // Envía mensahe a funcion de correo con hora y tiempo
        }
    });
}


// Funcion para mostrar la notificación en el navegador
function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.innerText = message;
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 4000); // Ocultar la notificación después de 2 segundos o 2000 ms
}

// Función para enviar mensaje por WhatsApp

function sendWhatsAppNotification(message) {
    const phoneNumber = "57MyPhone"; // celular de destino
    const whatsappMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
    window.open(url, '_blank'); // Aabre una nueva pestaña
}

// Función para enviar correo usando EmailJS
function sendEmailNotification(message) {
    const templateParams = {
        to_email: 'MyCorreo@gmail.com', 
        to_name: 'MyCorreo@gmail.com', 
        from_name: 'Maps TDEA',
        message: message,
    };

    emailjs.send('CodigoServicio', 'CodigoTemplate', templateParams)
        .then(() => {
            console.log("email enviado");
        })
        .catch(error => {
            console.error("Error al enviar email:", error);
        });
}
