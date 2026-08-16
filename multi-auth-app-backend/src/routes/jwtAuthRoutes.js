import express from 'express';
import {
  register,
  login,
  getMe,
  inspectToken,
} from '../controllers/jwtAuthController.js';
import { protectJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.post('/inspect', inspectToken);

// Protected Routes
router.get('/me', protectJWT, getMe);

export default router;
