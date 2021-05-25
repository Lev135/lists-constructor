import { resolve } from 'path'
export const rootDir = resolve(__dirname + "\\..");

import { initTemplates } from './compilation/latex-templates';
import { createTestData } from './processes/create-test-data';
import { startExpress } from './processes/express-process';
import { connectToDatabase, createDatabaseIfNotExists, dropDatabase } from './processes/mysql-process';
import { initOptions, options } from './processes/personal-options-process';
import { startTypeOrm } from './processes/typeorm-process';
import { runTests } from './tests/test';

main();

async function main() {
  try {
    initOptions();
  }
  catch (err) {
    return console.error("Ошибка при считывании personal-options.json: \n", err);
  }
  try {
    const connection = await connectToDatabase();
    if (options.run.dropDataBase) {
      try {
        console.log(`Удаление базы данных "${options.dataBase.name}"...`)
        await dropDatabase(connection);
        console.log("База данных успешно удалена");
      }
      catch (err) {
        return console.error("Ошибка при удалении базы данных: ", err);
      }
    }
    try {
      console.log(`Создание базы данных "${options.dataBase.name}"...`);
      await createDatabaseIfNotExists(connection);
      console.log("База данных успешно создана или существовала ранее");
    }
    catch (err) {
      return console.error("Ошибка при создании базы данных: ",  err);
    }
    try {
      console.log("Подключение к базе данных через TypeOrm....");
      await startTypeOrm();
      console.log("TypeOrm успешно подключён к базе данных");
    }
    catch(err) {
      return console.error("Ошибка при запуске TypeORM: ", err);
    }
    if (options.run.createTestData) {
      try {
        console.log("Создание тестовых данных...");
        await createTestData();
        console.log("Тестовые данные успешно созданы");
      }
      catch (err) {
        console.error("Ошибка при добавлении тестовых данных: \n", err);
      }
    }
    if (options.run.runTests) {
      try {
        console.log("Запуск тестирования....");
        await runTests();
        console.log("Тестирование завершилось успешно");
      }
      catch (err) {
        return console.error("Ошибка во время тестирования: \n", err);
      }
    }
    if (options.run.startServer) {
      try {
        console.log("Запуск сервера....");
        await startExpress();
        console.log(`Сервер успешно запущен на порту: ${options.server.port}`);
      }
      catch (err) {
        return console.error("Ошибка во время запуска сервера: \n", err);
      }
      try {
        console.log("Инициализация шаблонов для LaTeX'a....");
        await initTemplates();
        console.log("Шаблоны успешно инициализированы");
      }
      catch (err) {
        return console.error("Ошибка во время инициализации шаблонов: \n", err);
      }
    }
  }
  catch (err) {
    console.error("Ошибка при подключении к базе данных: \n", err);
    return;
  }
}
