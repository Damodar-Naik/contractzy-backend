
// src/core/services/audit.service.ts
import { Transaction } from 'sequelize';
import AuditLog from '../../models/AuditLog';

export const logActivity = async (
    userId: number,
    tenantId: string,
    action: string,
    t?: Transaction
) => {
    await AuditLog.create({ userId, tenantId, action, timestamp: new Date() }, { transaction: t });
};