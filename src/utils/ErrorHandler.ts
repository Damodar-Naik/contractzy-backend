import { Response } from 'express';

export const sendError = (res: Response, status: number, message: string, details?: any) => {
    return res.status(status).json({
        error: message,
        ...(details && { details })
    });
};