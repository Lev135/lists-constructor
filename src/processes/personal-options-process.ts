import { existsSync, readFileSync, writeFileSync } from "fs";
import { LoggerOptions } from "typeorm";

interface DatabaseOptions {
  name: string,
  user: string,
  password: string,
  host: string,
  port: number,
  logging?: LoggerOptions,
  logger?: "advanced-console" | "simple-console" | "file" | "debug"
}

interface ServerOptions {
  port: number
}

type RunBlock = 'dropDataBase' | 'syncDataBase' | 'clearTables' | 'createTestData' | 'runTests' | 'startServer'

type RunSequence = RunBlock[];

export interface PersonalOptionsModel {
  dataBase: DatabaseOptions,
  server: ServerOptions,
  defaultRun?: RunSequence
}

export interface IPersonalOptions {
  "options-version": number,
  run: {
    [Key in RunBlock]: boolean
  },
  dataBase: {
    name: string,
    user: string,
    password: string,
    host: string,
    port: number,
    logging?: LoggerOptions,
    logger?: "advanced-console" | "simple-console" | "file" | "debug",
  },
  server: {
    port: number
  }
}

const optionsPath = './personal-options.json';
const genOptionsPath = './generated-personal-options.json';

function readOptions(): IPersonalOptions {
  const optionsStr = readFileSync(optionsPath, 'utf8').toString();
  return optionsStr.split(/(?={")/).map(x => JSON.parse(x))[0];
}

function createOptionsFile(path : string): void {
  const obj: IPersonalOptions = {
    "options-version" : 1,
    dataBase: {
      name: "constructorDb",
      user: "root",
      password: "password",
      host: "localhost",
      port: 3306,
      logging: ["error", "warn", "info", "migration", "query", "schema"],
      logger: "simple-console",
    },
    server: {
      port: 3000
    },
    run: {
      dropDataBase: false,
      syncDataBase: true,
      clearTables: false,
      createTestData: false,
      runTests: false,
      startServer: true
    }
  }
  writeFileSync(path, JSON.stringify(obj, null, 2));
}

export let options: IPersonalOptions;

export function initOptions() {
  if (!existsSync(optionsPath)) {
    createOptionsFile(optionsPath);
    throw new Error("В корневой директории не найден файл настроен 'personal-options.json'. "
      + "Он был создан автоматически. Отредактируйте его в соответствии с вашими настройками и перезапустите программу");
  }
  options = readOptions();
  if (options['options-version'] !== 1) {
    createOptionsFile(genOptionsPath);
    throw new Error("Файл 'personal-options.json', находящийся в корневой директории, устарел"
      + "Отредактируйте его в соответствии с автоматически созданным 'generated-personal-options.json' и перезапустите программу") 
  }
}
