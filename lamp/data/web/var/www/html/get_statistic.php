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

        // Преобразование данных в JSON для использования в JavaScript
        $jsonData = json_encode($data);

        // Генерация и вывод HTML-страницы
        echo buildHtml($data, $jsonData);
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

function buildHtml($tableData, $chartJsonData)
{
    return '<!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Статистика сканирования</title>'
            . getStyles() .
        '</head>
        <body>
            <canvas id="myChart" style="margin: 5px 5px 0 5px" ></canvas>
            <h1>Статистика сканирования</h1>'
            . buildTable($tableData) .
            '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script>
            const data = ' . $chartJsonData . ';
            const ctx = document.getElementById("myChart").getContext("2d");
            const labels = data.map(item => item.dirPath);
            const totalSizes = data.map(item => item.totalSize);
            const loadTimes = data.map(item => item.loadTimeSeconds);
            
            Chart.defaults.font.size = 16;
            const myChart = new Chart(ctx, {
                type: "scatter",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Отношение времени загрузки к размеру директории",
                        data: totalSizes.map((size, index) => ({ x: size, y: loadTimes[index] })),
                        backgroundColor: "rgba(75, 192, 192, 0.3)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Размер директории (байты)"
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Время загрузки (секунды)"
                            }
                        }
                    }
                }
            });
            </script>
        </body>
        </html>';
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


function getStyles()
{
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
