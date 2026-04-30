// src/core/middleware/auth.middleware.ts
import { UserRole } from '@core/types/auth.types';
import { Request, Response, NextFunction } from 'express';

export const authorize = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Access Denied" });
        }
        next();
    };
};