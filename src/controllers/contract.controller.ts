import { Request, Response } from 'express';
import '../models/associations';
import Contract from '../models/Contract';
import AuditLog from '../models/AuditLog';
import { sendError } from '../utils/ErrorHandler';
import { sequelize } from '../core/db/connection';

type ContractParams = {
    id: string;
};

/**
 * GET /api/contracts
 * Returns all non-deleted contracts.
 */
export const getContracts = async (req: Request, res: Response) => {
    try {
        debugger
        const contracts = await Contract.findAll();
        return res.status(200).json(contracts);
    } catch (error: any) {
        return sendError(res, 500, 'Failed to fetch contracts', error.message);
    }
};

/**
 * GET /api/contracts/:id
 * Returns contract details plus the audit log history.
 */
export const getContractById = async (req: Request<ContractParams>, res: Response) => {
    debugger
    const { id } = req.params;
    
    try {
        const contract = await Contract.findByPk(id, {
            include: [{ model: AuditLog, as: 'audit_logs' }]
        });

        if (!contract) return sendError(res, 404, 'Contract not found');
        return res.status(200).json(contract);
    } catch (error: any) {
        return sendError(res, 500, 'Error retrieving contract', error.message);
    }
};

/**
 * POST /api/contracts
 * Creates a contract and an initial audit log within a transaction.
 */
export const createContract = async (req: any, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const { title, description } = req.body;
        const user = req.user as { id: string };

        // 1. Create the contract
        const contract = await Contract.create({
            title,
            description,
            status: 'draft',
            created_by: user.id
        }, { transaction });

        // 2. Create the initial audit log entry
        await AuditLog.create({
            contract_id: contract.id,
            action: 'CONTRACT_CREATED',
            performed_by: user.id,
            old_value: null,
            new_value: contract.toJSON()
        }, { transaction });

        // Commit both if successful
        await transaction.commit();
        return res.status(201).json(contract);

    } catch (error: any) {
        if (transaction) await transaction.rollback();
        return sendError(res, 400, 'Could not create contract: Transaction rolled back', error.message);
    }
};

/**
 * PATCH /api/contracts/:id/status
 * Updates status and logs change. Enforces final state guard for non-admins.
 */
export const updateContractStatus = async (req: any, res: Response) => {
    const { id } = req.params;
    const { status: newStatus } = req.body;
    const { id: userId, role: userRole } = req.user;

    const transaction = await sequelize.transaction();

    try {
        const contract = await Contract.findByPk(id, { transaction });

        if (!contract) {
            await transaction.rollback();
            return sendError(res, 404, 'Contract not found');
        }

        // Logic check: "any action on Approved/ Rejected" -> Admin: y, BU: n
        // Per WhatsApp Image 2026-04-30 at 2.15.03 PM.jpeg
        const isCurrentlyFinal = ['approved', 'rejected'].includes(contract.status);
        if (isCurrentlyFinal && userRole !== 'admin') {
            await transaction.rollback();
            return sendError(res, 403, `Forbidden: Only Admins can modify a contract in ${contract.status.toUpperCase()} state.`);
        }

        const oldStatus = contract.status;

        // 1. Update Contract Status
        await contract.update({ status: newStatus }, { transaction });

        // 2. Create Audit Log for the transition
        await AuditLog.create({
            contract_id: contract.id,
            action: 'STATUS_CHANGED',
            performed_by: userId,
            old_value: { status: oldStatus },
            new_value: { status: newStatus }
        }, { transaction });

        await transaction.commit();

        return res.status(200).json({
            message: 'Status updated and audited successfully',
            data: contract
        });

    } catch (error: any) {
        if (transaction) await transaction.rollback();
        return sendError(res, 500, 'Transaction failed: Update and Audit rolled back', error.message);
    }
};
