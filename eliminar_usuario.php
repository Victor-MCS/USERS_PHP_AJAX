<?php
include 'db.php';

$id = $_POST['id'];

try {
    $stmt = $conn->prepare("DELETE FROM usuario WHERE id = :id");

    $stmt->bindParam(':id', $id);

    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo 'success';
    } else {
        echo 'error';
    }
} catch (PDOException $e) {
    echo "Error en la consulta: " . $e->getMessage();
}
