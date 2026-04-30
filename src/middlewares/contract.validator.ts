import { body, query } from 'express-validator';
import { validateResult } from './auth.validator';

export const contractCreateValidator = [
    body('title')
        .trim()
        .notEmpty().withMessage('Contract title is required')
        .isLength({ max: 120 }).withMessage('Contract title cannot exceed 120 characters'),
    body('description')
        .optional()
        .isString(),
    body('status')
        .optional()
        .isIn(['draft', 'pending_review', 'approved', 'rejected'])
        .withMessage('Invalid status'),
    validateResult
];

export const statusUpdateValidator = [
    body('status')
        .isIn(['draft', 'pending_review', 'approved', 'rejected'])
        .withMessage('A valid status is required for update'),
    validateResult
];

export const paginationValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    validateResult
];