import { Router } from 'express';
import { createMedia } from '../controllers/media.controller';

const router = Router();

// POST /api/media - Create multiple media items
router.post('/', createMedia);

export default router;
