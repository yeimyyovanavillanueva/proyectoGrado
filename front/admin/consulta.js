document.addEventListener('DOMContentLoaded', function () {
    consultarRegistros();
});

function consultarRegistros() {
    fetch('http://localhost/back/parqueaderos.php')
        .then(response => response.json())
        .then(data => mostrarResultados(data))
        .catch(error => console.error('Error:', error));
}

function mostrarResultados(data) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';

    data.forEach(parqueadero => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${parqueadero.id}</td>
            <td>${parqueadero.nombre}</td>
            <td>${parqueadero.direccion}</td>
            <td>${parqueadero.telefono}</td>
            <td>${parqueadero.contacto || ''}</td>
            <td>${parqueadero.total_cupos}</td>
            <td>${parqueadero.cupos_disponibles}</td>
            <td><a class='btn btn-success' href='ver.html?id=${parqueadero.id}'>Ver</a> 
                <a class='btn btn-warning' href='editar.html?id=${parqueadero.id}'>Editar</a> 
                <button type="button" class="btn btn-danger" onclick="eliminarRegistro(${parqueadero.id})">Eliminar</button></td>
            

        `;
        resultadosDiv.appendChild(row);
    });
}

function eliminarRegistro(id) {
    //const id = document.getElementById('id_actualizar').value;
    
    var pregunta = "¿Está seguro que desea eliminar el registro?";
    if( confirm( pregunta ) == false ) {
        return;
    }
     
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
        regresar();
    })
    .catch(error => console.error('Error:', error));

}

function regresar( ) {
    window.location.reload( );
}
