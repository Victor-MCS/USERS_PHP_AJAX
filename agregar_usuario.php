<?php
include 'db.php';

$nombre_usuario = $_POST['nombre_usuario'];
$contrasena = $_POST['contrasena'];
$contrasena_encriptada = base64_encode($contrasena);

try {
    $stmt = $conn->prepare("INSERT INTO usuario (username, password) VALUES (:nombre_usuario, :contrasena)");

    $stmt->bindParam(':nombre_usuario', $nombre_usuario);
    $stmt->bindParam(':contrasena', $contrasena_encriptada);

    $stmt->execute();

    echo 'Usuario agregado con éxito';
} catch (PDOException $e) {
    echo 'Error al agregar usuario: ' . $e->getMessage();
}
