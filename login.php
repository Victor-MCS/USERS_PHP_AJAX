<?php
include 'db.php';

$nombre_usuario = $_POST['nombre_usuario'];
$contrasena = $_POST['contrasena'];
$contrasena_encriptada = base64_encode($contrasena);
try {
    $stmt = $conn->prepare("SELECT * FROM usuario WHERE username = :nombre_usuario AND password = :contrasena");

    $stmt->bindParam(':nombre_usuario', $nombre_usuario);
    $stmt->bindParam(':contrasena', $contrasena_encriptada);

    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo 'success';
    } else {
        echo 'error';
    }
} catch (PDOException $e) {
    echo "Error en la consulta: " . $e->getMessage();
}
