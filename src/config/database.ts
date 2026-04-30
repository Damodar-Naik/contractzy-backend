import { Sequelize
} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// 1. Validate environment variables for high-priority reliability
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'
];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName
]);

if (missingEnvVars.length > 0) {
    throw new Error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')
  }`);
}
/**
 * Sequelize Instance Configuration
 * Optimized for PostgreSQL with specific handling for pooling and SSL
 */
const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
{
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT || '5432'),
        dialect: 'postgres',
  // Only log SQL queries in development mode to keep production logs clean
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        
        define: {
    // Global setting for Soft Deletes as requested
            paranoid: true,
            underscored: true, // Use snake_case for database columns (e.g., created_at)
            timestamps: true,
  },

        dialectOptions: {
    // Essential for many cloud Postgres providers (Supabase, DigitalOcean, AWS)
            ssl: process.env.DB_SSL === 'true' ? {
                require: true,
                rejectUnauthorized: false
    } : false,
    // Optimization for transaction pooling (relevant if using Port 6543)
            prepare: false,
  },

        pool: {
            max: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX) : 5,
            min: 0,
            acquire: 30000,
            idle: 10000
  },
  // Retry logic to handle transient network issues or cold starts
        retry: {
            match: [
                /ConnectionError/,
                /ConnectionRefusedError/,
                /ConnectionTimedOutError/,
                /TimeoutError/,
                /SequelizeConnectionError/
    ],
            max: 3
  }
}
);

/**
 * Utility to test the database connection
 */
const testConnection = async (retries = 3): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL Connection: Established successfully.');
        console.log(`📊 DB_HOST: ${process.env.DB_HOST
    } | DB_NAME: ${process.env.DB_NAME
    }`);
  } catch (error) {
        if (retries > 0) {
            console.error(`⚠️ Connection failed. Retrying... (${retries
      } attempts left)`);
            await new Promise(resolve => setTimeout(resolve,
      3000));
            return testConnection(retries - 1);
    }
        console.error('❌ Database connection error:', error);
        process.exit(1); // Exit process if DB is unreachable
  }
};

export { sequelize, testConnection
};
export default sequelize;