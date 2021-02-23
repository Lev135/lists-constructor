import * as MySql from 'mysql'
import { options } from './personal-options-process';

async function execQuery(connection: MySql.Connection, query: string) {
    return new Promise<void>((res, rej) => {
        connection.query(query, (err: MySql.MysqlError | null) => {
            if (err) {
                rej(err);
                return;
            }
            res();
        });
    });
}

export async function connectToDatabase() {
    console.log("Подключение к базе данных MySql...");
    try {
        const connection = MySql.createConnection({
            host: options.dataBase.host,
            user: options.dataBase.user,
            port: options.dataBase.port,
            password: options.dataBase.password
        });
        console.log(`Подключение к базе данных прошло успешно`);
        return connection;
    }
    catch (err) {
        throw new Error(`Ошибка при подключении к базе данных: ${err.message}`);
    }
}

export function dropDatabase(connection: MySql.Connection): Promise<void> {
    return execQuery(connection, `DROP DATABASE IF EXISTS ${options.dataBase.name};`);
}

export function createDatabaseIfNotExists(connection: MySql.Connection): Promise<void> {
    return execQuery(connection, `CREATE DATABASE IF NOT EXISTS ${options.dataBase.name};`);
}

export function closeConnection(connection: MySql.Connection) : Promise<void> {
    return new Promise<void>((res, rej) => {
        connection.end((err?: MySql.MysqlError) => {
            if (err)
                rej(err);
            else
                res();
        });
    });
}
