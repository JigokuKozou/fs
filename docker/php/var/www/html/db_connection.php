<?php
function getDbConnection()
{
    $host = $_ENV['MYSQL_HOST'];    // Адрес сервера базы данных
    $db = $_ENV['MYSQL_DATABASE'];  // Имя базы данных
    $user = $_ENV['MYSQL_USER'];    // Имя пользователя
    $pass = $_ENV['MYSQL_PASSWORD']; // Пароль

    // Создание соединения с базой данных
    $conn = new mysqli($host, $user, $pass, $db);

    // Проверка соединения
    if ($conn->connect_error) {
        throw new Exception("Ошибка подключения: " . $conn->connect_error);
    }

    return $conn;
}
