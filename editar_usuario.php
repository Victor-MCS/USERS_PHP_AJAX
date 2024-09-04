<?php
include 'db.php';

$id = $_POST['id'];
$nombre_usuario = $_POST['nombre_usuario'];
$contrasena = $_POST['contrasena'];
$contrasena_encriptada = base64_encode($contrasena);
$email = $_POST['email'];
$status = $_POST['status'];
$answer = $_POST['answer'];

try {
    $stmt = $conn->prepare("SELECT * FROM usuario WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && base64_encode($user['password']) == $contrasena_encriptada) {
        $contrasena_encriptada = $user['password'];
    }

    $stmt = $conn->prepare("UPDATE usuario SET username = :nombre_usuario, password = :contrasena, email = :email, status = :status, answer = :answer WHERE id = :id");

    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':nombre_usuario', $nombre_usuario);
    $stmt->bindParam(':contrasena', $contrasena_encriptada);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':answer', $answer);

    $stmt->execute();

    echo 'Usuario editado con éxito';
} catch (PDOException $e) {
    echo "Error al editar el usuario: " . $e->getMessage();
}