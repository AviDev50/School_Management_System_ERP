import express from "express";
import {
updateAccountant
} from "./accountant.controller.js";
import { authMiddleware,checkRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();
updateAccountant
router.put(
  '/updateAccountant',
  authMiddleware,
  checkRole(['school_admin']),
  updateAccountant
);

export default router
