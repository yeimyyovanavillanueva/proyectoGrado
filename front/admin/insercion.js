function insertarRegistro() {
    const nombre = document.getElementById('nombre').value;
    const direccion = document.getElementById('direccion').value;
    const longitud = document.getElementById('longitud').value;
    const latitud = document.getElementById('latitud').value;
    const telefono = document.getElementById('telefono').value;
    const contacto = document.getElementById('contacto').value;
    const total_cupos = document.getElementById('total_cupos').value;
    //const estado = document.getElementById('estado').value;
    const estado = "ACT";

    const data = {
        nombre,
        direccion,
        longitud,
        latitud,
        telefono,
        contacto,
        total_cupos,
        estado
    };

    fetch('http://localhost/back/parqueaderos.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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