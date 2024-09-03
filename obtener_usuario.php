<?php
include 'db.php';

$id = isset($_POST['id']) ? $_POST['id'] : null;

if ($id === null) {
    echo json_encode(['error' => 'ID no proporcionado']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM usuario WHERE id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode($user);
    } else {
        echo json_encode(['error' => 'Usuario no encontrado']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => "Error en la consulta: " . $e->getMessage()]);
}
