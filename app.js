const express = require('express');
const app = express();

const MySql = require('mysql2/promise');
const Sequelize = require('sequelize');

const dbInfo = {
  name : "constructorDb",
  user : "root",
  password : "password",
  host : "localhost",
  port : "3306"
};

/*
  Создаём базу данных. Можно ли это сделать как-то проще,
  без отдельного подключения MySQL?
*/
MySql.createConnection({
  host: dbInfo.host,
  user: dbInfo.user,
  port: dbInfo.port,
  password: dbInfo.password
}).then(connection => {
  console.log("Соединение с сервером MySql успешно установлено");
  connection.query(`DROP DATABASE IF EXISTS ${dbInfo.name}`).then(res => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbInfo.name};`).then(res => {
      console.log("База данных создана/успешно проверена");
      closeConnection(connection);
      startSequelize();
    }).catch(err => {
      closeConnection(connection);
      console.error("Ошибка при создании/проверке базы данных: " + err.message);
    });
  });
}).catch(err => {
  console.error("Ошибка при подключении к серверу MySql: " + err.message);
});

function closeConnection(connection) {
  connection.end().then(()=> {
    console.log("Подключение к серверу MySql успешно закрыто");
  }).catch(err => {
    console.log("Ошибка при закрытии подключении к серверу MySql: " + err.message);
  });
}

/*
  Основная часть запуска. Вынесена в функцию, чтобы запускалась после создания БД.
  Опять же, выглядит кривовато, можно ли это как-то поправить?
*/

function startSequelize() {
  const sequelize = new Sequelize(dbInfo.name, dbInfo.user, dbInfo.password, {
    dialect: "mysql",
    host: dbInfo.host,
    port: dbInfo.port
  });
  console.log("Подключение моделей...");
  try {
    const Models = require('./modules/sequelize-models/sequelize-models')
                                                        (sequelize, Sequelize);
  } catch (err) {
    console.log("Ошибка при подключении моделей sequelize: " + err.message);
    throw err;
  }
  console.log("Подключение User успешно завершено");

  sequelize.sync({force:true}).then(result => {
    console.log("Sequelize успешно синхронизован");
    sequelize.close();
  }).catch(err => {
    console.log("Ошибка при синхронизации sequelize" + err);
    sequelize.close();
  });
}
