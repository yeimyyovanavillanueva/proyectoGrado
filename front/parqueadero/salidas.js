function insertarRegistro() {
    const placa = document.getElementById('placa').value;
    const codigo_parqueadero = 1;
    const tipo = "SAL";
    const estado = "ACT";

    const data = {
        placa,
        codigo_parqueadero,
        tipo, 
        estado
    };

    fetch('http://localhost/back/movimientos.php', {
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
    window.location.href = "./index.html";
}