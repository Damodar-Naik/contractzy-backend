import AuditLog from './AuditLog';
import Contract from './Contract';
import User from './User';

Contract.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'creator',
});

Contract.hasMany(AuditLog, {
  foreignKey: 'contract_id',
  as: 'audit_logs',
});

AuditLog.belongsTo(Contract, {
  foreignKey: 'contract_id',
  as: 'contract',
});

AuditLog.belongsTo(User, {
  foreignKey: 'performed_by',
  as: 'performed_by_user',
});

export { AuditLog, Contract, User };
