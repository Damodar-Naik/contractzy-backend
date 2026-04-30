import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
    const now = new Date();
    const passwordHash = await bcrypt.hash('Password123!', 10);

    const adminId = randomUUID();
    const buId = randomUUID();
    const viewerId = randomUUID();
    const serviceAgreementId = randomUUID();
    const officeLeaseId = randomUUID();
    const softwareLicenseId = randomUUID();

    await queryInterface.bulkInsert('users', [
      {
        id: adminId,
        name: 'Admin User',
        email: 'admin@contractzy.com',
        password_hash: passwordHash,
        role: 'admin',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: buId,
        name: 'Business User',
        email: 'bu@contractzy.com',
        password_hash: passwordHash,
        role: 'bu',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: viewerId,
        name: 'Viewer User',
        email: 'viewer@contractzy.com',
        password_hash: passwordHash,
        role: 'viewer',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    ], { transaction });

    await queryInterface.bulkInsert('contracts', [
      {
        id: serviceAgreementId,
        title: 'Service Agreement 2026',
        description: 'Annual maintenance contract for IT services.',
        status: 'draft',
        created_by: buId,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: officeLeaseId,
        title: 'Office Lease',
        description: 'Lease agreement for the main headquarters.',
        status: 'pending_review',
        created_by: buId,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        id: softwareLicenseId,
        title: 'Software License',
        description: 'Enterprise license for cloud tools.',
        status: 'approved',
        created_by: adminId,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    ], { transaction });

    await queryInterface.bulkInsert('audit_logs', [
      {
        contract_id: serviceAgreementId,
        action: 'CONTRACT_CREATED',
        performed_by: buId,
        old_value: null,
        new_value: JSON.stringify({
          id: serviceAgreementId,
          title: 'Service Agreement 2026',
          description: 'Annual maintenance contract for IT services.',
          status: 'draft',
          created_by: buId,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        }),
        performed_at: now,
      },
      {
        contract_id: officeLeaseId,
        action: 'CONTRACT_CREATED',
        performed_by: buId,
        old_value: null,
        new_value: JSON.stringify({
          id: officeLeaseId,
          title: 'Office Lease',
          description: 'Lease agreement for the main headquarters.',
          status: 'pending_review',
          created_by: buId,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        }),
        performed_at: now,
      },
      {
        contract_id: softwareLicenseId,
        action: 'CONTRACT_CREATED',
        performed_by: adminId,
        old_value: null,
        new_value: JSON.stringify({
          id: softwareLicenseId,
          title: 'Software License',
          description: 'Enterprise license for cloud tools.',
          status: 'approved',
          created_by: adminId,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        }),
        performed_at: now,
      },
    ], { transaction });

    await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete('audit_logs', {
        action: 'CONTRACT_CREATED',
      }, { transaction });

      await queryInterface.bulkDelete('contracts', {
        title: ['Service Agreement 2026', 'Office Lease', 'Software License'],
      }, { transaction });

      await queryInterface.bulkDelete('users', {
        email: ['admin@contractzy.com', 'bu@contractzy.com', 'viewer@contractzy.com'],
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
