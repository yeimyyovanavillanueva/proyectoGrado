let lat = 0
let lon = 0
let coords = null

function getLocation() {
    navigator.geolocation.getCurrentPosition(onSuccess)
}

window.addEventListener("load", getLocation());

function onSuccess(pos) {
    const crd = pos.coords;
    coords = { lat: crd.latitude, lng: crd.longitude }
    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    initMap()
}

function initMap() {
    const image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

    if (coords) {
        const map = new google.maps.Map(document.getElementById("map"),
            {
                zoom: 16,
                center: coords,
            })

        const marker = new google.maps.Marker({
            position: coords,
            map
        })

        const gradosARadianes = (grados) => {
            return grados * Math.PI / 180;
        };

        const calcularDistancia = (lat1, lon1, lat2, lon2) => {
            // Convertir todas las coordenadas a radianes
            lat1 = gradosARadianes(lat1);
            lon1 = gradosARadianes(lon1);
            lat2 = gradosARadianes(lat2);
            lon2 = gradosARadianes(lon2);
            // Aplicar fórmula
            const RADIO_TIERRA_EN_KILOMETROS = 6371;
            let diferenciaEntreLongitudes = (lon2 - lon1);
            let diferenciaEntreLatitudes = (lat2 - lat1);
            let a = Math.pow(Math.sin(diferenciaEntreLatitudes / 2.0), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(diferenciaEntreLongitudes / 2.0), 2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return RADIO_TIERRA_EN_KILOMETROS * c * 1000;
        };

        fetch(`http://localhost/back/parqueaderos.php?cupo=1`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // initialize services
                const service = new google.maps.DistanceMatrixService();
                let menor = Infinity;
                let nombre = "";
                let dird = "";
                let cupd = "";
                data.forEach((parqueadero) => {
                    console.info(parqueadero.latitud)
                    const parkingSIte = new google.maps.Marker({
                        position: { lat: parseFloat(parqueadero.latitud), lng: parseFloat(parqueadero.longitud) },
                        title: parqueadero.nombre,
                        map,
                        icon: image,
                    })
                    let origin = { lat: coords.lat, lng: coords.lng };
                    let destinationA = parqueadero.nombre;
                    let direccion = parqueadero.direccion;
                    let cuposd = parqueadero.cupos_disponibles;
                    let destinationB = { lat: parseFloat(parqueadero.latitud), lng: parseFloat(parqueadero.longitud) };
                    let distancia = calcularDistancia(origin.lat, origin.lng, destinationB.lat, destinationB.lng)

                    console.info(distancia)
                    if(distancia < menor) {
                        menor = distancia
                        nombre = destinationA
                        dird = direccion;
                        cupd = cuposd;
                    }
    
                    // const request = {
                    //     origins: [origin1, origin2],
                    //     destinations: [destinationA, destinationB],
                    //     travelMode: google.maps.TravelMode.DRIVING,
                    //     unitSystem: google.maps.UnitSystem.METRIC,
                    //     avoidHighways: false,
                    //     avoidTolls: false,
                    // };
                    // // get distance matrix response
                    // service.getDistanceMatrix(request).then((response) => {
                    //     // show on map
                    //     // const originList = response.originAddresses;
                    //     // const destinationList = response.destinationAddresses;
    
                    //     console.info(response.rows[0].elements[0].distance.text)
                    //     console.info(response.rows[0].elements[0].distance)
                    // });

                });
                let mensaje = "Parqueadero más cercano: " + "\n" + 
                              "Nombre: " + nombre + "\n" + 
                              "Dirección: " + dird + "\n" + 
                              "Cupos disponibles: " + cupd + "\n" + 
                              "Distancia: " + menor ;
                alert(mensaje);

            });
    }
}