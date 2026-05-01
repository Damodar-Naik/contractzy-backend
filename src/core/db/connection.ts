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
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    dialectOptions: {
        // ✅ Fix 1: Always use SSL (Supabase requires it, even locally)
        ssl: {
            require: process.env.NODE_ENV === 'development' ? false : true,
            rejectUnauthorized: process.env.NODE_ENV === 'development' ? false : true
        },
        // ✅ Fix 2: CRITICAL for Port 6543 (Transaction Pooling)
        prepare: process.env.NODE_ENV === 'development' ? false :true,
    },
});

export const testConnection = async (): Promise<void> => {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connection: Established successfully.');
    console.log(`📊 DB_HOST: ${process.env.DB_HOST} | DB_NAME: ${process.env.DB_NAME}`);
};