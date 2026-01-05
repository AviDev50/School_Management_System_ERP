// modules/authorization/authorization.routes.js
import express from 'express';
import * as authController from './authorization.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/login',authController.login);
//router.post('/super-admin/login', authController.superAdminLogin);
//router.post('/logout', authController.logout);

// Protected routes (authentication required)
// Token + Role check needed
router.get('/me', authMiddleware, authController.getCurrentUser);
//Here authmiddleware Token verify karta hai

//router.get('/dashboard', authMiddleware, checkRole(['school_admin']), getDashboard);
// here Token verify then Role check


export default router;