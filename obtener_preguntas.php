<?php
include 'db.php';

try {
    $stmt = $conn->prepare("SELECT * FROM preguntas");

    $stmt->execute();

    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($questions);

} catch (PDOException $e) {
    echo json_encode(['error' => "Error en la consulta: " . $e->getMessage()]);
}
