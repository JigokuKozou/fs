<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Подготовка SQL запроса для получения данных
    require_once 'db_connection.php';
    $conn = getDbConnection();
    $sql = "SELECT dir_path, total_size, load_time_seconds, created_at FROM statistic";
    $result = $conn->query($sql);
    if (!$result) {
        $conn->close();
        http_response_code(500);
        exit;
    }

    $data = [];
    // Проверка наличия строк в результате запроса
    if ($result->num_rows > 0) {
        // Извлечение строк из результата запроса
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    // Освобождение ресурсов, связанных с результатом
    $result->free();
    // Закрытие соединения с базой данных
    $conn->close();
    
    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode($data);
} else {
    // Ответ в случае использования метода, отличного от GET
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode([
        'message' => 'Только GET-запросы поддерживаются'
    ]);
}
?>
