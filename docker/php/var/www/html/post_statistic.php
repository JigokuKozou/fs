<?php
require_once 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Получение данных из POST-запроса
        $postData = file_get_contents('php://input');
        $data = json_decode($postData, true);

        // Проверка на наличие данных
        if (!$data) {
            throw new Exception('Получены некорректные данные', 400);
        }

        $conn = getDbConnection();

        // Подготовка SQL запроса для вставки в таблицу
        $sql = "INSERT INTO statistic (dir_path, total_size, "
            . "load_time_seconds, created_at) "
            . "VALUES (?, ?, ?, NOW())";

        $statement = $conn->prepare($sql);
        if (!$statement) {
            throw new Exception('Ошибка подготовки SQL запроса', 500);
        }

        // Привязка параметров SQL запроса
        if (!$statement->bind_param("sid", $data['dirPath'], $data['totalSize'], $data['loadTimeSeconds'])) {
            throw new Exception('Ошибка привязки параметров SQL запроса', 500);
        }

        // выполнение SQL запроса
        if (!$statement->execute()) {
            throw new Exception('Ошибка выполнения SQL запроса', 500);
        }

        http_response_code(204);
    } catch (Throwable $th) {
        // Ответ в случае ошибки
        http_response_code($th->getCode());
        header('Content-Type: application/json');
        echo json_encode([
            'message' => $th->getMessage()
        ]);
    } finally {
        // Освобождение ресурсов, связанных с SQL запросом
        if ($statement) {
            $statement->close();
        }
        // Закрытие соединения с базой данных
        if ($conn) {
            $conn->close();
        }
    }
} else {
    // Ответ в случае использования метода, отличного от POST
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode([
        'message' => 'Только POST-запросы поддерживаются'
    ]);
}
