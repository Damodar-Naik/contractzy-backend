// After
export enum UserRole {
    ADMIN = 'admin',
    BU = 'bu',
    VIEWER = 'viewer'
}

export interface AuthUser {
    id: string;        // UUID, not number
    role: UserRole;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}