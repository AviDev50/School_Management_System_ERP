import express from "express";
import {
  updateStudent,
  updateTeacher,
  updateAccountant
} from "./accountant.controller.js";
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import {studentUpload} from "../../middlewares/student.multer.js";
import { teacherUpload } from "../../middlewares/teacher.multer.js";
import { accountantUpload } from "../../middlewares/accountant.multer.js";
import { checkPermission } from "../../middlewares/permission.middleware.js";
const router = express.Router();

router.put(
  "/updateStudent/:student_id",
  authMiddleware,
  checkPermission("edit_student"),
  studentUpload,
  updateStudent
);


router.put(
  "/updateTeacher/:teacher_id",
  authMiddleware,
  checkPermission("edit_teacher"),
  teacherUpload,
  updateTeacher
);

router.put(
  "/updateAccountant/:accountant_id",
  authMiddleware,
  checkPermission("edit_accountant"),
  accountantUpload,
  updateAccountant
);




export default router
