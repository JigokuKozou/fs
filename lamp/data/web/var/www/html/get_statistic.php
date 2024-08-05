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
    $html = '<!DOCTYPE html>';
    $html .= '<html lang="ru">';
    $html .= '<head>';
    $html .= '<meta charset="UTF-8">';
    $html .= '<title>Статистика сканирования</title>';
    $html .= getStyles();
    $html .= '</head>';
    $html .= '<body>';
    $html .= '<canvas id="statChart"></canvas>
            <h1>Статистика сканирования</h1>';
    $html .= buildTable($tableData);
    $html .= '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>';
    $html .= '<script>
            const data = ' . tableDataToChartJson($tableData) . ';
            const totalSizes = data.map(item => item.totalSize);
            const loadTimes = data.map(item => item.loadTimeSeconds);

            Chart.defaults.font.size = 16;
            const chartData = {
                datasets: [{
                    label: "Время загрузки (сек)",
                    data: totalSizes.map((size, index) => ({ x: size, y: loadTimes[index] })),
                    backgroundColor: "rgba(75, 192, 192, 0.3)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1
                }]
            };

            const config = {
                type: "line",
                data: chartData,
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Размер директории (байты)"
                            },
                            type: "logarithmic"
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Время загрузки (секунды)"
                            }
                        }
                    }
                }
            };

            const ctx = document.getElementById("statChart").getContext("2d");
            const myChart = new Chart(ctx, config);
            </script>';

    $html .= '</body>';
    $html .= '</html>';

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
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 4px;
            text-align: right;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        #statChart {
            margin: 5px 5px 0 5px;
        }
    </style>';
}
