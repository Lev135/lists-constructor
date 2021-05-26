import { existsSync, readFileSync, writeFileSync } from "fs";
import { LoggerOptions } from "typeorm";
import GetOpt from 'node-getopt';

type RunBlock = 'dropDataBase' | 'syncDataBase' | 'clearTables' | 'createTestData' | 'runTests' | 'startServer'

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

function readOptions() : IPersonalOptions {
  const optionsStr = readFileSync(optionsPath, 'utf8').toString();
  return optionsStr.split(/(?={")/).map(x => JSON.parse(x))[0];
}

function createOptionsFile(path : string) : void {
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

interface RunOption {
  shortName : string;
  name : string;
  descr : string;
  runBlock : RunBlock;
}

const runOptions : RunOption[] = [
  { shortName : 'd',  name : 'drop',   runBlock : 'dropDataBase',    descr : "Drop database"    },
  { shortName : '',   name : 'sync',   runBlock : 'syncDataBase',    descr : "Sync database"    },
  { shortName : 'c',  name : 'clear',  runBlock : 'clearTables',     descr : "Clear tables"     },
  { shortName : '',   name : 'data',   runBlock : 'createTestData',  descr : "Create test data" },
  { shortName : 't',  name : 'test',   runBlock : 'runTests',        descr : "Run tests"        },
  { shortName : 's',  name : 'start',  runBlock : 'startServer',     descr : "Start server"     }
]



export function updateOptionsByConsole() {
  const getOpt = GetOpt.create(runOptions.map(opt => [
    opt.shortName, opt.name, opt.descr
  ])).bindHelp().parseSystem();

  runOptions.forEach(opt => {
    const curOptState = getOpt.options[opt.name];
    if (typeof(curOptState) == "boolean") {
      options.run[opt.runBlock] = curOptState;
    }
  });
}

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
  updateOptionsByConsole();
}
