import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/ErrorHandler';

export const authenticateJWT = (req: any, res: Response, next: NextFunction) => {
    debugger
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
            if (err) return sendError(res, 403, 'Token is invalid or expired');
            req.user = user; // Contains id and role
            next();
        });
    } else {
        sendError(res, 401, 'Authorization header missing');
    }
};

export const authorizeRole = (roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return sendError(res, 403, 'Access denied: Insufficient permissions');
        }
        next();
    };
};