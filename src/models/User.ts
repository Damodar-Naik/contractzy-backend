import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../core/db/connection';

class User extends Model {
    public id!: string;
    public name!: string;
    public email!: string;
    public password_hash!: string;
    public role!: 'admin' | 'bu' | 'viewer';
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'bu', 'viewer'),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    paranoid: true, // Enables Soft Delete
    underscored: true,
});

export default User;