<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre_usuario = $_POST['nombre_usuario'];
    $nueva_contrasena = $_POST['nueva_contrasena'];
    $contrasena_encriptada = base64_encode($nueva_contrasena);

    try {
        $stmt = $conn->prepare("UPDATE usuario SET password = :nueva_contrasena WHERE username = :nombre_usuario");
        $stmt->bindParam(':nueva_contrasena', $contrasena_encriptada);
        $stmt->bindParam(':nombre_usuario', $nombre_usuario);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo $user;


        if ($stmt->execute()) {
            echo 'success';
        } else {
            echo 'Error al actualizar la contraseña.';
        }
    } catch (PDOException $e) {
        echo 'Error en la consulta: ' . $e->getMessage();
    }
} else {
    echo 'Método no permitido.';
}
