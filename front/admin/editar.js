function consultarRegistroPorId() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
        fetch(`http://localhost/back/parqueaderos.php?id=${id}`)
            .then(response => response.json())
            .then(data => mostrarDatosActualizar(data))
            .catch(error => console.error('Error:', error));
    }
}

function mostrarDatosActualizar(data) {
    const datosActualizarDiv = document.getElementById('divFormulario');
    datosActualizarDiv.innerHTML = '';

    if (data.length > 0) {
        const parqueadero = data[0];
/*            
        datosActualizarDiv.innerHTML = `
            <h4>Datos del Parqueadero</h4>
            <p>ID: ${parqueadero.id}</p>
            <p>Nombre: ${parqueadero.nombre}</p>
            <p>Dirección: ${parqueadero.direccion}</p>
            <p>Teléfono: ${parqueadero.telefono}</p>
            <p>Contacto: ${parqueadero.contacto || ''}</p>
            <p>Total Cupos: ${parqueadero.total_cupos}</p>
            <p>Cupos Disponibles: ${parqueadero.cupos_disponibles}</p>
            <p>Estado: ${parqueadero.estado}</p>
        `;
*/
        datosActualizarDiv.innerHTML = `
            <form class="mb-3">
                <div class="mb-3">
                    <label for="id" class="form-label">Id:</label>
                    <input type="text" class="form-control" id="id" value="${parqueadero.id}" required>
                </div>
                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre:</label>
                    <input type="text" class="form-control" id="nombre" value="${parqueadero.nombre}" required>
                </div>

                <div class="mb-3">
                    <label for="direccion" class="form-label">Dirección:</label>
                    <input type="text" class="form-control" id="direccion" value="${parqueadero.direccion}" required>
                </div>
                <div class="mb-3">
                    <label for="longitud" class="form-label">Longitud:</label>
                    <input type="text" class="form-control" id="longitud" value="${parqueadero.longitud}" required>
                </div>
                <div class="mb-3">
                    <label for="latitud" class="form-label">Latitud:</label>
                    <input type="text" class="form-control" id="latitud" value="${parqueadero.latitud}" required>
                </div>
                <div class="mb-3">
                    <label for="telefono" class="form-label">Teléfono:</label>
                    <input type="text" class="form-control" id="telefono" value="${parqueadero.telefono}" required>
                </div>
                <div class="mb-3">
                    <label for="contacto" class="form-label">Nombre del Contacto:</label>
                    <input type="text" class="form-control" id="contacto" value="${parqueadero.contacto || ''}">
                </div>
                <div class="mb-3">
                    <label for="total_cupos" class="form-label">Total Cupos:</label>
                    <input type="number" class="form-control" id="total_cupos" value="${parqueadero.total_cupos}" required>
                </div>
                
                <div class="mb-3">
                    <!-- <label for="estado" class="form-label">Estado:</label> -->
                    <input type="hidden" class="form-control" id="estado" value="${parqueadero.estado}" required>
                </div>
                <br />
                <button type="button" class="btn btn-primary" onclick="actualizarRegistro()">Guardar</button>
                &nbsp;
                <button type="button" class="btn btn-success" onclick="regresar()">Regresar</button>
            </form>
        `;

    } else {
        datosActualizarDiv.innerHTML = '<p>No se encontraron datos para el ID especificado.</p>';
    }
}

function actualizarRegistro() {
    /*
    const id = document.getElementById('id_actualizar').value;
    const nombre = prompt('Ingrese el nuevo nombre del parqueadero:');
    const direccion = prompt('Ingrese la nueva dirección del parqueadero:');
    const telefono = prompt('Ingrese el nuevo teléfono del parqueadero:');
    const contacto = prompt('Ingrese el nuevo contacto del parqueadero (opcional):');
    const total_cupos = prompt('Ingrese el nuevo total de cupos del parqueadero:');
    const cupos_disponibles = prompt('Ingrese el nuevo número de cupos disponibles del parqueadero:');
    const estado = prompt('Ingrese el nuevo estado del parqueadero (por defecto: ACT):') || 'ACT';
    */

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    
    const nombre = document.getElementById('nombre').value;
    const direccion = document.getElementById('direccion').value;
    const longitud = document.getElementById('longitud').value;
    const latitud = document.getElementById('latitud').value;
    const telefono = document.getElementById('telefono').value;
    const contacto = document.getElementById('contacto').value;
    const total_cupos = document.getElementById('total_cupos').value;
    const cupos_disponibles = total_cupos;
    //const estado = document.getElementById('estado').value;
    const estado = "ACT";

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
        regresar();
    })
    .catch(error => console.error('Error:', error));
}

function regresar( ) {
    window.location.href = "./consulta.html";
}
    
