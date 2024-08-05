<?php
require_once 'db_connection.php';

header('Access-Control-Allow-Origin: ' . htmlspecialchars($_ENV['ALLOWED_HOSTS']));

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $conn = getDbConnection();

        $sql = "SELECT dir_path as dirPath, total_size as totalSize,"
                . " load_time_seconds as loadTimeSeconds, created_at as createdAt FROM statistic";
                
        try {
            $result = $conn->query($sql);
            if (!$result) {
                throw new Exception('Ошибка выполнения SQL запроса: ' . $conn->error, 500);
            }
    
            $data = [];
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    // Форматирование размера в читаемый формат
                    $row['totalSize'] = formatSize($row['totalSize']);
                    $data[] = $row;
                }
            }
        } finally {
            if ($result) {
                $result->free();
            }
        }
        
        echo '<!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Статистика сканирования</title>'
            . getStyles() .
        '</head>
        <body>
            <h1>Статистика сканирования</h1>' . buildTable($data) . '</body></html>';
    } catch (Throwable $th) {
        header('Content-Type: application/json');
        http_response_code($th->getCode() ?: 500);
        echo json_encode([
            'message' => $th->getMessage()
        ]);
    } finally {
        if ($conn) {
            $conn->close();
        }
    }
} else {
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode([
        'message' => 'Только GET-запросы поддерживаются'
    ]);
}

function buildTable($array){
    $html = '<table>';
    $html .= '<tr>';
    $html .= '<th>Путь к директории</th>';
    $html .= '<th>Размер</th>';
    $html .= '<th>Время загрузки (сек)</th>';
    $html .= '<th>Время запроса</th>';
    $html .= '</tr>';

    foreach ($array as $value) {
        $html .= '<tr>';
        foreach ($value as $value2) {
            $html .= '<td>' . htmlspecialchars($value2) . '</td>';
        }
        $html .= '</tr>';
    }

    $html .= '</table>';
    return $html;
}

function formatSize($size) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    $unit = 0;
    while ($size >= 1024 && $unit < count($units) - 1) {
        $size /= 1024;
        $unit++;
    }
    return round($size, 2) . ' ' . $units[$unit];
}

function getStyles() {
    return '
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            height: 100vh;
            overflow: auto;
        }
        h1 {
            margin-bottom: 20px;
        }
        table {
            border-collapse: collapse;
            width: 80%;
            max-width: 800px;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        th, td {
            border: 1px solid #ddd;
            padding: 4px;
            text-align: center;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    </style>';
}
?>
