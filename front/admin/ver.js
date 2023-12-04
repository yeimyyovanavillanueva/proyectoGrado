function cargarDatos( ) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) {
        fetch(`http://localhost/back/parqueaderos.php?id=${id}`)
            .then(response => response.json())
            .then(data => mostrarDatosActualizar(data))
            .catch(error => console.error('Error:', error));
    }
   
    function mostrarDatosActualizar(data) {
        const datosActualizarDiv = document.getElementById('divId');
        datosActualizarDiv.innerHTML = '';
    
        if (data.length > 0) {
            const parqueadero = data[0];
            datosActualizarDiv.innerHTML = `
                <table class='table'>
                    <tr>
                        <td width='25%'></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td><b>ID: </b></td>
                        <td>${parqueadero.id}</td>
                    </tr>
                    <tr>
                        <td><b>Nombre: </b></td>
                        <td>${parqueadero.nombre}</td>
                    </tr>
                    <tr>
                        <td><b>Dirección: </b></td>
                        <td>${parqueadero.direccion}</td>
                    </tr>
                    <tr>
                        <td><b>Longitud: </b></td>
                        <td>${parqueadero.longitud}</td>
                    </tr>
                    <tr>
                        <td><b>Latitud: </b></td>
                        <td>${parqueadero.latitud}</td>
                    </tr>
                    <tr>
                        <td><b>Teléfono: </b></td>
                        <td>${parqueadero.telefono}</td>
                    </tr>
                    <tr>
                        <td><b>Nombre del Contacto: </b></td>
                        <td>${parqueadero.contacto || ''}</td>
                    </tr>
                    <tr>
                        <td><b>Total Cupos: </b></td>
                        <td>${parqueadero.total_cupos}</td>
                    </tr>
                    <tr>
                        <td><b>Cupos Disponibles: </b></td>
                        <td>${parqueadero.cupos_disponibles}</td>
                    </tr>
                    <tr>
                        <td><b>Estado: </b></td>
                        <td>${parqueadero.estado}</td>
                    </tr>
                </table>
            `;
        } else {
            datosActualizarDiv.innerHTML = '<p>No se encontraron datos para el ID especificado.</p>';
        }
    }
}

function regresar( ) {
    window.location.href = "./consulta.html";
}