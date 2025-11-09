import { Router } from 'express';
import {
  getAllSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
} from '../controllers/school.controller';
import { authenticate, requireAuth } from '../middleware/auth';

const router = Router();

// Public routes (no authentication required)
// GET /api/schools - Get all schools with optional pagination (public view)
router.get('/', getAllSchools);

// GET /api/schools/:id - Get a single school by ID (public view)
router.get('/:id', getSchoolById);

// Protected routes (authentication required)
// POST /api/schools - Create a new school
// Both admins and employees can create schools
router.post('/', authenticate, requireAuth, createSchool);

// PUT /api/schools/:id - Update a school
// Admins can update all, employees can only update their own
router.put('/:id', authenticate, requireAuth, updateSchool);

// DELETE /api/schools/:id - Delete a school
// Admins can delete all, employees can only delete their own
router.delete('/:id', authenticate, requireAuth, deleteSchool);

export default router;
