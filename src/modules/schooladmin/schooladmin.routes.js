import express from "express";
import {
  registerTeacher,
  registerStudent,
  registerAccountant,
  getTotalStudentsList
} from "./schooladmin.controller.js";
import {authMiddleware} from "../../middlewares/auth.middleware.js";



const router = express.Router();

// // Only SCHOOL_ADMIN can create these users 
// router.post("/registerTeacher-",allowRoles("SCHOOL_ADMIN"), registerTeacher);
// router.post("/registerTeacher", allowRoles("SCHOOL_ADMIN"), registerStudent);
// router.post("/registerTeacher", allowRoles("SCHOOL_ADMIN"), registerAccountant);
router.post("/registerTeacher",registerTeacher);
router.post("/registerStudent",registerStudent);
router.post("/registerAccountant",registerAccountant);
router.post("/getTotalStudentsList",getTotalStudentsList);



export default router;
