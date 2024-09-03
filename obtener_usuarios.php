<?php
include 'db.php';

try {
    $stmt = $conn->prepare("SELECT * FROM usuario");

    $stmt->execute();

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);

} catch (PDOException $e) {
    echo json_encode(['error' => "Error en la consulta: " . $e->getMessage()]);
}
