import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import database connection and test utility
import { sequelize, testConnection } from './config/database';
import './models/associations';

// Import Routes
import authRoutes from './routes/auth.routes';
import contractRoutes from './routes/contract.routes';

// Import Error Utilities
import { sendError } from './utils/ErrorHandler';

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Standard Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGINS?.split(',') || 'http://localhost:4200',
    credentials: true,
}));
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});

// 1. Health Check (Optional but good practice)
app.get('/health', (req, res) => res.status(200).send('OK'));

// 2. Routes
app.use('/api/auth', authRoutes);

app.use('/api/contracts', contractRoutes);

// 3. Global 404 Handler
app.use((req: Request, res: Response) => {
    sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
});

// 4. Global Error Handler (Handles 400, 401, 403, 404, 409, 500)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error] ${err.message}`);
    const status = err.status || 500;
    const message = err.message || 'An unexpected server error occurred';

    // Consistent error format: { error: string, details?: any }
    sendError(
        res,
        status,
        message,
        process.env.NODE_ENV === 'development' ? err.stack : undefined
    );
});

/**
 * Server Bootstrap Flow
 * 1. Test Database Connection
 * 2. Sync Models (Ensures Soft Delete columns exist)
 * 3. Start Listening
 */
const startServer = async () => {
    try {
        // Step 1: Verify DB Credentials and Connectivity
        await testConnection();

        // Step 2: Sync Schema (alter: true is fine for dev; use migrations for prod)
        // This ensures the deleted_at column from the image model is ready
        await sequelize.sync({ alter: false });
        console.log('✅ PostgreSQL Schema Synced');

        // Step 3: Start the Express Server
        app.listen(PORT, () => {
            console.log(`🚀 Server is flying at http://localhost:${PORT}`);
            console.log(`🔐 JWT Auth and RBAC enabled`);
        });
    } catch (error) {
        console.error('❌ Unable to start server:', error);
        process.exit(1);
    }
};

startServer();
