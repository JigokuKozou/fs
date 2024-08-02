<?php
require_once 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получение данных из POST-запроса
    $postData = file_get_contents('php://input');
    $data = json_decode($postData, true);

    // Проверка на наличие данных
    if ($data) {
        $conn = getDbConnection();

        // Подготовка SQL запроса для вставки в таблицу
        $sql = "INSERT INTO statistic (dir_path, total_size, "
        . "load_time_seconds, created_at) "
        . "VALUES (?, ?, ?, NOW())";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            
            // закрытие соединения с базой данных
            $conn->close();
            exit;
        }
        
        if (!$stmt->bind_param("sid", $data['dirPath'], $data['totalSize'], $data['loadTimeSeconds'])) {
            http_response_code(500);

            // закрытие соединения с базой данных
            $conn->close();
            exit;
        }

        // выполнение SQL запроса
        if ($stmt->execute()) {
            http_response_code(204);
        }
        else {
            http_response_code(500);
        }
        $stmt->close();
        
        // закрытие соединения с базой данных
        $conn->close();

    } else {
        // Ответ в случае отсутствия данных или ошибки
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode([
            'message' => 'Получены не корректные данные'
        ]);
    }
} else {
    // Ответ в случае использования метода, отличного от POST
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode([
        'message' => 'Только POST-запросы поддерживаются'
    ]);
}
?>
