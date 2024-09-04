<?php
include 'db.php';

$id = $_POST['id'];

try {

    $stmt = $conn->prepare("SELECT * FROM usuario WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && $user['status'] == 0) {
        $status = 1;
        // $message = "Usuario activado";
    } else {
        $status = 0;
        // $message = "Usuario desactivado";
    }

    // $message = ($status == 0) ? "Usuario desactivado" : "Usuario activado";
    $stmt = $conn->prepare("UPDATE usuario SET status = :status WHERE id = :id");

    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':status', $status);

    $stmt->execute();

    echo ($status == 0) ? "Usuario desactivado" : "Usuario activado";
} catch (PDOException $e) {
    echo "Error al editar el usuario: " . $e->getMessage();
}