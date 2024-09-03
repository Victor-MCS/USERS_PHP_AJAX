<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre_usuario = $_POST['nombre_usuario'];
    $answer = $_POST['answer'];

    try {
        $stmt = $conn->prepare("SELECT * FROM usuario WHERE username = :nombre_usuario and answer = :answer");
        $stmt->bindParam(':nombre_usuario', $nombre_usuario);
        $stmt->bindParam(':answer', $answer);

        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($users) > 0) {
            echo json_encode($users[0]);
        } else {
            echo json_encode(['error' => 'No se encontraron usuarios con esas credenciales.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Método no permitido.']);
}
