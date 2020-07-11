const express = require('express');
const app = express();

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "password"
});

connection.connect(function (err){
  if (err) {
    return console.error("Ошибка: " + err.message);
  }
  else{
    console.log("Подключение к серверу MySQL успешно установлено");
  }
});

connection.end(function(err) {
  if (err) {
    return console.log("Ошибка: " + err.message);
  }
  console.log("Подключение закрыто");
});

app.get('/*', function (req, res) {
  res.end('Hello, world!');
});

 app.listen(3000);
