<?php
include 'db.php';

$id = $_POST['id'];
$nombre_usuario = $_POST['nombre_usuario'];
$contrasena = $_POST['contrasena'];

try {
    $stmt = $conn->prepare("UPDATE usuario SET username = :nombre_usuario, password = :contrasena WHERE id = :id");

    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':nombre_usuario', $nombre_usuario);
    $stmt->bindParam(':contrasena', $contrasena);

    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo 'Usuario actualizado con éxito';
    } else {
        echo 'Error al actualizar el usuario';
    }
} catch (PDOException $e) {
    echo "Error en la consulta: " . $e->getMessage();
}
