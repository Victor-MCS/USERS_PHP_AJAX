<?php
include 'db.php';

$nombre_usuario = $_POST['nombre_usuario'];
$contrasena = $_POST['contrasena'];
$contrasena_encriptada = base64_encode($contrasena);
$email = $_POST['email'];
$status = $_POST['status'];
$answer = $_POST['answer'];

try {
    $stmt = $conn->prepare("INSERT INTO usuario (username, password, email, status, answer) VALUES (:nombre_usuario, :contrasena, :email, :status, :answer)");

    $stmt->bindParam(':nombre_usuario', $nombre_usuario);
    $stmt->bindParam(':contrasena', $contrasena_encriptada);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':answer', $answer);

    $stmt->execute();

    echo 'Usuario agregado con éxito';
} catch (PDOException $e) {
    echo 'Error al agregar usuario: ' . $e->getMessage();
}
