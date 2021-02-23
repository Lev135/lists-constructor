import { existsSync, readFileSync, writeFileSync } from "fs";
import Getopt from "node-getopt";
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

function readOptions(): IPersonalOptions {
  const optionsStr = readFileSync(optionsPath, 'utf8').toString();
  return optionsStr.split(/(?={")/).map(x => JSON.parse(x))[0];
}

function createOptionsFile(): void {
  const obj: IPersonalOptions = {
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
  writeFileSync(optionsPath, JSON.stringify(obj, null, 2));
}

export let options: IPersonalOptions;

function updateOptionsByConsoleFlags() {
  const getOpt = new Getopt([
    ['', 'drop'],
    ['', 'sync'],
    ['', 'clear'],
    ['', 'create'],
    ['', 'test'],
    ['', 'server']
  ]).bindHelp();
  const opt = getOpt.parse(process.argv.slice(2));
  if (opt)
    console.log(opt);

}

export function initOptions() {
  if (!existsSync(optionsPath)) {
    createOptionsFile();
    throw new Error("Файл настроек 'personal-options.json' создан в корневой директории. "
      + "Внесите в него свои настройки и запустите сервер.");
  }
  options = readOptions();
  updateOptionsByConsoleFlags();
}
