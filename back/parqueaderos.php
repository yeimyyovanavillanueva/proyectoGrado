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
                $result = $conn->query( "SELECT * FROM parqueadero WHERE id = $id AND estado = 'ACT' " );
            }
            else if ( isset( $_GET['cupo'] ) ) 
            {
                // $id = $_GET['id'];

                // Se ejecuta una consulta con todos los parqueaderos que tienen cupo disponible
                $result = $conn->query( "SELECT * FROM parqueadero WHERE cupos_disponibles > 0 AND estado = 'ACT' " );
            } 
            else 
            {
                // Se ejecuta una consulta de todos los registros activos de la tabla
                $result = $conn->query( "SELECT * FROM parqueadero WHERE estado = 'ACT' " );
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
            $nombre = $data["nombre"];
            $direccion = $data["direccion"];
            $longitud = $data["longitud"];
            $latitud = $data["latitud"];
            $telefono = $data["telefono"];
            $contacto = $data["contacto"];
            $total_cupos = $data["total_cupos"];
            $cupos_disponibles = $total_cupos;
            $estado = 'ACT';                            // Valor por defecto (aunque está establecido en la base de datos)
    
            // Se conforma la cadena SQL para la insercion del registro
            $sql = "INSERT INTO parqueadero (nombre, direccion, longitud, latitud, telefono, contacto, total_cupos, cupos_disponibles, estado) 
                    VALUES ('$nombre', '$direccion', '$longitud', '$latitud', '$telefono', '$contacto', $total_cupos, $cupos_disponibles, '$estado')";

            // Se ejecuta la instrucción SQL y se evalua si esta fue exitosa 
            if ( $conn->query( $sql ) === TRUE ) 
            {
                // Se devuelve al front-end un mensaje en formato JSON con una variable message y el mensaje de exito en la ejecucion
                echo json_encode( array( "message" => "Registro de parqueadero insertado correctamente." ) );
            } 
            else 
            {
                // Se devuelve al front-end un mensaje en formato JSON con una variable message y el mensaje de error en la ejecucion
                echo json_encode( array( "message" => "Error al insertar el registro del parqueadero: " . $conn->error ) );
            }
            break;

        // Actualización de los datos en un registro existente recepcionando los nuevos datos 
        case 'PUT':
            // Se recepciona en método put los datos del parqueadero por modificar en la base de datos
            parse_str( file_get_contents( "php://input" ), $data );

            // $data es un arreglo asociativo (las posiciones no son numéricas sino cadenas que coinciden con el nombre de las columnas en la tabla parqueadero)
            // Se toman los valores que vienen del front-end y se colocan en variables para conformar la cadena SQL de actualizacion de registro
            $id = $data["id"];
            $nombre = $data["nombre"];
            $direccion = $data["direccion"];
            $longitud = $data["longitud"];
            $latitud = $data["latitud"];
            $telefono = $data["telefono"];
            $contacto = $data["contacto"];
            $total_cupos = $data["total_cupos"];
            $estado = 'ACT';                            // Valor por defecto (aunque está establecido en la base de datos)

            // Se conforma la cadena SQL para la actualizacion del registro
            $sql = "UPDATE parqueadero SET nombre='$nombre', direccion='$direccion', longitud=$longitud, latitud=$latitud, telefono='$telefono', contacto='$contacto', total_cupos=$total_cupos, estado='$estado' WHERE id=$id";

            // Se ejecuta la instrucción SQL y se evalua si esta fue exitosa 
            if ( $conn->query( $sql ) === TRUE ) 
            {
                // Se devuelve al front-end un mensaje en formato JSON con una variable message y el mensaje de exito en la ejecucion
                echo json_encode( array( "message" => "Registro de parqueadero actualizado correctamente." ) );
            } 
            else 
            {
                // Se devuelve al front-end un mensaje en formato JSON con una variable message y el mensaje de error en la ejecucion
                echo json_encode(array( "message" => "Error al actualizar el registro del parqueadero: " . $conn->error ) );
            }
            break;

        // Elimina un registro pero se le debe de enviar una clave ( para borrado )
        case 'DELETE':
            // Se recepciona en método delete los datos del parqueadero por eliminar en la base de datos
            parse_str( file_get_contents( "php://input" ), $data );

            // $data es un arreglo asociativo (las posiciones no son numéricas sino cadenas que coinciden con el nombre de las columnas en la tabla parqueadero)
            // Se toman unicamente el valor del ID (que es la PK) que viene del front-end y se coloca en una variable para conformar la cadena SQL de eliminacion de registro
            $id = $data["id"];
    
            // Se conforma la cadena SQL para la eliminacion del registro
            $sql = "DELETE FROM parqueadero WHERE id=$id";

            // Se ejecuta la instrucción SQL y se evalua si esta fue exitosa 
            if ( $conn->query( $sql ) === TRUE ) 
            {
                // Se devuelve al front-end un mensaje en formato JSON con una variable message y el mensaje de exito en la ejecucion
                echo json_encode( array( "message" => "Registro de parqueadero eliminado correctamente." ) );
            } 
            else 
            {
                // Se devuelve al front-end un mensaje en formato JSON con una variable message y el mensaje de error en la ejecucion
                echo json_encode( array( "message" => "Error al eliminar el registro de parqueadero: " . $conn->error ) );
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