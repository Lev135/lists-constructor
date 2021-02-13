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
5. Для компиляции кода TypeScript введите ```npm run tsc```
6. Для запуска сервера введите ```npm start```.

7. Если появится ошибка ```Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client```, измените параметры сервера MySql:
  - Запустите консоль MySql
  - введите ```ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'password';```

  https://stackoverflow.com/questions/50149307/error-er-not-supported-auth-mode-client-does-not-support-authentication-protoc

8. При первом запуске в корневой папке проекта будет автоматически создан файл 'personal-options.json'.
  Измените, если необходимо, настройки под свой компьютер.

9. Для компиляции LaTeX-файлов в .pdf необходимо установить компилятор LaTeX. Проверить, что всё установлено правильно, можно выполнив ```pdflatex -version```
