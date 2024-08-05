<?php
require_once 'db_connection.php';

header('Access-Control-Allow-Origin: ' . htmlspecialchars($_ENV['ALLOWED_HOSTS']));

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $conn = getDbConnection();

        $sql = "SELECT dir_path as dirPath, total_size as totalSize,"
            . " load_time_seconds as loadTimeSeconds, created_at as createdAt FROM statistic";

        $result = $conn->query($sql);
        if (!$result) {
            throw new Exception('Ошибка выполнения SQL запроса: ' . $conn->error, 500);
        }

        $data = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }

        // Генерация и вывод HTML-страницы
        echo buildHtml($data);
    } catch (Throwable $th) {
        header('Content-Type: application/json');
        http_response_code($th->getCode() ?: 500);
        echo json_encode([
            'message' => $th->getMessage()
        ]);
    } finally {
        if ($result) {
            $result->free();
        }
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

function tableDataToChartJson($tableData)
{
    // Сортировка данных по возрастанию totalSize
    usort($tableData, function ($a, $b) {
        return $a['totalSize'] - $b['totalSize'];
    });

    // Преобразование данных в JSON для использования в JavaScript
    return json_encode($tableData);
}

function buildHtml($tableData)
{
    // Загрузка шаблона
    $htmlTemplate = file_get_contents('get_statistic_template.html');

    // Подстановка данных в шаблон
    $chartJsonData = tableDataToChartJson($tableData);
    $tableHtml = buildTable($tableData);

    $html = str_replace('<!-- TABLE_PLACEHOLDER -->', $tableHtml, $htmlTemplate);
    $html = str_replace('CHART_JSON_PLACEHOLDER', $chartJsonData, $html);

    return $html;
}

function buildTable($array)
{
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
