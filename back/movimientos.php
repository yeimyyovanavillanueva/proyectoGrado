<?php

    // Se configuran las cabeceras para permitir el acceso desde cualquier origen
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: GET, POST");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // Se estblecen los parámetros de conexión
    $servidor = "localhost"; 
    $usuario = "root"; 
    $contrasenia = ""; 
    $nombreBaseDatos = "bd_parqueaderos";

    // Se conecta a la base de datos  con usuario, contraseña y nombre de la BD establecidos
    $conn = new mysqli( $servidor, $usuario, $contrasenia, $nombreBaseDatos );

    // Se verifica la conexión
    if ($conn->connect_error) 
    {
        die( "Error de conexión a la base de datos: " . $conn->connect_error );
    }

    // Se verifica el método de solicitud con el fin de determinar el tipo de operación por realizar
    $method = $_SERVER["REQUEST_METHOD"];

    switch ( $method ) 
    {
        // Consulta de registros almacenados
        case 'GET':

            // Si viene la variable id como parámetro en la solicitud
            if ( isset( $_GET['id'] ) ) 
            {
                $id = $_GET['id'];

                // Se ejecuta una consulta por ID (Si existe ID es porque se va a consultar un solo registro por la PK)
                $result = $conn->query( "SELECT * FROM movimientos WHERE id = $id AND estado = 'ACT' " );
            }
            else 
            {
                // Se ejecuta una consulta de todos los registros activos de la tabla
                $result = $conn->query( "SELECT * FROM movimientos WHERE estado = 'ACT' " );
            }
    
            $rows = array( );                           // Se crea un arreglo para guardar los registros obtenidos
            while ( $row = $result->fetch_assoc( ) )    // Se toma el siguiente registro disponible si existe
            {
                $rows[] = $row;                         // Se guarda el registro en el arreglo
            }
            echo json_encode($rows);                    // Se convierte a cadena JSON el arreglo para ser enviado al front-end
            break;

        // Inserción de un nuevo registro
        case 'POST':
            // Se recepciona en método post los datos del parqueadero por agregar a la base de datos
            $data = json_decode( file_get_contents( "php://input" ), true );

            // $data es un arreglo asociativo (las posiciones no son numéricas sino cadenas que coinciden con el nombre de las columnas en la tabla parqueadero)
            // Se toman los valores que vienen del front-end y se colocan en variables para conformar la cadena SQL de inserción de registro
            $placa = $data["placa"];
            $codigo_parqueadero = $data["codigo_parqueadero"];
            $tipo = $data["tipo"];
            $estado = $data["estado"];

            // Por defecto es un ingreso vehicular
            if( $tipo === "SAL")     // Si es salida vehicular
            {
                //$fecha_salida = date('Y-m-d H:i:s');

                // Se conforma la cadena SQL para la actualizacion del registro de salida
                $sqlI = "UPDATE movimientos SET fecha_salida = now(), estado = 'INA' WHERE codigo_parqueadero = $codigo_parqueadero AND placa = '$placa' AND estado = 'ACT' ";

                $sqlU = "UPDATE parqueadero SET cupos_disponibles = cupos_disponibles + 1 WHERE id = $codigo_parqueadero";
            }
            else 
            {
                // Se conforma la cadena SQL para la insercion del registro de ingreso
                $sqlI = "INSERT INTO movimientos (placa, codigo_parqueadero, estado) 
                        VALUES ('$placa', $codigo_parqueadero, '$estado')";

                $sqlU = "UPDATE parqueadero SET cupos_disponibles = cupos_disponibles - 1 WHERE id = $codigo_parqueadero";
            }
            
            // Se ejecuta la instrucción SQL y se evalua si esta fue exitosa 
            if ( $conn->query( $sqlI ) === TRUE && $conn->query( $sqlU ) === TRUE ) 
            {
                // Se devuelve al front-end un mensaje en formato JSON con una variable message y el mensaje de exito en la ejecucion
                echo json_encode( array( "message" => "Registro de movimiento de vehiculo insertado correctamente." ) );
            } 
            else 
            {
                // Se devuelve al front-end un mensaje en formato JSON con una variable message y el mensaje de error en la ejecucion
                echo json_encode( array( "message" => "Error al insertar el registro de movimiento de vehiculo: " . $conn->error ) );
            }
            break;

        default:
            // Si la solicitud se hace a traves de un metodo no valido
            echo json_encode( array( "message" => "Método no válido." ) );
            break;
        
    }

    // Se cierra la conexión a la base de datos
    $conn->close( );


?>