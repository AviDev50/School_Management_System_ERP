import express from "express";
import {
  getStudentDetailsById,
} from "./student.controller.js";
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import {studentUpload} from "../../middlewares/student.multer.js"
import { teacherUpload } from "../../middlewares/teacher.multer.js";
import { accountantUpload } from "../../middlewares/accountant.multer.js";
import { checkPermission } from "../../middlewares/permission.middleware.js";

const router = express.Router();


router.get("/getStudentDetailsById/:student_id",getStudentDetailsById)






export default router;
