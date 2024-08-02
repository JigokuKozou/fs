# Используем официальный образ PHP с Apache
FROM php:7.4-apache

# Устанавливаем расширение mysqli
RUN docker-php-ext-install mysqli

# Устанавливаем рабочую директорию
WORKDIR /var/www/html

# Открываем порт 80
EXPOSE 80
