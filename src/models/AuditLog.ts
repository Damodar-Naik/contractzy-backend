import { Model, DataTypes } from 'sequelize';
import User from './User';
import Contract from './Contract';
import { sequelize } from '../core/db/connection';

class AuditLog extends Model {
    public id!: number;
    public contract_id!: string;
    public action!: string;
    public performed_by!: string;
    public old_value!: object;
    public new_value!: object;
}

// Field definitions live here; Sequelize associations are registered in src/models/associations.ts
AuditLog.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    contract_id: {
        type: DataTypes.UUID,
        references: { model: Contract, key: 'id' },
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false, // e.g., 'STATUS_CHANGED'
    },
    performed_by: {
        type: DataTypes.UUID,
        references: { model: User, key: 'id' },
    },
    old_value: {
        type: DataTypes.JSONB,
    },
    new_value: {
        type: DataTypes.JSONB,
    },
}, {
    sequelize,
    tableName: 'audit_logs',
    timestamps: true,
    createdAt: 'performed_at', // Map performed_at to standard createdAt
    updatedAt: false,
    underscored: true,
});

export default AuditLog;
