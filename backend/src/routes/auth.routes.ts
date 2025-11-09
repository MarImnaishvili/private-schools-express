import { Router } from 'express';
import { createEmployee } from '../controllers/auth.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// POST /api/auth/create-employee - Create a new employee (admin only)
router.post('/create-employee', authenticate, requireAdmin, createEmployee);

export default router;
