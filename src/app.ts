// requires :
// Main framework:
import express from 'express';

// For dataBases
import * as MySql from 'mysql';
import * as Sequelize from 'sequelize';

// For files
import * as FileStream from 'fs';

// Reading options user options

interface IPersonalOptions {
  dataBase: {
    name: string,
    user: string,
    password: string,
    host: string,
    port: number,
    logDir?: string,
    doNotClean?: boolean
  },
  site : {
    port: string
  }
}
const options: IPersonalOptions =
  FileStream.readFileSync('./personal-options.json', 'utf8')
      .toString().split(/(?={")/).map(x => JSON.parse(x))[0];

main();

async function main() {
  if (!options.dataBase.doNotClean) {
    if (await cleanDataBase()) {
      await startTypeOrm();
    }
  }
}


async function execQuery(connection: MySql.Connection, query: string) {
  return new Promise((res, rej) => {
    connection.query(query, (err: MySql.MysqlError | null) => {
      if (err) {
        rej(err);
        return;
      }
      res();
    });
  });
}

// Creating dataBase if not exists
async function cleanDataBase(): Promise<boolean> {
  console.log("Подключение к базе данных MySql...");
  try {
    const connection = MySql.createConnection({
      host: options.dataBase.host,
      user: options.dataBase.user,
      port: options.dataBase.port,
      password: options.dataBase.password
    });
    console.log(`Подключение к базе данных прошло успешно`);

    
    try {
      await execQuery(connection, `DROP DATABASE IF EXISTS ${options.dataBase.name};`);
      await execQuery(connection, `CREATE DATABASE IF NOT EXISTS ${options.dataBase.name};`);
      return true;
    }
    catch (err) {
      console.error(`Ошибка при отчистке базы данных: ${err.message}`);
    }
    finally {
      await closeConnection(connection);
    }
  }
  catch (err) {
    console.log(`Ошибка при подключении к базе данных: ${err.message}`);
  }
  return false;
}

async function closeConnection(connection : MySql.Connection) {
  try {
    await new Promise((res, rej) => {
      connection.end((err?: MySql.MysqlError) => {
        if (err)
          rej(err);
        else
          res();
      });
    });
    console.log("Подключение к серверу MySql успешно закрыто");
  }
  catch (err) {
    console.log("Ошибка при закрытии подключении к серверу MySql: " + err.message);
  };
}

function getLoggingFile(): string | undefined {
  if (!options.dataBase.logDir) {
    console.log("Добавьте папку для логов sequelize в personal-options.json:\n" +
                "(dataBase.\"logDir\" : \"\\\\logs\\\\\")");
    return;
  }
  const now: Date = new Date();
  const dir: string = options.dataBase.logDir +
              `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const fileName: string = `/${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.txt`;
  const shell = require('shelljs');
  shell.mkdir('-p', __dirname + dir);
  FileStream.writeFileSync(__dirname + dir + fileName, "Sequelize logs\n");
  return __dirname + dir + fileName;
}

import * as TypeOrm from 'typeorm';

async function startTypeOrm() {
  console.log("Подключение к БД через TypeORM...");
  try {
    const connection = await TypeOrm.createConnection({
      type: 'mysql',
      host: options.dataBase.host,
      port: options.dataBase.port,
      username: options.dataBase.user,
      password: options.dataBase.password,
      database: options.dataBase.name,
      logging: true,
      entities: ["entities/*.js"]
    });
    console.log(`TypeORM успешно подключён к БД`);
  }
 catch (err) {
  console.error(`Ошика при подключении к БД через typeORM: `, err);
 }
}