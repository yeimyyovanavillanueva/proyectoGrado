-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS bd_parqueaderos;

-- Usar la base de datos creada
USE bd_parqueaderos;

-- Crear la tabla parqueadero
CREATE TABLE IF NOT EXISTS parqueadero (
    id INT AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    direccion VARCHAR(50) NOT NULL,
    longitud DOUBLE NOT NULL,
    latitud DOUBLE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    contacto VARCHAR(50),
    total_cupos INT NOT NULL,
    cupos_disponibles INT NOT NULL DEFAULT total_cupos,
    estado VARCHAR(3) NOT NULL DEFAULT 'ACT',
    PRIMARY KEY (id)
);


-- Crear la tabla movimientos
CREATE TABLE movimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_ingreso DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_salida DATETIME,
    placa VARCHAR(6) NOT NULL,
    codigo_parqueadero INT,
    estado VARCHAR(3) NOT NULL DEFAULT 'ACT',
    FOREIGN KEY (codigo_parqueadero) REFERENCES parqueadero(id)
);


-- Mostrar mensaje de éxito
SELECT 'La base de datos y las tablas se han creado correctamente.' AS Mensaje;
