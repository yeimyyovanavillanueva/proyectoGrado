function consultarRegistroPorId() {
    const id = document.getElementById('id_actualizar').value;
    if (id) {
        fetch(`http://localhost/back/parqueaderos.php?id=${id}`)
            .then(response => response.json())
            .then(data => mostrarDatosActualizar(data))
            .catch(error => console.error('Error:', error));
    }
}

function mostrarDatosActualizar(data) {
    const datosActualizarDiv = document.getElementById('datos_actualizar');
    datosActualizarDiv.innerHTML = '';

    if (data.length > 0) {
        const parqueadero = data[0];
        datosActualizarDiv.innerHTML = `
            <h4>Datos del Parqueadero</h4>
            <p>ID: ${parqueadero.id}</p>
            <p>Nombre: ${parqueadero.nombre}</p>
            <p>Dirección: ${parqueadero.direccion}</p>
            <p>Longitud: ${parqueadero.longitud}</p>
            <p>Latitud: ${parqueadero.latitud}</p>
            <p>Teléfono: ${parqueadero.telefono}</p>
            <p>Contacto: ${parqueadero.contacto || ''}</p>
            <p>Total Cupos: ${parqueadero.total_cupos}</p>
            <p>Cupos Disponibles: ${parqueadero.cupos_disponibles}</p>
            <p>Estado: ${parqueadero.estado}</p>
        `;
    } else {
        datosActualizarDiv.innerHTML = '<p>No se encontraron datos para el ID especificado.</p>';
    }
}

function actualizarRegistro() {
    const id = document.getElementById('id_actualizar').value;
    const nombre = prompt('Ingrese el nuevo nombre del parqueadero:');
    const direccion = prompt('Ingrese la nueva dirección del parqueadero:');
    const longitud = prompt('Ingrese la nuevo longitud del parqueadero:');
    const latitud = prompt('Ingrese la nuevo latitud del parqueadero:');
    const telefono = prompt('Ingrese el nuevo teléfono del parqueadero:');
    const contacto = prompt('Ingrese el nuevo contacto del parqueadero (opcional):');
    const total_cupos = prompt('Ingrese el nuevo total de cupos del parqueadero:');
    const cupos_disponibles = prompt('Ingrese el nuevo número de cupos disponibles del parqueadero:');
    const estado = prompt('Ingrese el nuevo estado del parqueadero (por defecto: ACT):') || 'ACT';

    const data = {
        id,
        nombre,
        direccion,
        longitud,
        latitud, 
        telefono,
        contacto,
        total_cupos,
        cupos_disponibles,
        estado
    };

    fetch('http://localhost/back/parqueaderos.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        // Puedes realizar otras acciones después de la actualización
    })
    .catch(error => console.error('Error:', error));
}

function eliminarRegistro() {
    const id = document.getElementById('id_actualizar').value;

    fetch('http://localhost/back/parqueaderos.php', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ id })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        // Puedes realizar otras acciones después de la eliminación
    })
    .catch(error => console.error('Error:', error));
}
