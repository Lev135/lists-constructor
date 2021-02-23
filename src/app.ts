import { resolve } from 'path'
export const rootDir = resolve(__dirname + "\\..");

import { initTemplates } from './compilation/process-tamplates';
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
    return console.error("Ошибка при считывании personal-options.json: ", err.message);
  }
  try {
    const connection = await connectToDatabase();
    if (options.run.dropDataBase) {
      try {
        console.log(`Создание базы данных "${options.dataBase.name}"...`)
        await dropDatabase(connection);
        console.log("База данных успешно удалена");
      }
      catch (err) {
        return console.error("Ошибка при удалении базы данных: " + err.message);
      }
    }
    try {
      console.log(`Создание базы данных "${options.dataBase.name}"...`);
      await createDatabaseIfNotExists(connection);
      console.log("База данных успешно создана или существовала ранее");
    }
    catch (err) {
      return console.error("Ошибка при создании базы данных: " + err.message);
    }
    try {
      console.log("Подключение к базе данных через TypeOrm....");
      await startTypeOrm();
      console.log("TypeOrm успешно подключён к базе данных");
    }
    catch(err) {
      return console.error("Ошибка при запуске TypeORM: " + err.message);
    }
    if (options.run.runTests) {
      try {
        console.log("Запуск тестирования....");
        await runTests();
        console.log("Тестирование завершилось успешно");
      }
      catch (err) {
        return console.error("Ошибка во время тестирования: " + err.message);
      }
    }
    if (options.run.startServer) {
      try {
        console.log("Запуск сервера....");
        await startExpress();
        console.log(`Сервер успешно запущен на порту: ${options.site.port}`);
      }
      catch (err) {
        return console.error("Ошибка во время запуска сервера: " + err.message);
      }
      try {
        console.log("Инициализация шаблонов для LaTeX'a....");
        await initTemplates();
        console.log("Шаблоны успешно инициализированы");
      }
      catch (err) {
        return console.error("Ошибка во время инициализации шаблонов: " + err.message);
      }
    }
  }
  catch (err) {
    console.error("Ошибка при подключении к базе данных: " + err.message);
    return;
  }
}
