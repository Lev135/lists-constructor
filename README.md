Конструктор листочков для руководителей математических кружков
===============================================================

Установка проекта
-------------------
1. Установите Node.js версии 14.5.0
  (ссылка для скачивания https://nodejs.org/en/,
  руководство -- https://metanit.com/web/nodejs/1.1.php) Установка по умолчанию.
2. Установите MySQL (https://dev.mysql.com/downloads/installer/)
3. Откройте консоль в папке проекта и введите ```npm install```.
  Установятся все необходимые модули Node.js
4. Запустите базу данных MySQL
5. Если надо поменяйте пароль/порт БД в файле *app.js*
6. Для компиляции кода TypeScript введите ```npm run tsc```
6. Для запуска сервера введите ```npm start```.

Проверка базы данных

7. Если всё прошло корректно, то в консоль должны вывестись 2 сообщения:
  - Подключение к серверу MySQL успешно установлено
  - Подключение закрыто

Проверка сервера

8. После этого конструктор будет доступен по адресу ```http://localhost:3000```.


Если появится ошибка ```Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client```, измените параметры сервера MySql:
https://stackoverflow.com/questions/50149307/error-er-not-supported-auth-mode-client-does-not-support-authentication-protoc