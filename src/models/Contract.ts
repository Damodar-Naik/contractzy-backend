import { Model, DataTypes } from 'sequelize';
import User from './User';
import { sequelize } from '../core/db/connection';

class Contract extends Model {
    public id!: string;
    public title!: string;
    public description!: string;
    public status!: 'draft' | 'pending_review' | 'approved' | 'rejected';
    public created_by!: string;
}

// Field definitions live here; Sequelize associations are registered in src/models/associations.ts
Contract.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.ENUM('draft', 'pending_review', 'approved', 'rejected'),
        defaultValue: 'draft',
        allowNull: false,
    },
    created_by: {
        type: DataTypes.UUID,
        references: { model: User, key: 'id' },
    },
}, {
    sequelize,
    tableName: 'contracts',
    timestamps: true,
    paranoid: true, // Enables Soft Delete
    underscored: true,
});

export default Contract;
