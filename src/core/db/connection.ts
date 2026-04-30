// src/core/db/connection.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: false,
});

// src/core/utils/transaction.ts
import { Transaction } from 'sequelize';

export async function runInTransaction<T>(
    work: (t: Transaction) => Promise<T>
): Promise<T> {
    return await sequelize.transaction(async (t) => {
        return await work(t);
    });
}