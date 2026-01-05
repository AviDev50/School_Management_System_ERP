import express from "express";
import {
  getStudentDetailsById,
  updateStudent
} from "./student.controller.js";
import { authMiddleware, checkRole } from '../../middlewares/auth.middleware.js';
const router = express.Router();

router.get("/getStudentDetailsById/:student_id",getStudentDetailsById)


router.put(
  '/updateStudent',
  authMiddleware,
  checkRole(['school_admin']),
  updateStudent
);



export default router;
