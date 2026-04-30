import { Router } from 'express';
import * as ctrl from '../controllers/contract.controller';
import { authenticateJWT, authorizeRole } from '../middlewares/auth.middleware';
import {
    contractCreateValidator,
    statusUpdateValidator,
    paginationValidator
} from '../middlewares/contract.validator';

const router = Router();

// Global middleware for all contract routes
router.use(authenticateJWT);

// 1. GET - Paginated list (Accessible by all roles: Admin, BU, Viewer)
router.get('/',
    paginationValidator,
    ctrl.getContracts
);

// 2. GET - Specific contract + Audit logs
router.get('/:id',
    ctrl.getContractById
);

// 3. POST - Create contract (Restricted to Admin & BU)
router.post('/',
    authorizeRole(['admin', 'bu']),
    contractCreateValidator,
    ctrl.createContract
);

// 4. PATCH - Status update (Restricted to Admin & BU + Lifecycle Guard in Controller)
router.patch('/:id/status',
    authorizeRole(['admin', 'bu']),
    statusUpdateValidator,
    ctrl.updateContractStatus
);

export default router;