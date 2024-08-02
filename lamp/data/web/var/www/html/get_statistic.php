<?php
require_once 'db_connection.php';

// Добавление доступа клиентскому домену (CORS)
header('Access-Control-Allow-Origin: ' . $_ENV['ALLOWED_HOSTS']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Подготовка SQL запроса для получения данных
        $conn = getDbConnection();

        $sql = "SELECT dir_path as dirPath, total_size as totalSize, "
            . "load_time_seconds as loadTimeSeconds, created_at as createdAt FROM statistic";
        $result = $conn->query($sql);
        if (!$result) {
            throw new Exception('Ошибка выполнения SQL запроса: ' . $conn->error, 500);
        }

        try {
            $data = [];
            // Проверка наличия строк в результате запроса
            if ($result->num_rows > 0) {
                // Извлечение строк из результата запроса
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
            }
        } finally {
            // Освобождение ресурсов, связанных с SQL запросом
            $result->free();
        }

        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode($data);
    } catch (Throwable $th) {
        header('Content-Type: application/json');
        http_response_code($th->getCode());
        echo json_encode([
            'message' => $th->getMessage()
        ]);
    } finally {
        // Закрытие соединения с базой данных
        $conn->close();
    }
} else {
    // Ответ в случае использования метода, отличного от GET
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode([
        'message' => 'Только GET-запросы поддерживаются'
    ]);
}
