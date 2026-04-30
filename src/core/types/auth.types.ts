// src/core/types/auth.types.ts
export enum UserRole {
    ADMIN = 'ADMIN',
    LEGAL = 'LEGAL',
    SALES = 'SALES'
}

export interface AuthUser {
    id: number;
    tenantId: string; // Essential for SaaS multi-tenancy
    role: UserRole;
}

// Extend Express Request
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}